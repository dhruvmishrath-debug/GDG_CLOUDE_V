import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import {
  Bell,
  Building2,
  Database,
  FileText,
  HelpCircle,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserPlus,
  UserRound,
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

const THRESHOLDS = [
  { id: '75', label: '75%' },
  { id: '80', label: '80%' },
  { id: '90', label: '90%' },
  { id: '95', label: '95%' },
];

export default function HospitalSettings({ onLogout }: { onLogout: () => void }) {
  const [notif, setNotif] = useState({
    verification: true,
    approvals: true,
    activity: false,
  });
  const [threshold, setThreshold] = useState('80');
  const [workflow, setWorkflow] = useState({
    autoAssign: true,
    requireDouble: false,
  });

  return (
    <View>
      <PageTitle title="Settings" subtitle="Administer your hospital account" />

      {/* Profile & Hospital Information */}
      <SectionTitle>Profile &amp; Hospital Information</SectionTitle>
      <Card style={styles.group}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: palette.violetSoft }]}>
            <Building2 size={22} color={palette.purple} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.profileName}>CityCare Multi-Speciality Hospital</Text>
            <Text style={styles.profileRole}>Admin Portal • Institution</Text>
          </View>
        </View>
        <View style={styles.contactBlock}>
          <ContactLine icon={<MapPin size={14} color={palette.textSecondary} />} text="Hoshangabad Road, Bhopal, MP 462026" />
          <ContactLine icon={<Phone size={14} color={palette.textSecondary} />} text="+91 755 400 1234" />
          <ContactLine icon={<Mail size={14} color={palette.textSecondary} />} text="admin@citycarehospital.in" />
        </View>
        <SettingRow
          icon={<UserRound size={18} color={palette.purple} />}
          iconBg={palette.violetSoft}
          title="Admin Profile"
          subtitle="Dr. Dhruv Mishra • Super Admin"
          onPress={() => Alert.alert('Admin Profile', 'Edit your personal details.')}
        />
        <SettingRow
          icon={<Building2 size={18} color={palette.purple} />}
          iconBg={palette.violetSoft}
          title="Hospital Registration"
          subtitle="HFR-MP-2024-00987 • NABH accredited"
          onPress={() => Alert.alert('Hospital Registration', 'View registration & accreditation.')}
          last
        />
      </Card>

      {/* Staff & Roles */}
      <SectionTitle>Staff &amp; Roles</SectionTitle>
      <Card style={styles.group}>
        <SettingRow
          icon={<Users size={18} color={palette.blue} />}
          iconBg={palette.blueSoft}
          title="Manage Staff"
          subtitle="48 active staff members"
          onPress={() => Alert.alert('Manage Staff', 'View and edit staff directory.')}
        />
        <SettingRow
          icon={<ShieldCheck size={18} color={palette.blue} />}
          iconBg={palette.blueSoft}
          title="Roles & Permissions"
          subtitle="Role-based access control"
          onPress={() => Alert.alert('Roles & Permissions', 'Configure role permissions.')}
        />
        <SettingRow
          icon={<UserPlus size={18} color={palette.blue} />}
          iconBg={palette.blueSoft}
          title="Invite Staff"
          subtitle="Send an onboarding invite"
          onPress={() => Alert.alert('Invite Staff', 'Send an email invitation.')}
          last
        />
      </Card>

      {/* Notifications */}
      <SectionTitle>Notifications</SectionTitle>
      <Card style={styles.group}>
        <ToggleRow
          icon={<FileText size={18} color={palette.green} />}
          iconBg={palette.greenSoft}
          title="Prescription verification alerts"
          subtitle="Notify when a prescription needs review"
          value={notif.verification}
          onValueChange={(v) => setNotif((s) => ({ ...s, verification: v }))}
        />
        <ToggleRow
          icon={<Bell size={18} color={palette.amber} />}
          iconBg={palette.amberSoft}
          title="Pending approval alerts"
          subtitle="Daily digest of pending approvals"
          value={notif.approvals}
          onValueChange={(v) => setNotif((s) => ({ ...s, approvals: v }))}
        />
        <ToggleRow
          icon={<Users size={18} color={palette.blue} />}
          iconBg={palette.blueSoft}
          title="Patient activity notifications"
          subtitle="New registrations and visits"
          value={notif.activity}
          onValueChange={(v) => setNotif((s) => ({ ...s, activity: v }))}
          last
        />
      </Card>

      {/* AI & Digitization */}
      <SectionTitle>AI &amp; Digitization</SectionTitle>
      <Card style={styles.group}>
        <View style={styles.thresholdHeader}>
          <View style={[styles.rowIcon, { backgroundColor: palette.violetSoft }]}>
            <Sparkles size={18} color={palette.purple} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>AI extraction preferences</Text>
            <Text style={styles.rowSubtitle}>Model: NVIDIA Nemotron 3.5 Lightning</Text>
          </View>
        </View>
        <Text style={styles.thresholdLabel}>Minimum confidence threshold</Text>
        <ChipRow items={THRESHOLDS} activeId={threshold} onSelect={setThreshold} />
        <View style={styles.thresholdNote}>
          <Badge label={`Fields below ${threshold}% flagged`} tone="warning" />
        </View>
        <View style={styles.divider} />
        <ToggleRow
          icon={<ShieldCheck size={18} color={palette.purple} />}
          iconBg={palette.violetSoft}
          title="Auto-assign for verification"
          subtitle="Route low-confidence fields to staff"
          value={workflow.autoAssign}
          onValueChange={(v) => setWorkflow((s) => ({ ...s, autoAssign: v }))}
        />
        <ToggleRow
          icon={<Lock size={18} color={palette.purple} />}
          iconBg={palette.violetSoft}
          title="Require double verification"
          subtitle="Two staff sign-off for critical records"
          value={workflow.requireDouble}
          onValueChange={(v) => setWorkflow((s) => ({ ...s, requireDouble: v }))}
          last
        />
      </Card>

      {/* Security */}
      <SectionTitle>Security</SectionTitle>
      <Card style={styles.group}>
        <SettingRow
          icon={<KeyRound size={18} color={palette.red} />}
          iconBg={palette.redSoft}
          title="Password & security"
          subtitle="Change password, 2-factor authentication"
          onPress={() => Alert.alert('Security', 'Update password and 2FA settings.')}
        />
        <SettingRow
          icon={<Smartphone size={18} color={palette.red} />}
          iconBg={palette.redSoft}
          title="Session & device management"
          subtitle="2 active sessions"
          onPress={() => Alert.alert('Devices', 'Manage logged-in devices.')}
          last
        />
      </Card>

      {/* Data & Privacy */}
      <SectionTitle>Data &amp; Privacy</SectionTitle>
      <Card style={styles.group}>
        <SettingRow
          icon={<FileText size={18} color={palette.slate} />}
          iconBg={palette.slateSoft}
          title="Audit logs"
          subtitle="Immutable clinical ledger history"
          onPress={() => Alert.alert('Audit Logs', 'View full ledger audit trail.')}
        />
        <SettingRow
          icon={<Database size={18} color={palette.slate} />}
          iconBg={palette.slateSoft}
          title="Data access controls"
          subtitle="Consent & sharing preferences"
          onPress={() => Alert.alert('Data Access', 'Configure data access controls.')}
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
          subtitle="24/7 priority support"
          onPress={() => Alert.alert('Support', 'Contact CityCare support.')}
          last
        />
      </Card>

      {/* Logout */}
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

      <Text style={styles.version}>CityCare Admin • v2.2.0</Text>
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
        trackColor={{ false: palette.border, true: palette.purple }}
        thumbColor={palette.white}
        ios_backgroundColor={palette.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: spacing.md },

  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
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

  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  thresholdLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  thresholdNote: { marginTop: spacing.sm },
  divider: { height: 1, backgroundColor: palette.divider, marginTop: spacing.md },

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
