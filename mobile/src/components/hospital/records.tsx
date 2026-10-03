import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  AlertTriangle,
  Calendar,
  ClipboardList,
  Download,
  FileCheck,
  FileSearch,
  FileText,
  FlaskConical,
  FolderOpen,
  Pencil,
  Share2,
  ShieldCheck,
  User,
} from 'lucide-react-native';

import DetailModal from '@/components/ui/detail-modal';
import {
  Badge,
  Card,
  ChipRow,
  ConfidenceChip,
  DetailRow,
  EmptyState,
  ErrorState,
  LoadingState,
  OutlineButton,
  PageTitle,
  PrimaryButton,
  SearchBar,
  SectionTitle,
} from '@/components/ui';
import { palette, radius, spacing, type StatusTone } from '@/components/ui/theme';
import {
  CATEGORY_LABELS,
  CATEGORY_SHORT,
  records as ALL_RECORDS,
  type MedicalRecord,
  type RecordCategory,
  type VerificationStatus,
} from '@/data/records';

const CATEGORY_ICONS: Record<RecordCategory, React.ReactNode> = {
  prescription: <ClipboardList size={20} color={palette.blue} />,
  opd: <FileText size={20} color={palette.purple} />,
  lab: <FlaskConical size={20} color={palette.green} />,
  discharge: <FileCheck size={20} color={palette.amber} />,
  other: <FolderOpen size={20} color={palette.slate} />,
};

const VERIFICATION_TONE: Record<VerificationStatus, StatusTone> = {
  verified: 'success',
  pending: 'warning',
  review: 'danger',
};

const VERIFICATION_LABEL: Record<VerificationStatus, string> = {
  verified: 'Verified',
  pending: 'Pending',
  review: 'Review Required',
};

const CATEGORY_TONE: Record<RecordCategory, StatusTone> = {
  prescription: 'info',
  opd: 'purple',
  lab: 'success',
  discharge: 'warning',
  other: 'neutral',
};

