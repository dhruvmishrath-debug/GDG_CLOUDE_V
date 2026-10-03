import { useState } from 'react';
import {
  Activity, User, ClipboardList, Pill, Calendar, FileText,
  Bell, Bot, Clock, AlertTriangle, Upload, FilePlus2,
  Search, ChevronDown, 
  Headset, Receipt, LogOut, MoreVertical, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Dashboard from '../components/patient/Dashboard';
import Profile from '../components/patient/Profile';
import History from '../components/patient/History';
import Medicines from '../components/patient/Medicines';
import Appointments from '../components/patient/Appointments';
import Prescriptions from '../components/patient/Prescriptions';
import Reports from '../components/patient/Reports';
import Reminders from '../components/patient/Reminders';
import Settings from '../components/patient/Settings';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  { id: 'history', label: 'Health History', icon: <ClipboardList size={20} /> },
  { id: 'medicines', label: 'Medicines', icon: <Pill size={20} /> },
  { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} /> },
  { id: 'prescriptions', label: 'Prescriptions', icon: <FileText size={20} /> },
  { id: 'reports', label: 'Reports & Receipts', icon: <Receipt size={20} /> },
  { id: 'reminders', label: 'Medicine Reminder', icon: <Clock size={20} /> },
  { id: 'ai', label: 'AI Assistant', icon: <Bot size={20} /> },
  { id: 'availability', label: 'Availability Tracking', icon: <Search size={20} /> },
  { id: 'emergency', label: 'Emergency', icon: <AlertTriangle size={20} /> }
];
const Badge = ({ children, color = 'blue' }: any) => {
  const map: any = {
    blue: ['#DBEAFE', '#1E40AF'],
    green: ['#DCFCE7', '#16A34A'],
    yellow: ['#FEF3C7', '#D97706'],
    red: ['#FEE2E2', '#DC2626'],
    gray: ['#F1F5F9', '#64748B']
  };
  const [bg, fg] = map[color] || map.blue;
  return <span style={{ backgroundColor: bg, color: fg, padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{children}</span>;
};

const Input = ({ ...props }: any) => (
  <input {...props} style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', ...props.style }} />
);

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-fade-in" style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default function PatientPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success'>('idle');
  const navigate = useNavigate();

  const [extractedData, setExtractedData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [approvedRecords, setApprovedRecords] = useState<any[]>([]);

  // Simulated AI extraction results — varied realistic data mimicking the /data prescription images
  const sampleExtractions = [
    {
      diagnosis: { value: "Upper Respiratory Tract Infection", confidence: 96 },
      patient: { name: "Ritika Sharma", age: 28, gender: "Female", abha: "14-2823-4521-9876" },
      medicines: [
        { name: "Amoxicillin 500mg", dosage: "1-0-1 (5 days)", frequency: "Twice daily", confidence: 98, status: "ai_extracted" },
        { name: "Paracetamol 650mg", dosage: "SOS", frequency: "As needed", confidence: 95, status: "ai_extracted" },
        { name: "Cetirizine 10mg", dosage: "0-0-1 (3 days)", frequency: "Once at night", confidence: 89, status: "needs_verification" }
      ],
      investigations: [{ name: "CBC (Complete Blood Count)", confidence: 92 }],
      followUp: { value: "", confidence: 0, status: "illegible" },
      flags: [
        { type: "illegible", field: "follow_up_date", message: "Follow-up date is illegible. Left blank to prevent assumptions. Please consult doctor." }
      ]
    },
    {
      diagnosis: { value: "Type 2 Diabetes Mellitus", confidence: 94 },
      patient: { name: "Ramesh Gupta", age: 55, gender: "Male", abha: "14-5567-8901-2345" },
      medicines: [
        { name: "Metformin 500mg", dosage: "1-0-1", frequency: "Twice daily", confidence: 97, status: "ai_extracted" },
        { name: "Glimepiride 2mg", dosage: "1-0-0", frequency: "Before breakfast", confidence: 93, status: "ai_extracted" },
        { name: "Atorvastatin 10mg", dosage: "0-0-1", frequency: "At night", confidence: 91, status: "ai_extracted" }
      ],
      investigations: [
        { name: "HbA1c", confidence: 96 },
        { name: "Fasting Blood Sugar", confidence: 94 },
        { name: "Lipid Profile", confidence: 88 }
      ],
      followUp: { value: "After 3 months", confidence: 85, status: "ai_extracted" },
      flags: [
        { type: "low_confidence", field: "lipid_profile", message: "Lipid Profile investigation name partially illegible. Extracted with 88% confidence — flagged for human verification." }
      ]
    },
    {
      diagnosis: { value: "Acute Gastroenteritis", confidence: 91 },
      patient: { name: "Neha Kapoor", age: 34, gender: "Female", abha: "14-9012-3456-7890" },
      medicines: [
        { name: "ORS Sachets", dosage: "1 sachet in 1L water", frequency: "As needed", confidence: 99, status: "ai_extracted" },
        { name: "Ondansetron 4mg", dosage: "1-1-1 (3 days)", frequency: "Thrice daily", confidence: 87, status: "needs_verification" },
        { name: "Racecadotril 100mg", dosage: "1-1-1 (5 days)", frequency: "Thrice daily", confidence: 72, status: "needs_verification" }
      ],
      investigations: [{ name: "Stool Routine Examination", confidence: 78 }],
      followUp: { value: "After 5 days", confidence: 90, status: "ai_extracted" },
      flags: [
        { type: "low_confidence", field: "racecadotril_dosage", message: "Racecadotril dosage is partially obscured. Extracted with 72% confidence — flagged for clinician review before approval." },
        { type: "illegible", field: "stool_investigation", message: "Stool examination instruction text is smudged. Refusing to assume — requires manual verification." }
      ]
    }
  ];

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadState('uploading');

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("document_type", "prescription");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/documents/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail?.detail || `Request failed (${response.status})`);
      }

      const payload = await response.json();
      setExtractedData(payload.extraction);
      setUploadState('success');
      return;
    } catch (error) {
      // Keep the demo usable when the backend/AI keys aren't configured.
      console.warn("AI backend unavailable, using local simulation:", error);
    }

    // Fallback: simulated extraction with varied realistic data
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * sampleExtractions.length);
      setExtractedData(sampleExtractions[randomIndex]);
      setUploadState('success');
    }, 2500);
  };

  const handleApproveRecord = () => {
    if (!extractedData) return;
    const record = {
      ...extractedData,
      approvedAt: new Date().toISOString(),
      approvedBy: "Dr. Neha Kapoor (MD, Cardiology)",
      recordId: `REC-${Date.now()}`,
      version: 1,
      status: "clinician_confirmed"
    };
    setApprovedRecords(prev => [...prev, record]);
    setIsUploadModalOpen(false);
    setUploadState('idle');
    setSelectedFile(null);
    setExtractedData(null);
  };

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Close dropdowns if clicked outside (simplification: we'll just let them toggle for now)

  return (
    <div className="dashboard-layout">

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? '' : 'hidden-mobile'}`}>
        <div style={{ padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#2563EB', borderRadius: '8px', padding: '0.5rem' }}>
              <Activity color="white" size={20} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B' }}>CareChain</span>
          </div>
        </div>

        <nav style={{ padding: '0.5rem 1rem', flex: 1, overflowY: 'auto' }}>
          <ul className="sidebar-nav-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.id === 'ai') {
                      setIsUploadModalOpen(true);
                      setIsMobileMenuOpen(false);
                    } else if (item.id === 'emergency') {
                       alert('Calling Emergency Services...');
                    } else {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className="sidebar-nav-btn"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '12px', border: 'none', backgroundColor: activeTab === item.id && item.id !== 'ai' ? '#2563EB' : 'transparent', color: activeTab === item.id && item.id !== 'ai' ? 'white' : '#64748B', fontWeight: 500, textAlign: 'left', transition: 'all 0.2s', fontSize: '0.95rem', cursor: 'pointer' }}
                >
                  {item.icon} {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Need Help Box */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', textAlign: 'left' }}>
            <h4 style={{ color: '#1E293B', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Need Help?</h4>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.4 }}>Our support team is here for you 24/7</p>
            <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#2563EB', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>
              <Headset size={16} /> Contact Support
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content-area" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', padding: 0 }}>

        {/* Top Header */}
        <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#1E293B' }}>
              <MoreVertical size={24} />
            </button>
            <div className="search-bar-container" style={{ position: 'relative' }}>
              <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search hospitals..." 
                style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid #E2E8F0', borderRadius: '99px', fontSize: '0.9rem', outline: 'none', background: '#F8FAFC' }} 
                onKeyDown={(e) => { if (e.key === 'Enter') alert('Searching for: ' + e.currentTarget.value) }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileDropdownOpen(false); }}>
              <Bell size={24} color="#64748B" />
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', background: '#DC2626', borderRadius: '50%', border: '2px solid white' }} />
              
              {isNotificationsOpen && (
                <div className="animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '300px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 50 }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid #E2E8F0', fontWeight: 600 }}>Notifications</div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9', fontSize: '0.85rem' }}><strong>Medicine Reminder:</strong> Time to take Paracetamol 500mg.</div>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9', fontSize: '0.85rem' }}><strong>Lab Report:</strong> Your CBC results are ready to view.</div>
                  </div>
                  <div style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.8rem', color: '#2563EB', cursor: 'pointer', fontWeight: 500 }}>Mark all as read</div>
                </div>
              )}
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => { setIsProfileDropdownOpen(!isProfileDropdownOpen); setIsNotificationsOpen(false); }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="#2563EB" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1E293B' }}>Arjun Sharma</span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Patient</span>
              </div>
              <ChevronDown size={16} color="#64748B" />
              
              {isProfileDropdownOpen && (
                <div className="animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '220px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>Arjun Sharma</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>arjun.sharma@example.com</span>
                  </div>
                  <div style={{ padding: '0.5rem' }}>
                    <button onClick={() => { setActiveTab('profile'); setIsProfileDropdownOpen(false); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.75rem', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '8px' }}>My Profile</button>
                    <button onClick={() => { setActiveTab('settings'); setIsProfileDropdownOpen(false); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.75rem', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '8px' }}>Settings</button>
                  </div>
                  <div style={{ padding: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', padding: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Switch Role (Demo)</div>
                    <button onClick={() => navigate('/pharmacy')} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.75rem', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Activity size={16} color="#2563EB" /> Pharmacy Portal
                    </button>
                    <button onClick={() => navigate('/hospital')} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.75rem', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Activity size={16} color="#10B981" /> Hospital Portal
                    </button>
                  </div>
                  <div style={{ padding: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                    <button onClick={() => navigate('/')} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.75rem', fontSize: '0.9rem', cursor: 'pointer', color: '#EF4444', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Main Content */}
        <main className="main-content-area" style={{ overflowY: 'auto', background: '#F8FAFC', padding: '1.5rem' }}>
          {activeTab === 'dashboard' && <Dashboard setIsUploadModalOpen={setIsUploadModalOpen} />}
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'history' && <History />}
          {activeTab === 'medicines' && <Medicines />}
          {activeTab === 'appointments' && <Appointments />}
          {activeTab === 'prescriptions' && <Prescriptions />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'reminders' && <Reminders />}
          {activeTab === 'settings' && <Settings />}

          <footer style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.8rem', maxWidth: '1280px', margin: '0 auto 2rem' }}>
            <div>CareChain | Better Care. A Healthier You.</div>
            <div>Your health. Our priority.</div>
          </footer>
        </main>
      </div>

      <Modal isOpen={isUploadModalOpen} onClose={() => { setIsUploadModalOpen(false); setUploadState('idle'); }} title="AI Document Scanner">
        {uploadState === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', padding: '2rem 0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F0F5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={32} color="#2563EB" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Upload Medical Document</h4>
              <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem', maxWidth: '300px' }}>Upload handwritten prescriptions, OPD cards, or discharge summaries for AI structuring.</p>
            </div>
            <Input type="file" accept="image/*,.pdf" style={{ maxWidth: '300px' }} onChange={(e: any) => setSelectedFile(e.target.files?.[0])} />
            <button onClick={handleUpload} disabled={!selectedFile} style={{ width: '100%', maxWidth: '300px', padding: '0.75rem', background: selectedFile ? '#2563EB' : '#94A3B8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: selectedFile ? 'pointer' : 'not-allowed' }}>
              Upload & Analyze
            </button>
          </div>
        )}

        {uploadState === 'uploading' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', padding: '3rem 0' }}>
            <div className="animate-spin" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #E2E8F0', borderTopColor: '#2563EB', animation: 'spin 1s linear infinite' }} />
            <h4 style={{ margin: 0 }}>AI Processing...</h4>
            <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center' }}>Extracting clinical data with field-level confidence scores...</p>
          </div>
        )}

        {uploadState === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Activity color="white" size={20} /></div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', color: '#065F46' }}>Document Digitized Successfully</h4>
                <p style={{ margin: 0, color: '#047857', fontSize: '0.85rem' }}>AI extraction complete. Review below and approve for permanent ledger storage.</p>
              </div>
            </div>

            {/* Patient Details */}
            {extractedData?.patient && (
              <div style={{ background: '#F0F5FF', padding: '1rem', borderRadius: '8px', border: '1px solid #DBEAFE' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem', color: '#1E3A8A' }}>👤 Patient Identified</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div><span style={{ color: '#64748B' }}>Name:</span> <strong>{extractedData.patient.name}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Age:</span> <strong>{extractedData.patient.age} years</strong></div>
                  <div><span style={{ color: '#64748B' }}>Gender:</span> <strong>{extractedData.patient.gender}</strong></div>
                  <div><span style={{ color: '#64748B' }}>ABHA:</span> <strong>{extractedData.patient.abha}</strong></div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Diagnosis */}
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>🩺 Diagnosis:</span>
                  <Badge color={extractedData?.diagnosis?.confidence > 90 ? "green" : "yellow"}>
                    {extractedData?.diagnosis?.confidence}% confidence
                  </Badge>
                </div>
                <div style={{ color: '#1E293B', fontWeight: 500 }}>{extractedData?.diagnosis?.value}</div>
              </div>

              {/* Medicines Table */}
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>💊 Medicines Extracted</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead><tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                      <th style={{ padding: '0.5rem 0.5rem 0.5rem 0' }}>Medicine</th>
                      <th style={{ padding: '0.5rem' }}>Dosage</th>
                      <th style={{ padding: '0.5rem' }}>Frequency</th>
                      <th style={{ padding: '0.5rem' }}>Status</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right' }}>Conf.</th>
                    </tr></thead>
                    <tbody>
                      {extractedData?.medicines?.map((med: any, i: number) => (
                        <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '0.6rem 0.5rem 0.6rem 0', fontWeight: 500 }}>{med.name}</td>
                          <td style={{ padding: '0.6rem 0.5rem' }}>{med.dosage}</td>
                          <td style={{ padding: '0.6rem 0.5rem', color: '#64748B' }}>{med.frequency}</td>
                          <td style={{ padding: '0.6rem 0.5rem' }}>
                            <Badge color={med.status === 'ai_extracted' ? 'green' : 'yellow'}>
                              {med.status === 'ai_extracted' ? '✓ AI Extracted' : '⚠ Verify'}
                            </Badge>
                          </td>
                          <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontWeight: 600, color: med.confidence > 90 ? '#10B981' : med.confidence > 80 ? '#F59E0B' : '#EF4444' }}>
                            {med.confidence}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Investigations */}
              {extractedData?.investigations?.length > 0 && (
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>🔬 Investigations Advised</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {extractedData.investigations.map((inv: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <span>{inv.name}</span>
                        <Badge color={inv.confidence > 90 ? "green" : "yellow"}>{inv.confidence}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up */}
              {extractedData?.followUp && (
                <div style={{ background: extractedData.followUp.status === 'illegible' ? '#FEF2F2' : '#F8FAFC', padding: '1rem', borderRadius: '8px', border: `1px solid ${extractedData.followUp.status === 'illegible' ? '#FECACA' : '#E2E8F0'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>📅 Follow-up:</span>
                    {extractedData.followUp.status === 'illegible' ? (
                      <Badge color="red">Illegible</Badge>
                    ) : (
                      <Badge color={extractedData.followUp.confidence > 85 ? "green" : "yellow"}>
                        {extractedData.followUp.confidence}%
                      </Badge>
                    )}
                  </div>
                  <div style={{ color: extractedData.followUp.status === 'illegible' ? '#DC2626' : '#1E293B', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                    {extractedData.followUp.status === 'illegible' ? 'Could not be read — flagged for manual entry' : extractedData.followUp.value}
                  </div>
                </div>
              )}

              {/* AI Flags / Refusals */}
              {extractedData?.flags?.map((flag: any, i: number) => (
                <div key={i} style={{ background: '#FFFBEB', padding: '1rem', borderRadius: '8px', border: '1px solid #FDE68A', display: 'flex', gap: '0.75rem' }}>
                  <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#92400E', marginBottom: '0.25rem' }}>AI Refusal to Assume</div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400E', lineHeight: 1.5 }}>{flag.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Audit Note */}
            <div style={{ background: '#F1F5F9', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.75rem', color: '#475569', lineHeight: 1.5 }}>
              ⚖️ <strong>Audit Trail Notice:</strong> Approving this record will create an immutable, timestamped entry in the clinical ledger.
              Corrections will be recorded as new versioned entries — the original record will never be overwritten.
            </div>

            <button onClick={handleApproveRecord} style={{ width: '100%', padding: '0.85rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center', fontSize: '0.95rem' }}>
              <FilePlus2 size={18} /> Approve & Store Permanently
            </button>
          </div>
        )}
      </Modal>

      {/* Approved Records Audit Log (shown as toast-like cards at bottom) */}
      {approvedRecords.length > 0 && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 900, display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '360px' }}>
          {approvedRecords.slice(-2).map((rec, i) => (
            <div key={i} className="animate-fade-in" style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', border: '1px solid #A7F3D0' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity color="white" size={14} /></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#065F46' }}>Record Approved ✓</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{rec.recordId} • v{rec.version}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>
                <div><strong>Diagnosis:</strong> {rec.diagnosis.value}</div>
                <div><strong>Approved by:</strong> {rec.approvedBy}</div>
                <div><strong>Timestamp:</strong> {new Date(rec.approvedAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

