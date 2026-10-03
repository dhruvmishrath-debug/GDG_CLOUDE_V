import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Ban,
  Calendar,
  FileText,
  History as HistoryIcon,
  PackageMinus,
  PackagePlus,
  Share2,
  ShoppingCart,
  Truck,
  Undo2,
  User,
} from 'lucide-react-native';

import DetailModal from '@/components/ui/detail-modal';
import {
  Badge,
  Card,
  ChipRow,
  DetailRow,
  EmptyState,
  ErrorState,
  LoadingState,
  OutlineButton,
  PageTitle,
  SearchBar,
  SectionTitle,
} from '@/components/ui';
import { palette, radius, spacing, type StatusTone } from '@/components/ui/theme';
import {
  STATUS_LABELS,
  TYPE_LABELS,
  transactions as ALL_TXNS,
  type Transaction,
  type TransactionStatus,
  type TransactionType,
} from '@/data/pharmacy';

const TYPE_ICON: Record<TransactionType, (c: string) => React.ReactNode> = {
  dispensed: (c) => <ShoppingCart size={18} color={c} />,
  purchased: (c) => <Truck size={18} color={c} />,
  stock_added: (c) => <PackagePlus size={18} color={c} />,
  stock_adjusted: (c) => <PackageMinus size={18} color={c} />,
  return: (c) => <Undo2 size={18} color={c} />,
  expired: (c) => <Ban size={18} color={c} />,
  order: (c) => <FileText size={18} color={c} />,
};

const TYPE_COLOR: Record<TransactionType, string> = {
  dispensed: palette.green,
  purchased: palette.blue,
  stock_added: palette.violet,
  stock_adjusted: palette.amber,
  return: palette.blue,
  expired: palette.red,
  order: palette.purple,
};

const STATUS_TONE: Record<TransactionStatus, StatusTone> = {
  completed: 'success',
  pending: 'warning',
  cancelled: 'neutral',
  returned: 'info',
  expired: 'danger',
};

const DATE_FILTERS = [
  { id: 'all', label: 'All time' },
  { id: 'Today', label: 'Today' },
  { id: 'Yesterday', label: 'Yesterday' },
  { id: 'This Week', label: 'This week' },
  { id: 'Earlier', label: 'Earlier' },
];