export default function MedicalRecords() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<RecordCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<MedicalRecord | null>(null);

  // Simulate an async fetch on mount.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const retry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 450);
  };

  const categoryItems = useMemo(() => {
    const counts = ALL_RECORDS.reduce<Record<string, number>>((acc, r) => {
      acc[r.category] = (acc[r.category] ?? 0) + 1;
      return acc;
    }, {});
    return [
      { id: 'all', label: 'All', count: ALL_RECORDS.length },
      ...(Object.keys(CATEGORY_LABELS) as RecordCategory[]).map((c) => ({
        id: c,
        label: CATEGORY_LABELS[c],
        count: counts[c] ?? 0,
      })),
    ];
  }, []);

  const statusItems = useMemo(() => {
    const counts = ALL_RECORDS.reduce<Record<string, number>>((acc, r) => {
      acc[r.verification] = (acc[r.verification] ?? 0) + 1;
      return acc;
    }, {});
    return [
      { id: 'all', label: 'All', count: ALL_RECORDS.length },
      { id: 'verified', label: 'Verified', count: counts.verified ?? 0 },
      { id: 'pending', label: 'Pending', count: counts.pending ?? 0 },
      { id: 'review', label: 'Review Required', count: counts.review ?? 0 },
    ];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_RECORDS.filter((r) => {
      if (category !== 'all' && r.category !== category) return false;
      if (statusFilter !== 'all' && r.verification !== statusFilter) return false;
      if (!q) return true;
      return (
        r.patientName.toLowerCase().includes(q) ||
        r.patientId.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.diagnosis.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    });
  }, [query, category, statusFilter]);

  if (loading) {
    return (
      <View>
        <PageTitle title="Medical Records" subtitle="Digitized patient documentation" />
        <LoadingState message="Loading medical records…" />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <PageTitle title="Medical Records" subtitle="Digitized patient documentation" />
        <ErrorState
          message="We couldn't load medical records. Please check your connection and try again."
          onRetry={retry}
        />
      </View>
    );
  }

  return (
    <View>
      <PageTitle title="Medical Records" subtitle="Digitized patient documentation" />

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search patient, prescription, diagnosis, ID…"
        onFilterPress={() => setFilterOpen((v) => !v)}
        filterActive={statusFilter !== 'all'}
      />

      {filterOpen ? (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>Verification status</Text>
          <ChipRow
            items={statusItems}
            activeId={statusFilter}
            onSelect={(id) => setStatusFilter(id as VerificationStatus | 'all')}
          />
        </View>
      ) : null}

      <ChipRow
        items={categoryItems}
        activeId={category}
        onSelect={(id) => setCategory(id as RecordCategory | 'all')}
      />

      {results.length === 0 ? (
        <EmptyState
          icon={<FileSearch size={26} color={palette.blue} />}
          title="No records found"
          message={
            query
              ? `No records match “${query}”. Try a different name, ID or diagnosis.`
              : 'No records match the selected filters.'
          }
          actionLabel="Clear filters"
          onAction={() => {
            setQuery('');
            setCategory('all');
            setStatusFilter('all');
          }}
        />
      ) : (
        <>
          <SectionTitle>
            {results.length} {results.length === 1 ? 'Record' : 'Records'}
          </SectionTitle>
          {results.map((record) => (
            <RecordCard key={record.id} record={record} onPress={() => setSelected(record)} />
          ))}
        </>
      )}

      <RecordDetail record={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

function RecordCard({ record, onPress }: { record: MedicalRecord; onPress: () => void }) {
  const digitized =
    record.digitization === 'digitized'
      ? 'Digitized'
      : record.digitization === 'processing'
      ? 'Processing'
      : 'Failed';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardTop}>
        <View style={styles.cardIcon}>{CATEGORY_ICONS[record.category]}</View>
        <View style={styles.cardHeadText}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {record.title}
          </Text>
          <View style={styles.cardPatientRow}>
            <User size={12} color={palette.textSecondary} />
            <Text style={styles.cardPatient} numberOfLines={1}>
              {record.patientName} • {record.patientId}
            </Text>
          </View>
        </View>
        <Badge label={VERIFICATION_LABEL[record.verification]} tone={VERIFICATION_TONE[record.verification]} />
      </View>

      <View style={styles.cardMetaRow}>
        <View style={styles.metaItem}>
          <Badge label={CATEGORY_SHORT[record.category]} tone={CATEGORY_TONE[record.category]} />
        </View>
        <View style={styles.metaItem}>
          <Calendar size={12} color={palette.textMuted} />
          <Text style={styles.metaText}>{record.date}</Text>
        </View>
        <View style={styles.metaItem}>
          <ShieldCheck
            size={12}
            color={record.digitization === 'digitized' ? palette.green : palette.amber}
          />
          <Text style={styles.metaText}>{digitized}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function RecordDetail({ record, onClose }: { record: MedicalRecord | null; onClose: () => void }) {
  if (!record) return null;

  const flagged = record.fields.some((f) => f.flag);

  return (
    <DetailModal
      visible={!!record}
      onClose={onClose}
      title={CATEGORY_SHORT[record.category]}
      subtitle={record.id}
      accentColor={palette.blue}
      actions={
        <>
          <View style={{ flex: 1 }}>
            <OutlineButton
              label="Download"
              icon={<Download size={16} color={palette.blue} />}
              onPress={() => Alert.alert('Download', `${record.documentName} saved to device.`)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              label={record.verification === 'verified' ? 'Verified' : 'Verify'}
              icon={<ShieldCheck size={16} color={palette.white} />}
              disabled={record.verification === 'verified'}
              onPress={() =>
                Alert.alert('Verify record', `Mark ${record.id} as verified?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Verify', onPress: () => Alert.alert('Verified', `${record.id} approved.`) },
                ])
              }
            />
          </View>
        </>
      }
    >
      {/* Status summary */}
      <Card style={styles.detailCard}>
        <Text style={styles.detailPatient}>{record.patientName}</Text>
        <Text style={styles.detailSub}>
          {record.patientId} • {record.doctor} • {record.department}
        </Text>
        <View style={styles.detailBadges}>
          <Badge label={VERIFICATION_LABEL[record.verification]} tone={VERIFICATION_TONE[record.verification]} />
          <Badge label={CATEGORY_SHORT[record.category]} tone={CATEGORY_TONE[record.category]} />
          <Badge
            label={record.digitization === 'digitized' ? 'Digitized' : record.digitization === 'processing' ? 'Processing' : 'Failed'}
            tone={record.digitization === 'digitized' ? 'success' : record.digitization === 'processing' ? 'info' : 'danger'}
          />
        </View>
      </Card>

      {/* Original document preview */}
      <SectionTitle>Original Document</SectionTitle>
      <View style={styles.preview}>
        <View style={styles.previewIcon}>
          <FileText size={30} color={palette.blue} />
        </View>
        <Text style={styles.previewName} numberOfLines={1}>
          {record.documentName}
        </Text>
        <Text style={styles.previewMeta}>{record.documentSize} • Scanned document</Text>
        <TouchableOpacity
          style={styles.previewBtn}
          onPress={() => Alert.alert('Preview', 'Opening document viewer…')}
          activeOpacity={0.8}
        >
          <Text style={styles.previewBtnTxt}>Open Preview</Text>
        </TouchableOpacity>
      </View>

      {/* AI extracted fields */}
      <View style={styles.sectionHeaderRow}>
        <SectionTitle style={{ marginBottom: 0 }}>AI-Extracted Fields</SectionTitle>
        {flagged ? (
          <View style={styles.flagHint}>
            <AlertTriangle size={12} color={palette.amber} />
            <Text style={styles.flagHintTxt}>Needs review</Text>
          </View>
        ) : null}
      </View>
      <Card style={styles.detailCard}>
        {record.fields.map((field, i) => (
          <View
            key={field.label}
            style={[styles.fieldRow, i === record.fields.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <Text style={[styles.fieldValue, field.flag === 'illegible' && { color: palette.red }]}>
                {field.value}
              </Text>
              {field.flag ? (
                <Text style={[styles.fieldFlag, field.flag === 'illegible' && { color: palette.red }]}>
                  {field.flag === 'illegible' ? 'Illegible — manual entry required' : 'Low confidence — verify'}
                </Text>
              ) : null}
            </View>
            <ConfidenceChip value={field.confidence} />
          </View>
        ))}
      </Card>

      {/* Extracted information */}
      <SectionTitle>Record Information</SectionTitle>
      <Card style={styles.detailCard}>
        <DetailRow label="Record ID" value={record.id} />
        <DetailRow label="Diagnosis" value={record.diagnosis} />
        <DetailRow label="Hospital" value={record.hospital} />
        <DetailRow label="Doctor" value={record.doctor} />
        <DetailRow label="Date" value={record.date} />
        <DetailRow label="Digitized on" value={record.createdAt} last />
      </Card>

      {/* Verification history */}
      <SectionTitle>Verification History</SectionTitle>
      <Card style={styles.detailCard}>
        {record.history.map((event, i) => (
          <View
            key={i}
            style={[styles.historyRow, i === record.history.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={styles.historyDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.historyAction}>{event.action}</Text>
              <Text style={styles.historyActor}>{event.actor}</Text>
            </View>
            <Text style={styles.historyTime}>{event.at}</Text>
          </View>
        ))}
        <Text style={styles.timestamp}>Last updated {record.updatedAt}</Text>
      </Card>

      {/* Secondary actions */}
      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={styles.actionTile}
          onPress={() => Alert.alert('Edit', `Edit fields for ${record.id}.`)}
          activeOpacity={0.8}
        >
          <Pencil size={18} color={palette.blue} />
          <Text style={styles.actionTileTxt}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionTile}
          onPress={() => Alert.alert('Share', `Share ${record.id} securely.`)}
          activeOpacity={0.8}
        >
          <Share2 size={18} color={palette.blue} />
          <Text style={styles.actionTileTxt}>Share</Text>
        </TouchableOpacity>
      </View>
    </DetailModal>
  );
}

const styles = StyleSheet.create({
  filterPanel: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: spacing.lg,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  card: {
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: palette.blueTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeadText: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: palette.text, marginBottom: 4 },
  cardPatientRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardPatient: { fontSize: 12, color: palette.textSecondary },
  cardMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.divider,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: palette.textSecondary, fontWeight: '500' },

  detailCard: { marginBottom: spacing.md },
  detailPatient: { fontSize: 18, fontWeight: '700', color: palette.text },
  detailSub: { fontSize: 13, color: palette.textSecondary, marginTop: 2 },
  detailBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },

  preview: {
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: palette.border,
    borderStyle: 'dashed',
    marginBottom: spacing.md,
  },
  previewIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: palette.blueTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  previewName: { fontSize: 14, fontWeight: '600', color: palette.text },
  previewMeta: { fontSize: 12, color: palette.textSecondary, marginTop: 2 },
  previewBtn: {
    marginTop: spacing.md,
    paddingVertical: 9,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: palette.blue,
  },
  previewBtnTxt: { color: palette.white, fontSize: 13, fontWeight: '600' },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flagHint: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.md, marginTop: spacing.sm },
  flagHintTxt: { fontSize: 11, fontWeight: '600', color: palette.amber },

  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.divider,
  },
  fieldLabel: { fontSize: 12, color: palette.textSecondary },
  fieldValue: { fontSize: 15, fontWeight: '600', color: palette.text, marginTop: 2 },
  fieldFlag: { fontSize: 11, color: palette.amber, marginTop: 2, fontWeight: '500' },

  historyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.divider,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.blue,
    marginTop: 4,
  },
  historyAction: { fontSize: 14, fontWeight: '600', color: palette.text },
  historyActor: { fontSize: 12, color: palette.textSecondary, marginTop: 2 },
  historyTime: { fontSize: 11, color: palette.textMuted, textAlign: 'right', maxWidth: 110 },
  timestamp: { fontSize: 11, color: palette.textMuted, marginTop: spacing.md },

  actionGrid: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  actionTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 13,
    borderRadius: radius.md,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  actionTileTxt: { fontSize: 14, fontWeight: '600', color: palette.blue },
});
