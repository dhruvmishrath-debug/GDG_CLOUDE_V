import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, Users, FileText, Activity, Bell, LogOut, UserPlus, FilePlus, Settings, Search, Clock, ShieldCheck, User } from 'lucide-react-native';

import AppHeader from '@/components/app-header';
import TabBar from '@/components/ui/tab-bar';
import MedicalRecords from '@/components/hospital/records';
import HospitalSettings from '@/components/hospital/settings';
import { useTabBackHandler } from '@/hooks/use-tab-back';

export default function HospitalPortal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  useTabBackHandler(activeTab, 'dashboard', setActiveTab);

  const renderDashboard = () => (
    <>
      {/* Hero Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#DBEAFE' }]}><Users size={20} color="#2563EB" /></View>
          <Text style={styles.statLabel}>Total Patients</Text>
          <Text style={styles.statValue}>1,248</Text>
          <Text style={styles.statTrend}>+12 this week</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#ECFDF5' }]}><Activity size={20} color="#10B981" /></View>
          <Text style={styles.statLabel}>OPD Visits</Text>
          <Text style={styles.statValue}>432</Text>
          <Text style={styles.statTrend}>+8% vs last month</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#F3E8FF' }]}><FileText size={20} color="#9333EA" /></View>
          <Text style={styles.statLabel}>Digitized Records</Text>
          <Text style={styles.statValue}>3,890</Text>
          <Text style={styles.statTrend}>98.5% accuracy</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}><ShieldCheck size={20} color="#D97706" /></View>
          <Text style={styles.statLabel}>Pending Approvals</Text>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statTrendAction}>Review now</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Hospital Operations</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('New Patient', 'Open patient registration flow')} activeOpacity={0.7}>
          <View style={[styles.actionIconBox, { backgroundColor: '#DBEAFE' }]}><UserPlus size={24} color="#2563EB" /></View>
          <Text style={styles.actionText}>Register Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Digitize', 'Open bulk document scanner')} activeOpacity={0.7}>
          <View style={[styles.actionIconBox, { backgroundColor: '#ECFDF5' }]}><FilePlus size={24} color="#10B981" /></View>
          <Text style={styles.actionText}>Bulk Digitize</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Manage Staff', 'Open staff management')} activeOpacity={0.7}>
          <View style={[styles.actionIconBox, { backgroundColor: '#F3E8FF' }]}><Building2 size={24} color="#9333EA" /></View>
          <Text style={styles.actionText}>Manage Staff</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Approvals / Ledger */}
      <Text style={styles.sectionTitle}>Ledger Activity</Text>
      <View style={styles.ledgerCard}>
        {[
          { patient: 'Arjun Sharma', id: 'ARJ-829', action: 'Prescription Digitized', time: '10 mins ago', status: 'verified' },
          { patient: 'Neha Kapoor', id: 'NEH-441', action: 'Discharge Summary', time: '2 hours ago', status: 'pending' },
          { patient: 'Rahul Verma', id: 'RAH-992', action: 'OPD Card Updated', time: '5 hours ago', status: 'verified' },
        ].map((item, idx) => (
          <View key={idx} style={styles.ledgerItem}>
            <View style={[styles.ledgerDot, { backgroundColor: item.status === 'verified' ? '#10B981' : '#F59E0B' }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.ledgerAction}>{item.action}</Text>
              <Text style={styles.ledgerPatient}>{item.patient} ({item.id})</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.ledgerTime}>{item.time}</Text>
              <Text style={[styles.ledgerStatus, { color: item.status === 'verified' ? '#10B981' : '#D97706' }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );

  const renderPatients = () => (
    <>
      <View style={styles.searchContainer}>
        <Search size={20} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or ABHA ID..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <Text style={styles.sectionTitle}>Patient Directory</Text>
      {[
        { name: 'Arjun Sharma', abha: '14-1234-5678-9012', age: 34, gender: 'Male', lastVisit: 'Today', status: 'In-Patient' },
        { name: 'Ritika Singh', abha: '14-8833-2211-5544', age: 28, gender: 'Female', lastVisit: '2 days ago', status: 'OPD' },
        { name: 'Ramesh Gupta', abha: '14-5566-7788-9900', age: 55, gender: 'Male', lastVisit: '1 week ago', status: 'Discharged' },
      ].map((p, i) => (
        <TouchableOpacity key={i} style={styles.patientCard} onPress={() => Alert.alert('Patient Info', `Viewing profile for ${p.name}`)}>
          <View style={styles.patientHeader}>
            <View style={styles.patientAvatar}><User size={24} color="#2563EB" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.patientName}>{p.name}</Text>
              <Text style={styles.patientId}>ABHA: {p.abha}</Text>
            </View>
            <View style={[styles.patientBadge, { backgroundColor: p.status === 'In-Patient' ? '#FEE2E2' : p.status === 'OPD' ? '#DBEAFE' : '#ECFDF5' }]}>
              <Text style={[styles.patientBadgeTxt, { color: p.status === 'In-Patient' ? '#EF4444' : p.status === 'OPD' ? '#2563EB' : '#10B981' }]}>{p.status}</Text>
            </View>
          </View>
          <View style={styles.patientMeta}>
            <Text style={styles.patientMetaTxt}>{p.age} yrs • {p.gender}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Clock size={12} color="#64748B" />
              <Text style={styles.patientMetaTxt}>Last: {p.lastVisit}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <AppHeader
        title="CityCare Hospital"
        subtitle="Admin Portal"
        icon={<Building2 size={20} color="#9333EA" />}
        iconBackgroundColor="#F3E8FF"
        actions={[
          {
            accessibilityLabel: 'Notifications',
            icon: <Bell size={20} color="#64748B" />,
            onPress: () => Alert.alert('Notifications', 'No new notifications'),
          },
          {
            accessibilityLabel: 'Log out',
            icon: <LogOut size={20} color="#EF4444" />,
            onPress: () => router.replace('/'),
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'patients' && renderPatients()}
        {activeTab === 'records' && <MedicalRecords />}
        {activeTab === 'settings' && <HospitalSettings onLogout={() => router.replace('/')} />}
        <View style={{ height: 24 }} />
      </ScrollView>

      <TabBar
        activeId={activeTab}
        onSelect={setActiveTab}
        activeColor="#9333EA"
        tabs={[
          { id: 'dashboard', label: 'Dashboard', renderIcon: (a) => <Activity size={24} color={a ? '#9333EA' : '#94A3B8'} /> },
          { id: 'patients', label: 'Patients', renderIcon: (a) => <Users size={24} color={a ? '#9333EA' : '#94A3B8'} /> },
          { id: 'records', label: 'Records', renderIcon: (a) => <FileText size={24} color={a ? '#9333EA' : '#94A3B8'} /> },
          { id: 'settings', label: 'Settings', renderIcon: (a) => <Settings size={24} color={a ? '#9333EA' : '#94A3B8'} /> },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 16, marginTop: 8 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: '#fff', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 13, color: '#64748B', marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  statTrend: { fontSize: 11, color: '#10B981' },
  statTrendAction: { fontSize: 11, color: '#D97706', fontWeight: '600' },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  actionBtn: { width: '31%', backgroundColor: '#fff', padding: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  actionIconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionText: { fontSize: 12, fontWeight: '600', color: '#475569', textAlign: 'center' },

  ledgerCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  ledgerItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  ledgerDot: { width: 10, height: 10, borderRadius: 5 },
  ledgerAction: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
  ledgerPatient: { fontSize: 12, color: '#64748B' },
  ledgerTime: { fontSize: 11, color: '#94A3B8', marginBottom: 4 },
  ledgerStatus: { fontSize: 10, fontWeight: '700' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1E293B' },

  patientCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  patientHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  patientAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center' },
  patientName: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
  patientId: { fontSize: 12, color: '#64748B' },
  patientBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  patientBadgeTxt: { fontSize: 11, fontWeight: '600' },
  patientMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  patientMetaTxt: { fontSize: 12, color: '#64748B', fontWeight: '500' },
});
