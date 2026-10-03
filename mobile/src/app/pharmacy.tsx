import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pill, Activity, ScanLine, Settings, Bell, LogOut, Package, History, Search, FileText } from 'lucide-react-native';

import AppHeader from '@/components/app-header';
import TabBar from '@/components/ui/tab-bar';
import PharmacyDashboard from '@/components/pharmacy/dashboard';
import PharmacyHistory from '@/components/pharmacy/history';
import PharmacySettings from '@/components/pharmacy/settings';
import { useTabBackHandler } from '@/hooks/use-tab-back';

export default function PharmacyPortal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  useTabBackHandler(activeTab, 'dashboard', setActiveTab);

  const renderInventory = () => (
    <>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Items</Text>
          <Text style={styles.statValue}>1,452</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Low Stock</Text>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>24</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Expiring</Text>
          <Text style={[styles.statValue, { color: '#F59E0B' }]}>8</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search inventory..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.sectionTitle}>Inventory List</Text>
      {[
        { name: 'Amoxicillin 500mg', batch: 'BT-8892', stock: 450, status: 'In Stock', expiry: 'Oct 2026' },
        { name: 'Paracetamol 650mg', batch: 'BT-1029', stock: 24, status: 'Low Stock', expiry: 'Jan 2027' },
        { name: 'Metformin 500mg', batch: 'BT-3321', stock: 8, status: 'Critical', expiry: 'Nov 2026' },
        { name: 'Azithromycin 250mg', batch: 'BT-4411', stock: 120, status: 'In Stock', expiry: 'May 2027' },
      ].map((item, idx) => (
        <View key={idx} style={styles.inventoryCard}>
          <View style={styles.invHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.invName}>{item.name}</Text>
              <Text style={styles.invBatch}>Batch: {item.batch}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: item.status === 'In Stock' ? '#ECFDF5' : item.status === 'Low Stock' ? '#FEF3C7' : '#FEE2E2' }]}>
              <Text style={[styles.badgeTxt, { color: item.status === 'In Stock' ? '#10B981' : item.status === 'Low Stock' ? '#D97706' : '#EF4444' }]}>{item.status}</Text>
            </View>
          </View>
          <View style={styles.invFooter}>
            <Text style={styles.invStock}>Stock: <Text style={{ fontWeight: '700', color: '#1E293B' }}>{item.stock}</Text> units</Text>
            <Text style={styles.invExpiry}>Exp: {item.expiry}</Text>
          </View>
        </View>
      ))}
    </>
  );

  const renderDispense = () => (
    <>
      <View style={styles.scanActionBox}>
        <View style={styles.scanCircle}>
          <ScanLine size={40} color="#8B5CF6" />
        </View>
        <Text style={styles.scanTitle}>Scan Prescription</Text>
        <Text style={styles.scanDesc}>Scan the patient&apos;s digital or physical prescription to automatically prepare medicines.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert('Camera Opened', 'Ready to scan QR or barcode.')}>
          <Text style={styles.primaryBtnTxt}>Open Camera Scanner</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Prescriptions</Text>
      {[
        { patient: 'Arjun Sharma', id: 'RX-8821', time: '10 mins ago', status: 'Ready' },
        { patient: 'Neha Kapoor', id: 'RX-9923', time: '1 hour ago', status: 'Dispensed' },
      ].map((rx, idx) => (
        <TouchableOpacity key={idx} style={styles.rxCard} onPress={() => Alert.alert(rx.id, `Patient: ${rx.patient}\nStatus: ${rx.status}`)}>
          <View style={[styles.rxIconBox, { backgroundColor: rx.status === 'Ready' ? '#F5F3FF' : '#F1F5F9' }]}>
            <FileText size={20} color={rx.status === 'Ready' ? '#8B5CF6' : '#64748B'} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rxPatient}>{rx.patient}</Text>
            <Text style={styles.rxId}>{rx.id} • {rx.time}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: rx.status === 'Ready' ? '#F5F3FF' : '#F8FAFC', borderColor: rx.status === 'Ready' ? '#DDD6FE' : '#E2E8F0', borderWidth: 1 }]}>
            <Text style={[styles.badgeTxt, { color: rx.status === 'Ready' ? '#8B5CF6' : '#64748B' }]}>{rx.status}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <AppHeader
        title="CityCare Pharmacy"
        subtitle="Inventory & Dispensing"
        icon={<Pill size={20} color="#8B5CF6" />}
        iconBackgroundColor="#F5F3FF"
        actions={[
          {
            accessibilityLabel: 'Alerts',
            icon: <Bell size={20} color="#64748B" />,
            onPress: () => Alert.alert('Alerts', 'Low stock alerts available'),
          },
          {
            accessibilityLabel: 'Log out',
            icon: <LogOut size={20} color="#EF4444" />,
            onPress: () => router.replace('/'),
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {activeTab === 'dashboard' && (
          <PharmacyDashboard onScan={() => setActiveTab('dispense')} onViewInventory={() => setActiveTab('inventory')} />
        )}
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'dispense' && renderDispense()}
        {activeTab === 'history' && <PharmacyHistory />}
        {activeTab === 'settings' && <PharmacySettings onLogout={() => router.replace('/')} />}
        <View style={{ height: 24 }} />
      </ScrollView>

      <TabBar
        activeId={activeTab}
        onSelect={setActiveTab}
        activeColor="#8B5CF6"
        tabs={[
          { id: 'dashboard', label: 'Dashboard', renderIcon: (a) => <Activity size={24} color={a ? '#8B5CF6' : '#94A3B8'} /> },
          { id: 'inventory', label: 'Inventory', renderIcon: (a) => <Package size={24} color={a ? '#8B5CF6' : '#94A3B8'} /> },
          { id: 'history', label: 'History', renderIcon: (a) => <History size={24} color={a ? '#8B5CF6' : '#94A3B8'} /> },
          { id: 'settings', label: 'Settings', renderIcon: (a) => <Settings size={24} color={a ? '#8B5CF6' : '#94A3B8'} /> },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 16, marginTop: 8 },

  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '700', color: '#1E293B' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1E293B' },

  inventoryCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  invHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  invName: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
  invBatch: { fontSize: 12, color: '#64748B' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeTxt: { fontSize: 11, fontWeight: '600' },
  invFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  invStock: { fontSize: 13, color: '#475569' },
  invExpiry: { fontSize: 12, color: '#94A3B8' },

  scanActionBox: { backgroundColor: '#F5F3FF', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#DDD6FE' },
  scanCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 },
  scanTitle: { fontSize: 20, fontWeight: '700', color: '#4C1D95', marginBottom: 8 },
  scanDesc: { fontSize: 14, color: '#6D28D9', textAlign: 'center', marginBottom: 20, paddingHorizontal: 16 },
  primaryBtn: { backgroundColor: '#8B5CF6', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, width: '100%', alignItems: 'center' },
  primaryBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },

  rxCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  rxIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rxPatient: { fontSize: 15, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
  rxId: { fontSize: 12, color: '#64748B' },
});
