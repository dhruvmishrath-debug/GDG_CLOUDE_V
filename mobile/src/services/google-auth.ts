import { Platform } from 'react-native';
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
  type User,
} from '@react-native-google-signin/google-signin';

import {
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
  isGoogleAuthConfigured,
} from '@/config/google-auth';

export type GoogleProfile = {
  id: string;
  email: string;
  name: string;
  photo?: string | null;
  givenName?: string | null;
  familyName?: string | null;
};

export type GoogleSignInResult =
  | { status: 'success'; profile: GoogleProfile }
  | { status: 'cancelled' }
  | { status: 'unavailable'; reason: string }
  | { status: 'error'; message: string };

let configured = false;

/**
 * Configure the native Google Sign-In module. Safe to call repeatedly.
 * On web the native module is unavailable, so this is a no-op.
 */
export function configureGoogleSignIn(): void {
  if (configured || Platform.OS === 'web') return;
  if (!isGoogleAuthConfigured()) return;

  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    scopes: ['email', 'profile'],
    offlineAccess: false,
  });
  configured = true;
}

function toProfile(user: User): GoogleProfile {
  const info = user.user;
  return {
    id: info.id,
    email: info.email,
    name: info.name ?? info.email,
    photo: info.photo,
    givenName: info.givenName,
    familyName: info.familyName,
  };
}

/**
 * Launch the native Google account picker and return the signed-in profile.
 */
export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  if (Platform.OS === 'web') {
    return {
      status: 'unavailable',
      reason: 'Google Sign-In is only available in the Android/iOS app build.',
    };
  }
  if (!isGoogleAuthConfigured()) {
    return {
      status: 'unavailable',
      reason: 'Google Sign-In is not configured yet. Add your client ID first.',
    };
  }

  try {
    configureGoogleSignIn();
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();
    if (isCancelledResponse(response)) return { status: 'cancelled' };
    if (isSuccessResponse(response)) {
      return { status: 'success', profile: toProfile(response.data) };
    }
    return { status: 'cancelled' };
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          return { status: 'error', message: 'Sign-in already in progress.' };
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          return {
            status: 'unavailable',
            reason: 'Google Play Services is unavailable on this device.',
          };
        default:
          return { status: 'error', message: error.message || 'Google sign-in failed.' };
      }
    }
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Google sign-in failed.',
    };
  }
}

/** Sign out of the Google session (best-effort). */
export async function signOutGoogle(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await GoogleSignin.signOut();
  } catch {
    // ignore
  }
}
