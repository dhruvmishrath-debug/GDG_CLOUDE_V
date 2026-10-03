/**
 * Sample medical-records dataset for the Admin Portal Records tab.
 * Structured to look like real HMIS output so the prototype feels complete.
 */

export type RecordCategory = 'prescription' | 'opd' | 'lab' | 'discharge' | 'other';
export type VerificationStatus = 'verified' | 'pending' | 'review';
export type DigitizationStatus = 'digitized' | 'processing' | 'failed';

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number; // 0-100
  flag?: 'needs_verification' | 'illegible';
}

export interface VerificationEvent {
  actor: string;
  action: string;
  at: string;
}

export interface MedicalRecord {
  id: string;
  patientName: string;
  patientId: string;
  category: RecordCategory;
  title: string;
  date: string;
  digitization: DigitizationStatus;
  verification: VerificationStatus;
  hospital: string;
  doctor: string;
  department: string;
  diagnosis: string;
  documentName: string;
  documentSize: string;
  createdAt: string;
  updatedAt: string;
  fields: ExtractedField[];
  history: VerificationEvent[];
}

export const CATEGORY_LABELS: Record<RecordCategory, string> = {
  prescription: 'Prescriptions',
  opd: 'OPD Records',
  lab: 'Lab Reports',
  discharge: 'Discharge Summaries',
  other: 'Other Documents',
};

export const CATEGORY_SHORT: Record<RecordCategory, string> = {
  prescription: 'Prescription',
  opd: 'OPD Record',
  lab: 'Lab Report',
  discharge: 'Discharge Summary',
  other: 'Document',
};

