import hashlib
import logging
import uuid
import boto3
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone

from app.ai.extraction import extract_prescription_data
from app.core.database import get_db
from app.core.config import get_settings
from app.models.hospital import MedicalDocument, DocumentType
from app.schemas.clinical import ExtractedField, ExtractedPrescription

logger = logging.getLogger(__name__)

router = APIRouter()
settings = get_settings()

s3_client = boto3.client(
    "s3",
    endpoint_url=settings.S3_ENDPOINT_URL,
    aws_access_key_id=settings.S3_ACCESS_KEY,
    aws_secret_access_key=settings.S3_SECRET_KEY,
    region_name=settings.S3_REGION
)

async def ensure_bucket_exists():
    try:
        s3_client.head_bucket(Bucket=settings.S3_BUCKET_NAME)
    except Exception:
        s3_client.create_bucket(Bucket=settings.S3_BUCKET_NAME)

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_type: DocumentType = DocumentType.OTHER,
    patient_id: uuid.UUID | None = None,
    db: AsyncSession = Depends(get_db)
):
    await ensure_bucket_exists()
    
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    # Tamper-evidence: content-addressed storage
    content_hash = hashlib.sha256(content).hexdigest()
    
    # Check if already exists
    result = await db.execute(select(MedicalDocument).where(MedicalDocument.content_hash == content_hash))
    existing = result.scalar_one_or_none()
    if existing:
        return {"message": "File already exists", "id": str(existing.id), "hash": content_hash}

    s3_key = f"{datetime.now(timezone.utc).strftime('%Y/%m/%d')}/{content_hash}_{file.filename}"
    
    try:
        s3_client.put_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=s3_key,
            Body=content,
            ContentType=file.content_type
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"S3 upload failed: {str(e)}")

    doc = MedicalDocument(
        patient_id=patient_id,
        document_type=document_type,
        original_filename=file.filename,
        content_hash=content_hash,
        s3_key=s3_key,
        file_size_bytes=len(content),
        mime_type=file.content_type
    )
    
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    
    return {
        "message": "Document uploaded successfully",
        "id": str(doc.id),
        "hash": content_hash,
        "s3_key": s3_key
    }


# ─── Serializers: ExtractedPrescription -> frontend shape ────────────────────


def _field(field: ExtractedField | None) -> dict | None:
    """Serialize a single extracted field for the frontend modal."""
    if field is None:
        return None
    if isinstance(field.value, (int, float)) and not isinstance(field.value, bool):
        value = field.value
    else:
        value = field.value if field.value is not None else ""
    return {
        "value": value,
        "confidence": round(field.confidence * 100),
        "status": field.status,
        "reason": field.reason,
    }


def serialize_for_portal(extraction: ExtractedPrescription) -> dict:
    """Map the backend schema to the shape consumed by the AI Scanner modal."""
    medicines = []
    investigations = []
    flags = []

    for med in extraction.medicines:
        name = med.medicine_name.value or "Unknown"
        strength = med.strength.value if med.strength and med.strength.value else ""
        dosage = med.dosage.value if med.dosage and med.dosage.value else ""
        frequency = med.frequency.value if med.frequency and med.frequency.value else ""
        duration = med.duration.value if med.duration and med.duration.value else ""

        display_name = f"{name} {strength}".strip()
        display_dosage = str(dosage)
        if duration:
            display_dosage = f"{display_dosage} ({duration})".strip()

        medicines.append(
            {
                "name": display_name,
                "dosage": display_dosage or "—",
                "frequency": str(frequency) or "—",
                "confidence": round(med.medicine_name.confidence * 100),
                "status": med.medicine_name.status,
            }
        )

        # Surface every flagged field as a human-readable AI flag.
        for label, extracted in (
            ("medicine name", med.medicine_name),
            ("strength", med.strength),
            ("dosage", med.dosage),
            ("frequency", med.frequency),
            ("duration", med.duration),
            ("quantity", med.quantity),
            ("food timing", med.before_after_food),
            ("instructions", med.instructions),
        ):
            if extracted is None:
                continue
            if extracted.status in ("needs_verification", "illegible"):
                flags.append(
                    {
                        "type": extracted.status,
                        "field": f"{name}:{label}",
                        "message": extracted.reason
                        or f"{label.capitalize()} for '{name}' requires verification.",
                    }
                )

    # Investigations are free-text in the schema; split on line breaks / commas.
    investigation_field = extraction.investigations
    if investigation_field and investigation_field.value:
        raw = str(investigation_field.value)
        for chunk in [c.strip() for c in raw.replace("\n", ",").split(",") if c.strip()]:
            investigations.append({"name": chunk, "confidence": round(investigation_field.confidence * 100)})
        if investigation_field.status in ("needs_verification", "illegible"):
            flags.append(
                {
                    "type": investigation_field.status,
                    "field": "investigations",
                    "message": investigation_field.reason
                    or "Investigation instructions require verification.",
                }
            )

    for label, extracted in (
        ("diagnosis", extraction.diagnosis),
        ("chief complaint", extraction.chief_complaint),
        ("observations", extraction.observations),
        ("follow-up", extraction.follow_up_instructions),
    ):
        if extracted is None:
            continue
        if extracted.status in ("needs_verification", "illegible"):
            flags.append(
                {
                    "type": extracted.status,
                    "field": label,
                    "message": extracted.reason
                    or f"{label.capitalize()} could not be read confidently.",
                }
            )

    confidences = [medicine["confidence"] for medicine in medicines]
    if extraction.diagnosis:
        confidences.append(round(extraction.diagnosis.confidence * 100))

    return {
        "diagnosis": _field(extraction.diagnosis),
        "patient": {
            "name": extraction.patient_name.value if extraction.patient_name else "Unknown",
            "age": extraction.patient_age.value if extraction.patient_age else "",
            "gender": extraction.patient_gender.value if extraction.patient_gender else "",
            "abha": "",
        }
        if extraction.patient_name
        else None,
        "doctor": extraction.doctor_name.value if extraction.doctor_name else None,
        "date": extraction.date.value if extraction.date else None,
        "medicines": medicines,
        "investigations": investigations,
        "followUp": _field(extraction.follow_up_instructions),
        "flags": flags,
        "overallConfidence": round(sum(confidences) / len(confidences)) if confidences else 0,
    }


