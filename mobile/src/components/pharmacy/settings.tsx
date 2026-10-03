import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import {
  Bell,
  Boxes,
  Calendar,
  FileText,
  HelpCircle,
  IdCard,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Smartphone,
  Truck,
  Users,
} from 'lucide-react-native';

import {
  Badge,
  Card,
  ChipRow,
  PageTitle,
  SectionTitle,
  SettingRow,
} from '@/components/ui';
import { palette, radius, spacing } from '@/components/ui/theme';

const LOW_STOCK_OPTIONS = [
  { id: '5', label: '5 units' },
  { id: '10', label: '10 units' },
  { id: '25', label: '25 units' },
  { id: '50', label: '50 units' },
];

const EXPIRY_OPTIONS = [
  { id: '30', label: '30 days' },
  { id: '60', label: '60 days' },
  { id: '90', label: '90 days' },
  { id: '180', label: '180 days' },
];

export default function PharmacySettings({ onLogout }: { onLogout: () => void }) {
  const [notif, setNotif] = useState({
    lowStock: true,
    expiry: true,
    prescription: true,
    pickup: false,
  });
  const [threshold, setThreshold] = useState('25');
  const [expiry, setExpiry] = useState('90');
  const [reorder, setReorder] = useState({
    autoReorder: false,
    preferSupplier: true,
  });

  return (
    <View>
      <PageTitle title="Settings" subtitle="Manage your pharmacy account" />

      {/* Pharmacy Profile */}
      <SectionTitle>Pharmacy Profile</SectionTitle>
      <Card style={styles.group}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: palette.violetSoft }]}>
            <Package size={22} color={palette.violet} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.profileName}>CityCare Pharmacy</Text>
            <Text style={styles.profileRole}>Retail & Dispensing • Bhopal</Text>
          </View>
        </View>
        <View style={styles.contactBlock}>
          <ContactLine icon={<MapPin size={14} color={palette.textSecondary} />} text="Hoshangabad Road, Bhopal, MP 462026" />
          <ContactLine icon={<Phone size={14} color={palette.textSecondary} />} text="+91 755 400 5678" />
          <ContactLine icon={<Mail size={14} color={palette.textSecondary} />} text="care@citycarepharmacy.in" />
        </View>
        <SettingRow
          icon={<IdCard size={18} color={palette.violet} />}
          iconBg={palette.violetSoft}
          title="License & Registration"
          subtitle="DL-MP-BPL-2024-1234 • Valid till 2029"
          onPress={() => Alert.alert('License', 'View drug license & GST details.')}
          last
        />
      </Card>

      {/* Staff & Access */}
      <SectionTitle>Staff &amp; Access</SectionTitle>
      <Card style={styles.group}>
        <SettingRow
          icon={<Users size={18} color={palette.blue} />}
          iconBg={palette.blueSoft}
          title="Staff Management"
          subtitle="6 active staff members"
          onPress={() => Alert.alert('Staff', 'Manage pharmacy staff.')}
        />
        <SettingRow
          icon={<ShieldCheck size={18} color={palette.blue} />}
          iconBg={palette.blueSoft}
          title="Roles & Permissions"
          subtitle="Pharmacist, cashier, store manager"
          onPress={() => Alert.alert('Roles', 'Configure access levels.')}
          last
        />
      </Card>

      {/* Notifications */}
      <SectionTitle>Notifications</SectionTitle>
      <Card style={styles.group}>
        <ToggleRow
          icon={<Package size={18} color={palette.red} />}
          iconBg={palette.redSoft}
          title="Low-stock alerts"
          subtitle="When items drop below threshold"
          value={notif.lowStock}
          onValueChange={(v) => setNotif((s) => ({ ...s, lowStock: v }))}
        />
        <ToggleRow
          icon={<Calendar size={18} color={palette.amber} />}
          iconBg={palette.amberSoft}
          title="Expiry alerts"
          subtitle="Upcoming batch expirations"
          value={notif.expiry}
          onValueChange={(v) => setNotif((s) => ({ ...s, expiry: v }))}
        />
        <ToggleRow
          icon={<FileText size={18} color={palette.violet} />}
          iconBg={palette.violetSoft}
          title="New prescription alerts"
          subtitle="Incoming e-prescriptions"
          value={notif.prescription}
          onValueChange={(v) => setNotif((s) => ({ ...s, prescription: v }))}
        />
        <ToggleRow
          icon={<Bell size={18} color={palette.green} />}
          iconBg={palette.greenSoft}
          title="Patient pickup notifications"
          subtitle="When an order is ready for pickup"
          value={notif.pickup}
          onValueChange={(v) => setNotif((s) => ({ ...s, pickup: v }))}
          last
        />
      </Card>

      {/* Inventory Settings */}
      <SectionTitle>Inventory Settings</SectionTitle>
      <Card style={styles.group}>
        <View style={styles.thresholdHeader}>
          <View style={[styles.rowIcon, { backgroundColor: palette.redSoft }]}>
            <Boxes size={18} color={palette.red} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Low-stock threshold</Text>
            <Text style={styles.rowSubtitle}>Alert when stock falls below</Text>
          </View>
        </View>
        <ChipRow items={LOW_STOCK_OPTIONS} activeId={threshold} onSelect={setThreshold} />

        <View style={styles.divider} />

        <View style={styles.thresholdHeader}>
          <View style={[styles.rowIcon, { backgroundColor: palette.amberSoft }]}>
            <Calendar size={18} color={palette.amber} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Expiry warning period</Text>
            <Text style={styles.rowSubtitle}>Warn before a batch expires</Text>
          </View>
        </View>
        <ChipRow items={EXPIRY_OPTIONS} activeId={expiry} onSelect={setExpiry} />

        <View style={styles.divider} />

        <ToggleRow
          icon={<Truck size={18} color={palette.violet} />}
          iconBg={palette.violetSoft}
          title="Auto-reorder"
          subtitle="Generate purchase orders automatically"
          value={reorder.autoReorder}
          onValueChange={(v) => setReorder((s) => ({ ...s, autoReorder: v }))}
        />
        <ToggleRow
          icon={<ShieldCheck size={18} color={palette.violet} />}
          iconBg={palette.violetSoft}
          title="Prefer preferred supplier"
          subtitle="Route reorders to your primary vendor"
          value={reorder.preferSupplier}
          onValueChange={(v) => setReorder((s) => ({ ...s, preferSupplier: v }))}
          last
        />
        <View style={styles.thresholdNote}>
          <Badge label={`Alert below ${threshold} units • ${expiry}-day expiry window`} tone="warning" />
        </View>
      </Card>

      {/* Security */}
      <SectionTitle>Security</SectionTitle>
      <Card style={styles.group}>
        <SettingRow
          icon={<KeyRound size={18} color={palette.red} />}
          iconBg={palette.redSoft}
          title="Password & security"
          subtitle="Change password, 2-factor authentication"
          onPress={() => Alert.alert('Security', 'Update password and 2FA.')}
        />
        <SettingRow
          icon={<Smartphone size={18} color={palette.red} />}
          iconBg={palette.redSoft}
          title="Active sessions & devices"
          subtitle="1 active session"
          onPress={() => Alert.alert('Devices', 'Manage logged-in devices.')}
          last
        />
      </Card>

      {/* Audit & Activity */}
      <SectionTitle>Audit &amp; Activity</SectionTitle>
      <Card style={styles.group}>
        <SettingRow
          icon={<FileText size={18} color={palette.slate} />}
          iconBg={palette.slateSoft}
          title="Pharmacy activity logs"
          subtitle="Dispensing, stock & billing history"
          onPress={() => Alert.alert('Activity Logs', 'View full activity log.')}
          last
        />
      </Card>

      {/* Help & Support */}
      <SectionTitle>Help &amp; Support</SectionTitle>
      <Card style={styles.group}>
        <SettingRow
          icon={<HelpCircle size={18} color={palette.blue} />}
          iconBg={palette.blueSoft}
          title="Help center"
          subtitle="Guides and FAQs"
          onPress={() => Alert.alert('Help Center', 'Open help articles.')}
        />
        <SettingRow
          icon={<Phone size={18} color={palette.blue} />}
          iconBg={palette.blueSoft}
          title="Contact support"
          subtitle="24/7 pharmacy support"
          onPress={() => Alert.alert('Support', 'Contact CityCare support.')}
          last
        />
      </Card>

      <TouchableOpacity
        style={styles.logout}
        onPress={() =>
          Alert.alert('Log out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log out', style: 'destructive', onPress: onLogout },
          ])
        }
        activeOpacity={0.8}
      >
        <LogOut size={18} color={palette.red} />
        <Text style={styles.logoutTxt}>Log out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>CityCare Pharmacy • v2.2.0</Text>
    </View>
  );
}