export const records: MedicalRecord[] = [
  {
    id: 'REC-2026-0481',
    patientName: 'Arjun Sharma',
    patientId: 'ARJ-829',
    category: 'prescription',
    title: 'Prescription — Amoxicillin 500mg',
    date: 'May 20, 2026',
    digitization: 'digitized',
    verification: 'verified',
    hospital: 'CityCare Multi-Speciality Hospital',
    doctor: 'Dr. Neha Kapoor',
    department: 'General Medicine',
    diagnosis: 'Upper Respiratory Tract Infection',
    documentName: 'prescription_arjun_200526.jpg',
    documentSize: '1.8 MB',
    createdAt: 'May 20, 2026 • 10:42 AM',
    updatedAt: 'May 20, 2026 • 11:05 AM',
    fields: [
      { label: 'Patient Name', value: 'Arjun Sharma', confidence: 99 },
      { label: 'Diagnosis', value: 'Upper Respiratory Tract Infection', confidence: 96 },
      { label: 'Medicine', value: 'Amoxicillin 500mg', confidence: 98 },
      { label: 'Dosage', value: '1-0-1 (5 days)', confidence: 97 },
      { label: 'Follow-up', value: 'After 5 days', confidence: 92 },
    ],
    history: [
      { actor: 'AI Digitization Engine', action: 'Document digitized', at: 'May 20, 2026 • 10:42 AM' },
      { actor: 'Dr. Neha Kapoor', action: 'All fields verified & approved', at: 'May 20, 2026 • 11:05 AM' },
    ],
  },
  {
    id: 'REC-2026-0479',
    patientName: 'Neha Kapoor',
    patientId: 'NEH-441',
    category: 'discharge',
    title: 'Discharge Summary — Cardiac Care',
    date: 'May 18, 2026',
    digitization: 'digitized',
    verification: 'pending',
    hospital: 'CityCare Multi-Speciality Hospital',
    doctor: 'Dr. Rakesh Mehta',
    department: 'Cardiology',
    diagnosis: 'Stable Angina',
    documentName: 'discharge_neha_180526.pdf',
    documentSize: '742 KB',
    createdAt: 'May 18, 2026 • 04:15 PM',
    updatedAt: 'May 18, 2026 • 04:15 PM',
    fields: [
      { label: 'Patient Name', value: 'Neha Kapoor', confidence: 98 },
      { label: 'Diagnosis', value: 'Stable Angina', confidence: 94 },
      { label: 'Admission Date', value: 'May 12, 2026', confidence: 95 },
      { label: 'Discharge Date', value: 'May 18, 2026', confidence: 96 },
      { label: 'Advice', value: 'Continue Atorvastatin 20mg', confidence: 88, flag: 'needs_verification' },
    ],
    history: [
      { actor: 'AI Digitization Engine', action: 'Document digitized', at: 'May 18, 2026 • 04:15 PM' },
    ],
  },
  {
    id: 'REC-2026-0477',
    patientName: 'Rahul Verma',
    patientId: 'RAH-992',
    category: 'lab',
    title: 'Lab Report — Lipid Profile',
    date: 'May 15, 2026',
    digitization: 'digitized',
    verification: 'review',
    hospital: 'CityCare Labs',
    doctor: 'Dr. Verma',
    department: 'Pathology',
    diagnosis: 'Dyslipidemia (suspected)',
    documentName: 'lipid_profile_rahul_150526.jpg',
    documentSize: '980 KB',
    createdAt: 'May 15, 2026 • 09:30 AM',
    updatedAt: 'May 15, 2026 • 09:34 AM',
    fields: [
      { label: 'Total Cholesterol', value: '245 mg/dL', confidence: 93 },
      { label: 'LDL', value: '165 mg/dL', confidence: 91 },
      { label: 'HDL', value: '38 mg/dL', confidence: 89, flag: 'needs_verification' },
      { label: 'Triglycerides', value: '210 mg/dL', confidence: 92 },
      { label: 'Reference Range', value: '[illegible]', confidence: 0, flag: 'illegible' },
    ],
    history: [
      { actor: 'AI Digitization Engine', action: 'Lab values extracted', at: 'May 15, 2026 • 09:34 AM' },
      { actor: 'System', action: 'Flagged: reference range illegible', at: 'May 15, 2026 • 09:34 AM' },
    ],
  },
  {
    id: 'REC-2026-0475',
    patientName: 'Ritika Singh',
    patientId: 'RIT-118',
    category: 'opd',
    title: 'OPD Card — General Checkup',
    date: 'May 14, 2026',
    digitization: 'digitized',
    verification: 'verified',
    hospital: 'CityCare Multi-Speciality Hospital',
    doctor: 'Dr. Neha Kapoor',
    department: 'General Medicine',
    diagnosis: 'Routine health check',
    documentName: 'opd_ritika_140526.jpg',
    documentSize: '1.2 MB',
    createdAt: 'May 14, 2026 • 11:20 AM',
    updatedAt: 'May 14, 2026 • 11:40 AM',
    fields: [
      { label: 'Patient Name', value: 'Ritika Singh', confidence: 99 },
      { label: 'BP', value: '120/80 mmHg', confidence: 97 },
      { label: 'Pulse', value: '72 bpm', confidence: 98 },
      { label: 'Weight', value: '58 kg', confidence: 96 },
      { label: 'Advice', value: 'Healthy diet, regular exercise', confidence: 94 },
    ],
    history: [
      { actor: 'AI Digitization Engine', action: 'OPD card digitized', at: 'May 14, 2026 • 11:20 AM' },
      { actor: 'Dr. Neha Kapoor', action: 'Verified', at: 'May 14, 2026 • 11:40 AM' },
    ],
  },
  {
    id: 'REC-2026-0472',
    patientName: 'Ramesh Gupta',
    patientId: 'RAM-556',
    category: 'prescription',
    title: 'Prescription — Diabetes Management',
    date: 'May 12, 2026',
    digitization: 'processing',
    verification: 'pending',
    hospital: 'CityCare Multi-Speciality Hospital',
    doctor: 'Dr. Verma',
    department: 'Endocrinology',
    diagnosis: 'Type 2 Diabetes Mellitus',
    documentName: 'prescription_ramesh_120526.jpg',
    documentSize: '2.1 MB',
    createdAt: 'May 12, 2026 • 02:05 PM',
    updatedAt: 'May 12, 2026 • 02:06 PM',
    fields: [
      { label: 'Patient Name', value: 'Ramesh Gupta', confidence: 97 },
      { label: 'Diagnosis', value: 'Type 2 Diabetes Mellitus', confidence: 94 },
      { label: 'Medicine', value: 'Metformin 500mg', confidence: 96 },
      { label: 'Frequency', value: '1-0-1', confidence: 90 },
    ],
    history: [
      { actor: 'AI Digitization Engine', action: 'Extraction in progress', at: 'May 12, 2026 • 02:06 PM' },
    ],
  },
  {
    id: 'REC-2026-0468',
    patientName: 'Kavita Rao',
    patientId: 'KAV-703',
    category: 'lab',
    title: 'Lab Report — Complete Blood Count',
    date: 'May 08, 2026',
    digitization: 'digitized',
    verification: 'verified',
    hospital: 'CityCare Labs',
    doctor: 'Dr. Verma',
    department: 'Pathology',
    diagnosis: 'Normal',
    documentName: 'cbc_kavita_080526.pdf',
    documentSize: '640 KB',
    createdAt: 'May 08, 2026 • 08:45 AM',
    updatedAt: 'May 08, 2026 • 09:10 AM',
    fields: [
      { label: 'Hemoglobin', value: '14.2 g/dL', confidence: 98 },
      { label: 'WBC', value: '6,800/mcL', confidence: 97 },
      { label: 'Platelets', value: '2.5 lakh', confidence: 96 },
    ],
    history: [
      { actor: 'AI Digitization Engine', action: 'Lab values extracted', at: 'May 08, 2026 • 08:45 AM' },
      { actor: 'Dr. Verma', action: 'Verified', at: 'May 08, 2026 • 09:10 AM' },
    ],
  },
  {
    id: 'REC-2026-0461',
    patientName: 'Sohail Khan',
    patientId: 'SOH-320',
    category: 'other',
    title: 'Insurance Pre-Authorization Form',
    date: 'May 05, 2026',
    digitization: 'failed',
    verification: 'review',
    hospital: 'CityCare Multi-Speciality Hospital',
    doctor: 'Admin Front Desk',
    department: 'Billing',
    diagnosis: '—',
    documentName: 'insurance_sohail_050526.pdf',
    documentSize: '320 KB',
    createdAt: 'May 05, 2026 • 12:00 PM',
    updatedAt: 'May 05, 2026 • 12:01 PM',
    fields: [
      { label: 'Policy Number', value: '[illegible]', confidence: 0, flag: 'illegible' },
      { label: 'Insurer', value: 'Star Health', confidence: 82, flag: 'needs_verification' },
    ],
    history: [
      { actor: 'AI Digitization Engine', action: 'Extraction failed — low quality scan', at: 'May 05, 2026 • 12:01 PM' },
    ],
  },
  {
    id: 'REC-2026-0455',
    patientName: 'Meera Nair',
    patientId: 'MEE-654',
    category: 'discharge',
    title: 'Discharge Summary — Orthopaedics',
    date: 'Apr 28, 2026',
    digitization: 'digitized',
    verification: 'verified',
    hospital: 'CityCare Multi-Speciality Hospital',
    doctor: 'Dr. S. Iyer',
    department: 'Orthopaedics',
    diagnosis: 'Closed tibial fracture',
    documentName: 'discharge_meera_280426.pdf',
    documentSize: '910 KB',
    createdAt: 'Apr 28, 2026 • 05:30 PM',
    updatedAt: 'Apr 28, 2026 • 06:12 PM',
    fields: [
      { label: 'Patient Name', value: 'Meera Nair', confidence: 99 },
      { label: 'Diagnosis', value: 'Closed tibial fracture', confidence: 95 },
      { label: 'Procedure', value: 'Below-knee cast application', confidence: 93 },
      { label: 'Follow-up', value: 'After 2 weeks', confidence: 91 },
    ],
    history: [
      { actor: 'AI Digitization Engine', action: 'Document digitized', at: 'Apr 28, 2026 • 05:30 PM' },
      { actor: 'Dr. S. Iyer', action: 'Verified', at: 'Apr 28, 2026 • 06:12 PM' },
    ],
  },
];
