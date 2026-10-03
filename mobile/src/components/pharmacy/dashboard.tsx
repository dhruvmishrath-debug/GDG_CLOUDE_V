import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  FileText,
  Package,
  ScanLine,
  ShoppingCart,
  TrendingUp,
  Undo2,
} from 'lucide-react-native';

import { Card, SectionTitle } from '@/components/ui';
import { palette, radius, spacing } from '@/components/ui/theme';

const STATS = [
  { label: 'Total Items', value: '1,452', icon: <Package size={18} color={palette.violet} />, bg: palette.violetSoft },
  { label: 'Low Stock', value: '24', icon: <AlertTriangle size={18} color={palette.red} />, bg: palette.redSoft },
  { label: 'Expiring', value: '8', icon: <Calendar size={18} color={palette.amber} />, bg: palette.amberSoft },
  { label: 'Today Sales', value: '₹12.4k', icon: <TrendingUp size={18} color={palette.green} />, bg: palette.greenSoft },
];

const RECENT = [
  { patient: 'Arjun Sharma', id: 'RX-8821', time: '10 mins ago', status: 'Ready' },
  { patient: 'Neha Kapoor', id: 'RX-9987', time: '1 hour ago', status: 'Pending' },
  { patient: 'Ramesh Gupta', id: 'RX-9923', time: '3 hours ago', status: 'Dispensed' },
];

const LOW_STOCK = [
  { name: 'Metformin 500mg', left: 8, unit: 'units' },
  { name: 'Paracetamol 650mg', left: 24, unit: 'units' },
  { name: 'Amoxicillin 500mg', left: 31, unit: 'units' },
];

export default function PharmacyDashboard({
  onScan,
  onViewInventory,
}: {
  onScan: () => void;
  onViewInventory: () => void;
}) {
  return (
    <View>
      <View style={styles.statsGrid}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: s.bg }]}>{s.icon}</View>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={onScan} activeOpacity={0.75}>
          <View style={[styles.actionIcon, { backgroundColor: palette.violetSoft }]}>
            <ScanLine size={24} color={palette.violet} />
          </View>
          <Text style={styles.actionText}>Scan Prescription</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onViewInventory} activeOpacity={0.75}>
          <View style={[styles.actionIcon, { backgroundColor: palette.blueSoft }]}>
            <Package size={24} color={palette.blue} />
          </View>
          <Text style={styles.actionText}>Manage Stock</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('New Purchase', 'Create a purchase order.')}
          activeOpacity={0.75}
        >
          <View style={[styles.actionIcon, { backgroundColor: palette.greenSoft }]}>
            <ShoppingCart size={24} color={palette.green} />
          </View>
          <Text style={styles.actionText}>New Purchase</Text>
        </TouchableOpacity>
      </View>

      <SectionTitle>Recent Prescriptions</SectionTitle>
      <Card style={styles.listCard}>
        {RECENT.map((rx, idx) => (
          <TouchableOpacity
            key={rx.id}
            style={[styles.listRow, idx === RECENT.length - 1 && { borderBottomWidth: 0 }]}
            onPress={() => Alert.alert(rx.id, `Patient: ${rx.patient}\nStatus: ${rx.status}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.rxIcon, { backgroundColor: rx.status === 'Ready' ? palette.violetSoft : palette.slateSoft }]}>
              <FileText size={18} color={rx.status === 'Ready' ? palette.violet : palette.textSecondary} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.listTitle}>{rx.patient}</Text>
              <Text style={styles.listSub}>{rx.id} • {rx.time}</Text>
            </View>
            <Text
              style={[
                styles.statusText,
                { color: rx.status === 'Ready' ? palette.violet : rx.status === 'Pending' ? palette.amber : palette.textSecondary },
              ]}
            >
              {rx.status}
            </Text>
          </TouchableOpacity>
        ))}
      </Card>

      <SectionTitle>Low Stock Alerts</SectionTitle>
      <Card style={styles.listCard}>
        {LOW_STOCK.map((item, idx) => (
          <View
            key={item.name}
            style={[styles.listRow, idx === LOW_STOCK.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={[styles.rxIcon, { backgroundColor: palette.redSoft }]}>
              <Undo2 size={18} color={palette.red} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.listTitle}>{item.name}</Text>
              <Text style={styles.listSub}>{item.left} {item.unit} remaining</Text>
            </View>
            <ChevronRight size={18} color={palette.textMuted} />
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md, marginBottom: spacing.xxl },
  statCard: {
    width: '48%',
    backgroundColor: palette.card,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.border,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: { fontSize: 22, fontWeight: '700', color: palette.text },
  statLabel: { fontSize: 12, color: palette.textSecondary, marginTop: 2 },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text, marginBottom: spacing.md, marginTop: spacing.sm },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xxl },
  actionBtn: { width: '31%', alignItems: 'center' },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionText: { fontSize: 12, fontWeight: '600', color: palette.text, textAlign: 'center' },

  listCard: { paddingVertical: 0, marginBottom: spacing.md },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.divider,
  },
  rxIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTitle: { fontSize: 14, fontWeight: '600', color: palette.text },
  listSub: { fontSize: 12, color: palette.textSecondary, marginTop: 2 },
  statusText: { fontSize: 12, fontWeight: '700' },
});