# ─── AI analysis endpoint ────────────────────────────────────────────────────


@router.post("/analyze")
async def analyze_document(
    file: UploadFile = File(...),
    document_type: DocumentType = DocumentType.PRESCRIPTION,
    patient_id: uuid.UUID | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Upload a document and run the AI extraction pipeline.

    Pipeline: store to S3 -> Gemini vision OCR -> Nemotron structuring ->
    deterministic post-check. Returns frontend-ready structured data.
    """
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    content_hash = hashlib.sha256(content).hexdigest()
    s3_key = (
        f"{datetime.now(timezone.utc).strftime('%Y/%m/%d')}"
        f"/{content_hash}_{file.filename}"
    )

    # Best-effort storage: analysis should still work if S3/MinIO is unavailable.
    try:
        await ensure_bucket_exists()
        s3_client.put_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=s3_key,
            Body=content,
            ContentType=file.content_type,
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning("S3 storage skipped for %s: %s", file.filename, exc)

    # Best-effort DB link (content-addressed, dedupe by hash).
    document_id = None
    try:
        result = await db.execute(
            select(MedicalDocument).where(MedicalDocument.content_hash == content_hash)
        )
        doc = result.scalar_one_or_none()
        if doc is None:
            doc = MedicalDocument(
                patient_id=patient_id,
                document_type=document_type,
                original_filename=file.filename,
                content_hash=content_hash,
                s3_key=s3_key,
                file_size_bytes=len(content),
                mime_type=file.content_type or "application/octet-stream",
            )
            db.add(doc)
            await db.commit()
            await db.refresh(doc)
        document_id = str(doc.id)
    except Exception as exc:  # noqa: BLE001
        await db.rollback()
        logger.warning("Document DB link skipped: %s", exc)

    # Run the AI pipeline.
    try:
        extraction = await extract_prescription_data(
            content, file.content_type or "image/jpeg"
        )
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        logger.exception("Extraction pipeline failed")
        raise HTTPException(status_code=502, detail=f"AI extraction failed: {exc}") from exc

    data = serialize_for_portal(extraction)

    # Persist the extraction result for the audit trail (best effort).
    if document_id is not None:
        try:
            from app.models.hospital import ExtractionResult

            record = ExtractionResult(
                document_id=uuid.UUID(document_id),
                extracted_data=extraction.model_dump(mode="json"),
                model_used=settings.NVIDIA_MODEL,
                overall_confidence=data["overallConfidence"] / 100,
                status="pending",
            )
            db.add(record)
            await db.commit()
        except Exception as exc:  # noqa: BLE001
            await db.rollback()
            logger.warning("Extraction result persistence skipped: %s", exc)

    return {
        "message": "AI extraction complete",
        "document_id": document_id,
        "hash": content_hash,
        "model": settings.NVIDIA_MODEL,
        "extraction": data,
    }
