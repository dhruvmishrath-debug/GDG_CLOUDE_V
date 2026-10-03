import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, Mail, Lock, ArrowRight, Building2, Pill, User } from 'lucide-react-native';
import * as SplashScreen from 'expo-splash-screen';

import GoogleLogo from '@/components/google-logo';
import { configureGoogleSignIn, signInWithGoogle } from '@/services/google-auth';

SplashScreen.hideAsync();

/** Maps any authenticated email to a portal. */
const portalForEmail = (userEmail: string): '/hospital' | '/pharmacy' | '/patient' | null => {
  const e = userEmail.toLowerCase();
  if (e === 'dhruvmishrath@gmail.com' || e === 'hodpital@health.ai') return '/hospital';
  if (e === 'dhruvmishrata@gmail.com' || e === 'medical@health.ai') return '/pharmacy';
  if (e === 'dhruvmishrats@gmail.com' || e === 'patient@health.ai') return '/patient';
  return null;
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const routeByEmail = (userEmail: string) => {
    const portal = portalForEmail(userEmail);
    if (portal) {
      router.replace(portal);
    } else {
      Alert.alert('Error', `Email not recognized: ${userEmail}`);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();

      if (result.status === 'success') {
        const portal = portalForEmail(result.profile.email);
        if (portal) {
          router.replace(portal);
        } else {
          Alert.alert(
            'Account not linked',
            `${result.profile.email} isn't linked to a portal yet. Use a registered account or continue with email.`
          );
        }
        return;
      }

      if (result.status === 'cancelled') return;

      if (result.status === 'unavailable') {
        Alert.alert('Google Sign-In unavailable', result.reason);
        return;
      }

      Alert.alert('Google Sign-In failed', result.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    if (password !== 'Dhruv@2007') {
      Alert.alert('Error', 'Incorrect password!');
      return;
    }
    routeByEmail(email);
  };

  const quickLogin = (role: string) => {
    let e = '';
    if (role === 'hospital') e = 'hodpital@health.ai';
    if (role === 'pharmacy') e = 'medical@health.ai';
    if (role === 'patient') e = 'patient@health.ai';
    setEmail(e);
    setPassword('Dhruv@2007');
    setTimeout(() => {
      routeByEmail(e);
    }, 300);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Activity size={40} color="#2563EB" />
          </View>
          <Text style={styles.logoText}>CareChain</Text>
          <Text style={styles.tagline}>AI-Powered Healthcare Platform</Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSub}>Sign in to access your portal</Text>

          {/* Google Sign-In */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
            disabled={googleLoading}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            {googleLoading ? (
              <ActivityIndicator size="small" color="#1E293B" />
            ) : (
              <>
                <GoogleLogo size={20} />
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with email</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.inputGroup}>
            <Mail size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Lock size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginBtnText}>Sign In</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Quick Demo */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Quick Demo Login</Text>
          <View style={styles.demoGrid}>
            <TouchableOpacity style={[styles.demoCard, { borderColor: '#DBEAFE' }]} onPress={() => quickLogin('hospital')}>
              <View style={[styles.demoIcon, { backgroundColor: '#DBEAFE' }]}><Building2 size={20} color="#2563EB" /></View>
              <Text style={styles.demoLabel}>Hospital</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.demoCard, { borderColor: '#F5F3FF' }]} onPress={() => quickLogin('pharmacy')}>
              <View style={[styles.demoIcon, { backgroundColor: '#F5F3FF' }]}><Pill size={20} color="#8B5CF6" /></View>
              <Text style={styles.demoLabel}>Pharmacy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.demoCard, { borderColor: '#ECFDF5' }]} onPress={() => quickLogin('patient')}>
              <View style={[styles.demoIcon, { backgroundColor: '#ECFDF5' }]}><User size={20} color="#10B981" /></View>
              <Text style={styles.demoLabel}>Patient</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 60 },

  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8 },
  logoText: { fontSize: 32, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: '#64748B', marginTop: 4 },

  formCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4 },
  formTitle: { fontSize: 22, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  formSub: { fontSize: 14, color: '#64748B', marginBottom: 24 },

  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0', paddingVertical: 14, borderRadius: 14, minHeight: 52 },
  googleBtnText: { fontSize: 15, fontWeight: '600', color: '#1E293B' },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },

  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, marginBottom: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: '#1E293B' },

  loginBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 14, marginTop: 8, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  demoSection: { alignItems: 'center' },
  demoTitle: { fontSize: 14, fontWeight: '500', color: '#64748B', marginBottom: 16 },
  demoGrid: { flexDirection: 'row', gap: 12 },
  demoCard: { alignItems: 'center', gap: 8, paddingVertical: 16, paddingHorizontal: 20, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, flex: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  demoIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  demoLabel: { fontSize: 12, fontWeight: '600', color: '#475569' },
});