export default function PharmacyHistory() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);

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

  const typeItems = useMemo(() => {
    const counts = ALL_TXNS.reduce<Record<string, number>>((acc, t) => {
      acc[t.type] = (acc[t.type] ?? 0) + 1;
      return acc;
    }, {});
    return [
      { id: 'all', label: 'All', count: ALL_TXNS.length },
      ...(Object.keys(TYPE_LABELS) as TransactionType[]).map((t) => ({
        id: t,
        label: TYPE_LABELS[t],
        count: counts[t] ?? 0,
      })),
    ];
  }, []);

  const statusItems = useMemo(
    () => [
      { id: 'all', label: 'All' },
      ...(Object.keys(STATUS_LABELS) as TransactionStatus[]).map((s) => ({
        id: s,
        label: STATUS_LABELS[s],
      })),
    ],
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_TXNS.filter((t) => {
      if (dateFilter !== 'all' && t.dateGroup !== dateFilter) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        t.medicineName.toLowerCase().includes(q) ||
        (t.patientName ?? '').toLowerCase().includes(q) ||
        (t.patientId ?? '').toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        (t.prescriptionId ?? '').toLowerCase().includes(q)
      );
    });
  }, [query, dateFilter, typeFilter, statusFilter]);

  const activeFilterCount =
    (dateFilter !== 'all' ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

  if (loading) {
    return (
      <View>
        <PageTitle title="History" subtitle="Pharmacy activity &amp; transactions" />
        <LoadingState message="Loading transaction history…" />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <PageTitle title="History" subtitle="Pharmacy activity &amp; transactions" />
        <ErrorState
          message="We couldn't load transaction history. Please try again."
          onRetry={retry}
        />
      </View>
    );
  }

  return (
    <View>
      <PageTitle title="History" subtitle="Pharmacy activity & transactions" />

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search medicine, patient, RX or TXN…"
        onFilterPress={() => setFilterOpen((v) => !v)}
        filterActive={activeFilterCount > 0}
      />

      {filterOpen ? (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>Date</Text>
          <ChipRow items={DATE_FILTERS} activeId={dateFilter} onSelect={setDateFilter} />
          <Text style={styles.filterLabel}>Status</Text>
          <ChipRow
            items={statusItems}
            activeId={statusFilter}
            onSelect={(id) => setStatusFilter(id as TransactionStatus | 'all')}
          />
        </View>
      ) : null}

      <ChipRow
        items={typeItems}
        activeId={typeFilter}
        onSelect={(id) => setTypeFilter(id as TransactionType | 'all')}
      />

      {results.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon size={26} color={palette.violet} />}
          title="No transactions found"
          message={
            query
              ? `No transactions match “${query}”. Try a different medicine, patient or TXN ID.`
              : 'No transactions match the selected filters.'
          }
          actionLabel="Clear filters"
          onAction={() => {
            setQuery('');
            setDateFilter('all');
            setTypeFilter('all');
            setStatusFilter('all');
          }}
        />
      ) : (
        <>
          <SectionTitle>
            {results.length} {results.length === 1 ? 'Transaction' : 'Transactions'}
          </SectionTitle>
          {results.map((txn) => (
            <HistoryCard key={txn.id} txn={txn} onPress={() => setSelected(txn)} />
          ))}
        </>
      )}

      <TransactionDetail txn={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

function HistoryCard({ txn, onPress }: { txn: Transaction; onPress: () => void }) {
  const color = TYPE_COLOR[txn.type];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardTop}>
        <View style={[styles.cardIcon, { backgroundColor: `${color}1A` }]}>
          {TYPE_ICON[txn.type](color)}
        </View>
        <View style={styles.cardHeadText}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {txn.medicineName}
          </Text>
          <Text style={styles.cardSub} numberOfLines={1}>
            {txn.quantity} {txn.unit} • {txn.id}
          </Text>
        </View>
        <Badge label={STATUS_LABELS[txn.status]} tone={STATUS_TONE[txn.status]} />
      </View>

      {txn.patientName ? (
        <View style={styles.patientRow}>
          <User size={12} color={palette.textSecondary} />
          <Text style={styles.patientText}>
            {txn.patientName} • {txn.patientId}
          </Text>
        </View>
      ) : null}

      <View style={styles.cardMetaRow}>
        <Badge label={TYPE_LABELS[txn.type]} tone="neutral" />
        <View style={styles.metaItem}>
          <Calendar size={12} color={palette.textMuted} />
          <Text style={styles.metaText}>{txn.dateTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function TransactionDetail({ txn, onClose }: { txn: Transaction | null; onClose: () => void }) {
  if (!txn) return null;
  const color = TYPE_COLOR[txn.type];

  return (
    <DetailModal
      visible={!!txn}
      onClose={onClose}
      title="Transaction Details"
      subtitle={txn.id}
      accentColor={palette.violet}
      actions={
        <>
          <View style={{ flex: 1 }}>
            <OutlineButton
              label="Share Receipt"
              color={palette.violet}
              icon={<Share2 size={16} color={palette.violet} />}
              onPress={() => Alert.alert('Share', `Receipt for ${txn.id} shared securely.`)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <OutlineButton
              label="Download"
              color={palette.blue}
              icon={<FileText size={16} color={palette.blue} />}
              onPress={() => Alert.alert('Download', `${txn.id} invoice saved.`)}
            />
          </View>
        </>
      }
    >
      <Card style={styles.detailCard}>
        <View style={styles.detailHead}>
          <View style={[styles.detailIcon, { backgroundColor: `${color}1A` }]}>
            {TYPE_ICON[txn.type](color)}
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.detailMedicine} numberOfLines={1}>
              {txn.medicineName}
            </Text>
            <Text style={styles.detailType}>{TYPE_LABELS[txn.type]}</Text>
          </View>
        </View>
        <View style={styles.detailBadges}>
          <Badge label={STATUS_LABELS[txn.status]} tone={STATUS_TONE[txn.status]} />
          <Badge label={`${txn.quantity} ${txn.unit}`} tone="neutral" />
        </View>
      </Card>

      <SectionTitle>Transaction Information</SectionTitle>
      <Card style={styles.detailCard}>
        <DetailRow label="Transaction ID" value={txn.id} />
        <DetailRow label="Type" value={TYPE_LABELS[txn.type]} />
        <DetailRow label="Batch" value={txn.batch} />
        <DetailRow label="Quantity" value={`${txn.quantity} ${txn.unit}`} />
        <DetailRow label="Date & time" value={txn.dateTime} />
        <DetailRow label="Handled by" value={txn.staff} />
        <DetailRow label="Reference" value={txn.reference} />
        <DetailRow label="Amount" value={txn.amount} last />
      </Card>

      {(txn.patientName || txn.prescriptionId || txn.supplier) && (
        <>
          <SectionTitle>Linked Records</SectionTitle>
          <Card style={styles.detailCard}>
            {txn.patientName ? (
              <DetailRow label="Patient" value={`${txn.patientName} (${txn.patientId})`} />
            ) : null}
            {txn.prescriptionId ? (
              <DetailRow label="Prescription" value={txn.prescriptionId} />
            ) : null}
            {txn.supplier ? <DetailRow label="Supplier" value={txn.supplier} /> : null}
            <DetailRow label="Status" value={STATUS_LABELS[txn.status]} last />
          </Card>
        </>
      )}

      <SectionTitle>Notes</SectionTitle>
      <Card style={styles.detailCard}>
        <Text style={styles.notes}>{txn.notes}</Text>
      </Card>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeadText: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: palette.text, marginBottom: 4 },
  cardSub: { fontSize: 12, color: palette.textSecondary },
  patientRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm },
  patientText: { fontSize: 12, color: palette.textSecondary },
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
  detailHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  detailIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailMedicine: { fontSize: 17, fontWeight: '700', color: palette.text },
  detailType: { fontSize: 13, color: palette.textSecondary, marginTop: 2 },
  detailBadges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  notes: { fontSize: 14, color: palette.text, lineHeight: 21 },
});