function ContactLine({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.contactLine}>
      {icon}
      <Text style={styles.contactText}>{text}</Text>
    </View>
  );
}

function ToggleRow({
  icon,
  iconBg,
  title,
  subtitle,
  value,
  onValueChange,
  last,
}: {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.toggleRow, last && { borderBottomWidth: 0, paddingBottom: 0 }]}>
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: palette.border, true: palette.violet }}
        thumbColor={palette.white}
        ios_backgroundColor={palette.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: spacing.md },

  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 15, fontWeight: '700', color: palette.text },
  profileRole: { fontSize: 12, color: palette.textSecondary, marginTop: 2 },

  contactBlock: {
    backgroundColor: palette.background,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  contactLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  contactText: { fontSize: 12, color: palette.textSecondary, flex: 1 },

  rowIcon: { width: 38, height: 38, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 15, fontWeight: '600', color: palette.text },
  rowSubtitle: { fontSize: 12, color: palette.textSecondary, marginTop: 2 },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.divider,
  },

  thresholdHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  divider: { height: 1, backgroundColor: palette.divider, marginVertical: spacing.md },
  thresholdNote: { marginTop: spacing.md },

  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: 15,
    borderRadius: radius.md,
    backgroundColor: palette.card,
    borderWidth: 1.5,
    borderColor: palette.redSoft,
  },
  logoutTxt: { fontSize: 15, fontWeight: '700', color: palette.red },
  version: { fontSize: 11, color: palette.textMuted, textAlign: 'center', marginTop: spacing.lg, marginBottom: spacing.sm },
});
