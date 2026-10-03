import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Modal, ActivityIndicator, TextInput, Alert, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, User, HeartPulse, Upload, FileText, Calendar, Clock, Activity, FilePlus2, FlaskConical, Pill, AlertTriangle, ChevronRight, Phone, Mail, MapPin, Search, LogOut, Heart, Shield, Bot, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PatientPortal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [approvedRecords, setApprovedRecords] = useState<any[]>([]);
  const [reminderModal, setReminderModal] = useState(false);
  const [reminders, setReminders] = useState([
    { id: 1, name: 'Metformin 500mg', time: '08:00 AM', status: 'pending' },
    { id: 2, name: 'Atorvastatin 10mg', time: '09:00 PM', status: 'taken' },
    { id: 3, name: 'Vitamin D3', time: '01:00 PM', status: 'pending' },
  ]);

  const sampleExtractions = [
    {
      diagnosis: { value: "Upper Respiratory Tract Infection", confidence: 96 },
      patient: { name: "Ritika Sharma", age: 28, gender: "Female", abha: "14-2823-4521-9876" },
      medicines: [
        { name: "Amoxicillin 500mg", dosage: "1-0-1", frequency: "Twice daily", confidence: 98, status: "ai_extracted" },
        { name: "Paracetamol 650mg", dosage: "SOS", frequency: "As needed", confidence: 95, status: "ai_extracted" },
        { name: "Cetirizine 10mg", dosage: "0-0-1", frequency: "Once at night", confidence: 89, status: "needs_verification" },
      ],
      investigations: [{ name: "CBC (Complete Blood Count)", confidence: 92 }],
      followUp: { value: "", confidence: 0, status: "illegible" },
      flags: [{ type: "illegible", field: "follow_up_date", message: "Follow-up date is illegible. Left blank to prevent assumptions." }]
    },
    {
      diagnosis: { value: "Type 2 Diabetes Mellitus", confidence: 94 },
      patient: { name: "Ramesh Gupta", age: 55, gender: "Male", abha: "14-5567-8901-2345" },
      medicines: [
        { name: "Metformin 500mg", dosage: "1-0-1", frequency: "Twice daily", confidence: 97, status: "ai_extracted" },
        { name: "Glimepiride 2mg", dosage: "1-0-0", frequency: "Before breakfast", confidence: 93, status: "ai_extracted" },
      ],
      investigations: [{ name: "HbA1c", confidence: 96 }, { name: "Fasting Blood Sugar", confidence: 94 }],
      followUp: { value: "After 3 months", confidence: 85, status: "ai_extracted" },
      flags: [{ type: "low_confidence", field: "lipid_profile", message: "Lipid Profile partially illegible — flagged for verification." }]
    },
  ];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 1 });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permission required', 'Camera access is needed to scan documents.'); return; }
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const handleUpload = () => {
    if (!selectedImage) return;
    setUploadState('uploading');
    setTimeout(() => {
      const idx = Math.floor(Math.random() * sampleExtractions.length);
      setExtractedData(sampleExtractions[idx]);
      setUploadState('success');
    }, 2500);
  };

  const handleApprove = () => {
    if (!extractedData) return;
    setApprovedRecords(prev => [...prev, { ...extractedData, approvedAt: new Date().toISOString(), recordId: `REC-${Date.now()}` }]);
    setIsScannerOpen(false);
    setUploadState('idle');
    setSelectedImage(null);
    setExtractedData(null);
    Alert.alert('✅ Record Approved', 'Immutable record stored permanently. Corrections will be new timestamped entries.');
  };

  const toggleReminder = (id: number) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'taken' ? 'pending' : 'taken' } : r));
  };

  // ---- Tab Content Renderers ---- //

  const renderHome = () => (
    <>
      {/* Hero */}
      <View style={s.heroCard}>
        <View style={s.heroRow}>
          <View style={s.heroAvatar}><User size={28} color="#2563EB" /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.heroGreet}>Good morning,</Text>
            <Text style={s.heroName}>Arjun Sharma 👋</Text>
          </View>
        </View>
        <Text style={s.heroSub}>Take care of your health — it's your greatest wealth.</Text>
        <View style={s.heroTags}>
          <View style={s.tag}><Calendar size={12} color="#2563EB" /><Text style={s.tagTxt}>Age: 34</Text></View>
          <View style={s.tag}><Heart size={12} color="#EF4444" /><Text style={s.tagTxt}>O+ Blood</Text></View>
          <View style={s.tag}><Shield size={12} color="#10B981" /><Text style={s.tagTxt}>ABHA Linked</Text></View>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={s.secTitle}>Quick Actions</Text>
      <View style={s.qGrid}>
        {[
          { icon: <Upload size={22} color="#2563EB" />, bg: '#DBEAFE', label: 'Scan Doc', onPress: () => setIsScannerOpen(true) },
          { icon: <FileText size={22} color="#D946EF" />, bg: '#FDF4FF', label: 'Reports', onPress: () => setActiveTab('records') },
          { icon: <Clock size={22} color="#D97706" />, bg: '#FEF3C7', label: 'Reminders', onPress: () => setReminderModal(true) },
          { icon: <Calendar size={22} color="#10B981" />, bg: '#ECFDF5', label: 'Book Appt', onPress: () => Alert.alert('Appointments', 'Book appointment feature coming soon!') },
          { icon: <Bot size={22} color="#3B82F6" />, bg: '#F0F5FF', label: 'AI Helper', onPress: () => setIsScannerOpen(true) },
          { icon: <Phone size={22} color="#EF4444" />, bg: '#FEE2E2', label: 'Emergency', onPress: () => Alert.alert('Emergency', 'Calling emergency services (108)...') },
        ].map((a, i) => (
          <TouchableOpacity key={i} style={s.qCard} onPress={a.onPress} activeOpacity={0.7}>
            <View style={[s.qIcon, { backgroundColor: a.bg }]}>{a.icon}</View>
            <Text style={s.qLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Banner */}
      <TouchableOpacity style={s.aiBanner} onPress={() => setIsScannerOpen(true)} activeOpacity={0.85}>
        <View style={s.aiBannerLeft}>
          <View style={s.aiBannerIconBox}><Activity size={20} color="#fff" /></View>
          <View>
            <Text style={s.aiBannerTitle}>AI Clinical Scanner</Text>
            <Text style={s.aiBannerSub}>Digitize handwritten records instantly</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#fff" />
      </TouchableOpacity>

      {/* Vitals */}
      <Text style={s.secTitle}>Health Vitals</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {[
          { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', color: '#EF4444', bg: '#FEE2E2' },
          { label: 'Heart Rate', value: '72', unit: 'bpm', color: '#2563EB', bg: '#DBEAFE' },
          { label: 'SpO2', value: '98', unit: '%', color: '#10B981', bg: '#ECFDF5' },
          { label: 'Temperature', value: '98.6', unit: '°F', color: '#D97706', bg: '#FEF3C7' },
        ].map((v, i) => (
          <View key={i} style={[s.vitalCard, { borderColor: v.bg }]}>
            <Text style={[s.vitalVal, { color: v.color }]}>{v.value}</Text>
            <Text style={s.vitalUnit}>{v.unit}</Text>
            <Text style={s.vitalLabel}>{v.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Timeline */}
      <Text style={s.secTitle}>Recent Activities</Text>
      <View style={s.timelineCard}>
        {[
          { icon: <Activity size={16} color="#10B981" />, bg: '#ECFDF5', title: 'Visit — CityCare Hospital', date: 'May 12, 2026' },
          { icon: <FilePlus2 size={16} color="#8B5CF6" />, bg: '#F5F3FF', title: 'Prescription Digitized', date: 'May 10, 2026' },
          { icon: <FlaskConical size={16} color="#2563EB" />, bg: '#F0F5FF', title: 'Lab Report (CBC)', date: 'May 08, 2026' },
          { icon: <Pill size={16} color="#D97706" />, bg: '#FEF3C7', title: 'Medicine Purchased', date: 'May 05, 2026' },
        ].map((t, i) => (
          <View key={i} style={s.tItem}>
            <View style={[s.tIcon, { backgroundColor: t.bg }]}>{t.icon}</View>
            <View style={{ flex: 1 }}>
              <Text style={s.tTitle}>{t.title}</Text>
              <Text style={s.tDate}>{t.date}</Text>
            </View>
            <ChevronRight size={16} color="#CBD5E1" />
          </View>
        ))}
      </View>

      {/* Approved records */}
      {approvedRecords.length > 0 && (
        <View style={s.approvedSection}>
          <Text style={s.secTitle}>Approved Records</Text>
          {approvedRecords.map((rec, i) => (
            <View key={i} style={s.approvedCard}>
              <Activity size={16} color="#10B981" />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#065F46' }}>{rec.recordId} ✓</Text>
                <Text style={{ fontSize: 12, color: '#047857' }}>{rec.diagnosis.value}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );

  const renderRecords = () => (
    <>
      <Text style={s.secTitle}>Medical Records</Text>
      {[
        { type: 'Prescription', date: 'May 10, 2026', doctor: 'Dr. Neha Kapoor', hospital: 'CityCare Hospital', status: 'Digitized' },
        { type: 'Lab Report — CBC', date: 'May 08, 2026', doctor: 'Dr. Vikram Singh', hospital: 'MedPlus Lab', status: 'Verified' },
        { type: 'Discharge Summary', date: 'Apr 22, 2026', doctor: 'Dr. Priya Sharma', hospital: 'AIIMS Bhopal', status: 'Pending Review' },
        { type: 'OPD Card', date: 'Apr 15, 2026', doctor: 'Dr. Rajesh Patel', hospital: 'Gandhi Hospital', status: 'Digitized' },
        { type: 'X-Ray Report', date: 'Mar 30, 2026', doctor: 'Dr. Aisha Khan', hospital: 'MedPlus Lab', status: 'Verified' },
      ].map((r, i) => (
        <TouchableOpacity key={i} style={s.recordCard} activeOpacity={0.7} onPress={() => Alert.alert(r.type, `Doctor: ${r.doctor}\nHospital: ${r.hospital}\nDate: ${r.date}\nStatus: ${r.status}`)}>
          <View style={{ flex: 1 }}>
            <Text style={s.recordType}>{r.type}</Text>
            <Text style={s.recordMeta}>{r.doctor} • {r.hospital}</Text>
            <Text style={s.recordDate}>{r.date}</Text>
          </View>
          <View style={[s.statusBadge, { backgroundColor: r.status === 'Verified' ? '#ECFDF5' : r.status === 'Digitized' ? '#DBEAFE' : '#FEF3C7' }]}>
            <Text style={[s.statusText, { color: r.status === 'Verified' ? '#10B981' : r.status === 'Digitized' ? '#2563EB' : '#D97706' }]}>{r.status}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={s.uploadBtnSecondary} onPress={() => setIsScannerOpen(true)}>
        <Upload size={18} color="#2563EB" />
        <Text style={{ color: '#2563EB', fontWeight: '600', fontSize: 15 }}>Upload New Document</Text>
      </TouchableOpacity>
    </>
  );

  const renderProfile = () => (
    <>
      <View style={s.profileHeader}>
        <View style={s.profileAvatar}><User size={40} color="#2563EB" /></View>
        <Text style={s.profileName}>Arjun Sharma</Text>
        <Text style={s.profileEmail}>patient@health.ai</Text>
      </View>
      {[
        { label: 'Full Name', value: 'Arjun Sharma' },
        { label: 'Age', value: '34 years' },
        { label: 'Gender', value: 'Male' },
        { label: 'Blood Group', value: 'O+' },
        { label: 'Phone', value: '+91 98765 43210' },
        { label: 'ABHA ID', value: '14-1234-5678-9012' },
        { label: 'Address', value: 'Ratibad, Bhopal, MP' },
        { label: 'Emergency Contact', value: '+91 87654 32109' },
      ].map((f, i) => (
        <View key={i} style={s.profileRow}>
          <Text style={s.profileLabel}>{f.label}</Text>
          <Text style={s.profileValue}>{f.value}</Text>
        </View>
      ))}
      <TouchableOpacity style={[s.logoutBtn]} onPress={() => router.replace('/')}>
        <LogOut size={18} color="#EF4444" />
        <Text style={s.logoutText}>Logout</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.logoBox}><HeartPulse size={18} color="#2563EB" /></View>
          <Text style={s.headerTitle}>CareChain</Text>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.iconBtn} onPress={() => setReminderModal(true)}>
            <Bell size={22} color="#64748B" />
            <View style={s.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={s.contentPad} showsVerticalScrollIndicator={false}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'records' && renderRecords()}
        {activeTab === 'profile' && renderProfile()}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={s.tabBar}>
        {[
          { id: 'home', icon: <HeartPulse size={22} color={activeTab === 'home' ? '#2563EB' : '#94A3B8'} />, label: 'Home' },
          { id: 'scan', icon: <Upload size={22} color="#fff" />, label: 'Scan' },
          { id: 'records', icon: <FileText size={22} color={activeTab === 'records' ? '#2563EB' : '#94A3B8'} />, label: 'Records' },
          { id: 'profile', icon: <User size={22} color={activeTab === 'profile' ? '#2563EB' : '#94A3B8'} />, label: 'Profile' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={tab.id === 'scan' ? s.scanTabBtn : s.tabItem}
            onPress={() => { if (tab.id === 'scan') setIsScannerOpen(true); else setActiveTab(tab.id); }}
            activeOpacity={0.7}
          >
            {tab.id === 'scan' ? (
              <View style={s.scanBtnCircle}>{tab.icon}</View>
            ) : (
              <>
                {tab.icon}
                <Text style={[s.tabLabel, activeTab === tab.id && { color: '#2563EB' }]}>{tab.label}</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Scanner Modal */}
      <Modal visible={isScannerOpen} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={s.modalSafe}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>AI Document Scanner</Text>
            <TouchableOpacity onPress={() => { setIsScannerOpen(false); setUploadState('idle'); setSelectedImage(null); setExtractedData(null); }}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
            {uploadState === 'idle' && (
              <View style={s.scanIdle}>
                <View style={s.scanCircle}><Upload size={36} color="#2563EB" /></View>
                <Text style={s.scanTitle}>Upload Medical Document</Text>
                <Text style={s.scanSub}>Upload handwritten prescriptions, OPD cards, or discharge summaries for AI-powered structuring.</Text>
                {selectedImage && <Image source={{ uri: selectedImage }} style={s.preview} />}
                <View style={s.scanBtns}>
                  <TouchableOpacity style={s.scanBtn} onPress={pickImage}><Text style={s.scanBtnTxt}>📁 Gallery</Text></TouchableOpacity>
                  <TouchableOpacity style={s.scanBtn} onPress={takePhoto}><Text style={s.scanBtnTxt}>📷 Camera</Text></TouchableOpacity>
                </View>
                {selectedImage && (
                  <TouchableOpacity style={s.analyzeBtn} onPress={handleUpload}><Text style={s.analyzeBtnTxt}>✨ Extract Data with AI</Text></TouchableOpacity>
                )}
              </View>
            )}
            {uploadState === 'uploading' && (
              <View style={s.loadingView}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={s.loadTitle}>AI Processing...</Text>
                <Text style={s.loadSub}>Extracting clinical data with field-level confidence scores</Text>
              </View>
            )}
            {uploadState === 'success' && extractedData && (
              <View>
                <View style={s.successBanner}><Activity size={20} color="#10B981" /><View style={{ flex: 1 }}><Text style={s.successTitle}>Digitized Successfully</Text><Text style={s.successSub}>Review and approve for permanent ledger storage.</Text></View></View>
                {extractedData.patient && (
                  <View style={[s.dCard, { backgroundColor: '#F0F5FF', borderColor: '#DBEAFE' }]}>
                    <Text style={s.dCardTitle}>👤 Patient Identified</Text>
                    <Text style={s.dText}>Name: <Text style={{ fontWeight: '600' }}>{extractedData.patient.name}</Text></Text>
                    <Text style={s.dText}>Age: {extractedData.patient.age} | {extractedData.patient.gender} | ABHA: {extractedData.patient.abha}</Text>
                  </View>
                )}
                <View style={s.dCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={s.dCardTitle}>🩺 Diagnosis</Text>
                    <View style={s.confBadge}><Text style={s.confText}>{extractedData.diagnosis.confidence}%</Text></View>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: '#1E293B', marginTop: 4 }}>{extractedData.diagnosis.value}</Text>
                </View>
                <View style={s.dCard}>
                  <Text style={s.dCardTitle}>💊 Medicines</Text>
                  {extractedData.medicines.map((m: any, i: number) => (
                    <View key={i} style={s.medRow}>
                      <View style={{ flex: 1 }}><Text style={s.medName}>{m.name}</Text><Text style={s.medDose}>{m.dosage} • {m.frequency}</Text></View>
                      <View style={[s.confBadge, m.confidence < 90 && { backgroundColor: '#FEF3C7' }]}>
                        <Text style={[s.confText, m.confidence < 90 && { color: '#D97706' }]}>{m.confidence}%</Text>
                      </View>
                    </View>
                  ))}
                </View>
                {extractedData.investigations?.length > 0 && (
                  <View style={s.dCard}>
                    <Text style={s.dCardTitle}>🔬 Investigations</Text>
                    {extractedData.investigations.map((inv: any, i: number) => (
                      <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
                        <Text style={s.dText}>{inv.name}</Text>
                        <View style={s.confBadge}><Text style={s.confText}>{inv.confidence}%</Text></View>
                      </View>
                    ))}
                  </View>
                )}
                {extractedData.flags?.map((f: any, i: number) => (
                  <View key={i} style={s.flagCard}>
                    <AlertTriangle size={18} color="#D97706" />
                    <View style={{ flex: 1 }}><Text style={s.flagTitle}>AI Refusal to Assume</Text><Text style={s.flagDesc}>{f.message}</Text></View>
                  </View>
                ))}
                <View style={s.auditNotice}><Text style={s.auditText}>⚖️ Approving creates an immutable, timestamped entry. Original records are never overwritten.</Text></View>
                <TouchableOpacity style={s.approveBtn} onPress={handleApprove}><FilePlus2 size={20} color="#fff" /><Text style={s.approveTxt}>Approve & Store Permanently</Text></TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Medicine Reminder Modal */}
      <Modal visible={reminderModal} animationType="slide" transparent>
        <View style={s.reminderOverlay}>
          <View style={s.reminderSheet}>
            <View style={s.reminderHeader}>
              <Text style={s.reminderTitle}>💊 Medicine Reminders</Text>
              <TouchableOpacity onPress={() => setReminderModal(false)}><X size={24} color="#64748B" /></TouchableOpacity>
            </View>
            {reminders.map((r) => (
              <TouchableOpacity key={r.id} style={s.reminderItem} onPress={() => toggleReminder(r.id)}>
                <View style={[s.reminderCheck, r.status === 'taken' && { backgroundColor: '#10B981', borderColor: '#10B981' }]}>
                  {r.status === 'taken' && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.reminderName, r.status === 'taken' && { textDecorationLine: 'line-through', color: '#94A3B8' }]}>{r.name}</Text>
                  <Text style={s.reminderTime}>{r.time}</Text>
                </View>
                <View style={[s.reminderBadge, { backgroundColor: r.status === 'taken' ? '#ECFDF5' : '#FEF3C7' }]}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: r.status === 'taken' ? '#10B981' : '#D97706' }}>{r.status === 'taken' ? 'Taken' : 'Pending'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  contentPad: { padding: 16, paddingTop: 8 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  headerRight: { flexDirection: 'row', gap: 12 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  notifDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },

  heroCard: { backgroundColor: '#F0F5FF', borderRadius: 20, padding: 20, marginBottom: 20 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 },
  heroAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center' },
  heroGreet: { fontSize: 15, color: '#475569' },
  heroName: { fontSize: 22, fontWeight: '700', color: '#1E293B' },
  heroSub: { fontSize: 13, color: '#475569', marginBottom: 12 },
  heroTags: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  tagTxt: { fontSize: 11, fontWeight: '500', color: '#475569' },

  secTitle: { fontSize: 17, fontWeight: '600', color: '#1E293B', marginBottom: 14 },

  qGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  qCard: { alignItems: 'center', width: '30%', gap: 6 },
  qIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  qLabel: { fontSize: 11, fontWeight: '500', color: '#475569', textAlign: 'center' },

  aiBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#2563EB', borderRadius: 16, padding: 16, marginBottom: 20 },
  aiBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiBannerIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  aiBannerTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  aiBannerSub: { fontSize: 12, color: '#BFDBFE' },

  vitalCard: { width: 110, backgroundColor: '#fff', borderRadius: 14, padding: 14, marginRight: 10, borderWidth: 1.5, alignItems: 'center' },
  vitalVal: { fontSize: 22, fontWeight: '700' },
  vitalUnit: { fontSize: 11, color: '#64748B', marginTop: 2 },
  vitalLabel: { fontSize: 11, color: '#94A3B8', marginTop: 6, textAlign: 'center' },

  timelineCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20 },
  tItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tIcon: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  tTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  tDate: { fontSize: 12, color: '#64748B', marginTop: 2 },

  approvedSection: { marginBottom: 20 },
  approvedCard: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: '#ECFDF5', padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#A7F3D0' },

  // Records
  recordCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  recordType: { fontSize: 15, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  recordMeta: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  recordDate: { fontSize: 11, color: '#94A3B8' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '600' },
  uploadBtnSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#F0F5FF', padding: 16, borderRadius: 14, marginTop: 10, borderWidth: 1.5, borderColor: '#DBEAFE' },

  // Profile
  profileHeader: { alignItems: 'center', marginBottom: 24, paddingTop: 16 },
  profileAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  profileName: { fontSize: 22, fontWeight: '700', color: '#1E293B' },
  profileEmail: { fontSize: 14, color: '#64748B', marginTop: 4 },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  profileLabel: { fontSize: 14, color: '#64748B' },
  profileValue: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, paddingVertical: 14, borderRadius: 14, backgroundColor: '#FEE2E2' },
  logoutText: { fontSize: 15, fontWeight: '600', color: '#EF4444' },

  // Tab Bar
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 20, paddingTop: 8 },
  tabItem: { alignItems: 'center', gap: 4, paddingVertical: 4 },
  tabLabel: { fontSize: 10, fontWeight: '500', color: '#94A3B8' },
  scanTabBtn: { marginTop: -28 },
  scanBtnCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },

  // Scanner Modal
  modalSafe: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },

  scanIdle: { alignItems: 'center', paddingTop: 30 },
  scanCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  scanTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
  scanSub: { fontSize: 14, color: '#64748B', textAlign: 'center', paddingHorizontal: 20, marginBottom: 24 },
  preview: { width: '100%', height: 240, borderRadius: 14, marginBottom: 20, resizeMode: 'cover' as any },
  scanBtns: { flexDirection: 'row', gap: 12, width: '100%', marginBottom: 12 },
  scanBtn: { flex: 1, backgroundColor: '#fff', padding: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1.5, borderColor: '#E2E8F0' },
  scanBtnTxt: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  analyzeBtn: { width: '100%', backgroundColor: '#2563EB', padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  analyzeBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },

  loadingView: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 16 },
  loadTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  loadSub: { fontSize: 14, color: '#64748B', textAlign: 'center' },

  successBanner: { flexDirection: 'row', backgroundColor: '#ECFDF5', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#A7F3D0', gap: 12, alignItems: 'center', marginBottom: 16 },
  successTitle: { fontSize: 15, fontWeight: '700', color: '#065F46' },
  successSub: { fontSize: 12, color: '#047857' },

  dCard: { backgroundColor: '#fff', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  dCardTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 8 },
  dText: { fontSize: 13, color: '#475569', marginBottom: 4 },

  medRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  medName: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  medDose: { fontSize: 12, color: '#64748B', marginTop: 2 },

  confBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  confText: { fontSize: 11, fontWeight: '600', color: '#16A34A' },

  flagCard: { flexDirection: 'row', backgroundColor: '#FFFBEB', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#FDE68A', gap: 10, marginBottom: 12 },
  flagTitle: { fontSize: 13, fontWeight: '600', color: '#92400E', marginBottom: 2 },
  flagDesc: { fontSize: 12, color: '#B45309', lineHeight: 18 },

  auditNotice: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10, marginBottom: 16 },
  auditText: { fontSize: 12, color: '#475569', lineHeight: 18 },

  approveBtn: { flexDirection: 'row', backgroundColor: '#10B981', padding: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 8 },
  approveTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Reminder Modal
  reminderOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  reminderSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  reminderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  reminderTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  reminderItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  reminderCheck: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  reminderName: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  reminderTime: { fontSize: 12, color: '#64748B', marginTop: 2 },
  reminderBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
});
