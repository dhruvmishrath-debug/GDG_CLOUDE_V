import { useState } from 'react';
import { User, Bell, Shield, Lock, Save, Globe, Moon, Palette, Smartphone, HelpCircle, Check, Languages } from 'lucide-react';
import { Card, CardH, CardB, Input } from '../pharmacy/Shared';

export default function PatientSettings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    notifyAppointments: true, notifyMedicines: true, notifyReports: true,
    notifyPromo: false, notifySMS: true, notifyEmail: true,
    darkMode: false, language: 'English', fontSize: 'Medium',
    twoFA: true, biometric: false, sessionTimeout: '30 min',
    dataSharing: true, showPhone: false
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const [saveMsg, setSaveMsg] = useState('');

  const handleSave = () => {
    setSaveMsg('✅ Settings saved successfully!');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const sections = [
    { id: 'profile', label: 'Profile Settings', icon: <User size={18} />, desc: 'Update personal info' },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} />, desc: 'Alert preferences' },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} />, desc: 'Theme & language' },
    { id: 'security', label: 'Security', icon: <Lock size={18} />, desc: 'Password & 2FA' },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={18} />, desc: 'Data & visibility' },
    { id: 'about', label: 'About', icon: <HelpCircle size={18} />, desc: 'App info & support' },
  ];

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', flexShrink: 0 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: checked ? '#2563EB' : '#CBD5E1', borderRadius: '99px', transition: '0.3s' }}>
        <span style={{ position: 'absolute', height: '18px', width: '18px', left: checked ? '22px' : '3px', bottom: '3px', backgroundColor: 'white', borderRadius: '50%', transition: '0.3s' }} />
      </span>
    </label>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#1E293B', fontSize: '1.5rem' }}>Settings</h2>
        {saveMsg && <div style={{ background: '#ECFDF5', color: '#065F46', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500 }}>{saveMsg}</div>}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {/* Sidebar */}
        <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '0.25rem', flexShrink: 0 }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px',
              border: 'none', background: activeSection === s.id ? '#F0F5FF' : 'transparent',
              color: activeSection === s.id ? '#2563EB' : '#64748B', fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
            }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: activeSection === s.id ? '#DBEAFE' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '0.9rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 400 }}>{s.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {activeSection === 'profile' && (
            <Card>
              <CardH><h3 style={{ margin: 0 }}>Update Profile</h3></CardH>
              <CardB>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={36} color="#2563EB" /></div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem' }}>Arjun Sharma</h4>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>Patient ID: ARJ-829 • ABHA: 14-1234-5678-9012</p>
                    <button style={{ marginTop: '0.5rem', padding: '0.3rem 0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '0.8rem', color: '#2563EB' }}>Change Photo</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Full Name</label><Input defaultValue="Arjun Sharma" /></div>
                  <div><label style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Email Address</label><Input defaultValue="arjun.sharma@example.com" /></div>
                  <div><label style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Phone Number</label><Input defaultValue="+91 98765 43210" /></div>
                  <div><label style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Emergency Contact</label><Input defaultValue="+91 91234 56789" /></div>
                  <div><label style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Date of Birth</label><Input type="date" defaultValue="1992-03-15" /></div>
                  <div><label style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Blood Group</label>
                    <select defaultValue="O+" style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem', outline: 'none' }}>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Address</label><Input defaultValue="B-42, Ratibad Colony, Bhopal, MP 462044" /></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button onClick={handleSave} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}><Save size={16} /> Save Changes</button>
                </div>
              </CardB>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <CardH><h3 style={{ margin: 0 }}>Notification Preferences</h3></CardH>
              <CardB>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { key: 'notifyAppointments', label: 'Appointment Reminders', desc: 'Get notified before your scheduled appointments' },
                    { key: 'notifyMedicines', label: 'Medicine Reminders', desc: 'Daily alerts to take your prescribed medicines on time' },
                    { key: 'notifyReports', label: 'Lab Report Updates', desc: 'Notifications when new test results are available' },
                    { key: 'notifyPromo', label: 'Health Tips & Updates', desc: 'Receive wellness tips and health camp notifications' },
                    { key: 'notifySMS', label: 'SMS Notifications', desc: 'Receive alerts via text message to your registered phone' },
                    { key: 'notifyEmail', label: 'Email Notifications', desc: 'Receive weekly health summary via email' },
                  ].map(item => (
                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '10px' }}>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: '0.25rem', fontSize: '0.9rem' }}>{item.label}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{item.desc}</div>
                      </div>
                      <Toggle checked={(settings as any)[item.key]} onChange={() => setSettings({ ...settings, [item.key]: !(settings as any)[item.key] })} />
                    </div>
                  ))}
                </div>
              </CardB>
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card>
              <CardH><h3 style={{ margin: 0 }}>Appearance & Language</h3></CardH>
              <CardB>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Moon size={20} color="#64748B" />
                      <div><div style={{ fontWeight: 500, fontSize: '0.9rem' }}>Dark Mode</div><div style={{ fontSize: '0.8rem', color: '#64748B' }}>Switch to dark theme</div></div>
                    </div>
                    <Toggle checked={settings.darkMode} onChange={() => setSettings({ ...settings, darkMode: !settings.darkMode })} />
                  </div>

                  <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <Languages size={20} color="#64748B" />
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>Language</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {['English', 'Hindi', 'Marathi', 'Tamil'].map(lang => (
                        <button key={lang} onClick={() => setSettings({ ...settings, language: lang })} style={{
                          padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid',
                          borderColor: settings.language === lang ? '#2563EB' : '#E2E8F0',
                          background: settings.language === lang ? '#EFF6FF' : 'white',
                          color: settings.language === lang ? '#2563EB' : '#475569',
                          cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem'
                        }}>{settings.language === lang && <Check size={14} />}{lang}</button>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '10px' }}>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.75rem' }}>Font Size</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['Small', 'Medium', 'Large'].map(size => (
                        <button key={size} onClick={() => setSettings({ ...settings, fontSize: size })} style={{
                          padding: '0.5rem 1.25rem', borderRadius: '8px', border: '1px solid',
                          borderColor: settings.fontSize === size ? '#2563EB' : '#E2E8F0',
                          background: settings.fontSize === size ? '#EFF6FF' : 'white',
                          color: settings.fontSize === size ? '#2563EB' : '#475569',
                          cursor: 'pointer', fontSize: size === 'Small' ? '0.75rem' : size === 'Large' ? '1rem' : '0.85rem', fontWeight: 500
                        }}>{size}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardB>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card>
              <CardH><h3 style={{ margin: 0 }}>Security & Password</h3></CardH>
              <CardB>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Smartphone size={20} color="#64748B" />
                      <div><div style={{ fontWeight: 500, fontSize: '0.9rem' }}>Two-Factor Authentication</div><div style={{ fontSize: '0.8rem', color: '#64748B' }}>Extra security via OTP on login</div></div>
                    </div>
                    <Toggle checked={settings.twoFA} onChange={() => setSettings({ ...settings, twoFA: !settings.twoFA })} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '10px' }}>
                    <div><div style={{ fontWeight: 500, fontSize: '0.9rem' }}>Biometric Login</div><div style={{ fontSize: '0.8rem', color: '#64748B' }}>Use fingerprint or Face ID</div></div>
                    <Toggle checked={settings.biometric} onChange={() => setSettings({ ...settings, biometric: !settings.biometric })} />
                  </div>

                  <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
                    <h4 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Change Password</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
                      <div style={{ position: 'relative' }}>
                        <label style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Current Password</label>
                        <Input type="password" value={passwords.current} onChange={(e: any) => setPasswords({ ...passwords, current: e.target.value })} />
                      </div>
                      <div><label style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>New Password</label><Input type="password" value={passwords.new} onChange={(e: any) => setPasswords({ ...passwords, new: e.target.value })} /></div>
                      <div><label style={{ fontSize: '0.85rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Confirm New Password</label><Input type="password" value={passwords.confirm} onChange={(e: any) => setPasswords({ ...passwords, confirm: e.target.value })} /></div>
                      <button onClick={handleSave} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, width: 'fit-content', marginTop: '0.5rem' }}>Update Password</button>
                    </div>
                  </div>
                </div>
              </CardB>
            </Card>
          )}

          {activeSection === 'privacy' && (
            <Card>
              <CardH><h3 style={{ margin: 0 }}>Privacy & Data</h3></CardH>
              <CardB>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '10px' }}>
                    <div><div style={{ fontWeight: 500, fontSize: '0.9rem' }}>Share Health Data with Doctors</div><div style={{ fontSize: '0.8rem', color: '#64748B' }}>Allow your doctors to access medical records</div></div>
                    <Toggle checked={settings.dataSharing} onChange={() => setSettings({ ...settings, dataSharing: !settings.dataSharing })} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '10px' }}>
                    <div><div style={{ fontWeight: 500, fontSize: '0.9rem' }}>Show Phone Number</div><div style={{ fontSize: '0.8rem', color: '#64748B' }}>Make your phone visible to hospital staff</div></div>
                    <Toggle checked={settings.showPhone} onChange={() => setSettings({ ...settings, showPhone: !settings.showPhone })} />
                  </div>
                  <div style={{ padding: '1rem', background: '#FEF2F2', borderRadius: '10px', border: '1px solid #FECACA' }}>
                    <div style={{ fontWeight: 600, color: '#DC2626', marginBottom: '0.5rem', fontSize: '0.9rem' }}>⚠️ Danger Zone</div>
                    <p style={{ color: '#7F1D1D', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Deleting your account will permanently remove all your health records. This action cannot be undone.</p>
                    <button onClick={() => alert('Account deletion is disabled in the demo.')} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}>Delete Account</button>
                  </div>
                </div>
              </CardB>
            </Card>
          )}

          {activeSection === 'about' && (
            <Card>
              <CardH><h3 style={{ margin: 0 }}>About CareChain</h3></CardH>
              <CardB>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#DBEAFE', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Globe size={32} color="#2563EB" />
                    </div>
                    <h3 style={{ margin: '0 0 0.25rem', color: '#1E293B' }}>CareChain v2.1.0</h3>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>AI-Powered Healthcare Platform</p>
                  </div>
                  {[
                    { label: 'Problem Statement', value: 'IS-23 (SIH 2024)' },
                    { label: 'Organization', value: 'MP Online Limited' },
                    { label: 'Tech Stack', value: 'React + FastAPI + PostgreSQL + Redis' },
                    { label: 'AI Engine', value: 'NVIDIA Nemotron 3.5 Lightning (30B-A3B)' },
                    { label: 'Storage', value: 'Tamper-evident clinical ledger' },
                    { label: 'Build', value: '2026.09.30 — Production' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.9rem' }}>
                      <span style={{ color: '#64748B' }}>{item.label}</span>
                      <span style={{ color: '#1E293B', fontWeight: 500 }}>{item.value}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button onClick={() => alert('Terms of Service')} style={{ flex: 1, padding: '0.6rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '0.85rem', color: '#475569' }}>Terms of Service</button>
                    <button onClick={() => alert('Privacy Policy')} style={{ flex: 1, padding: '0.6rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '0.85rem', color: '#475569' }}>Privacy Policy</button>
                    <button onClick={() => alert('Contact: support@carechain.health')} style={{ flex: 1, padding: '0.6rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '0.85rem', color: '#475569' }}>Contact Support</button>
                  </div>
                </div>
              </CardB>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
