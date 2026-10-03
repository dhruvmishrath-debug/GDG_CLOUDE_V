import Constants from 'expo-constants';

/**
 * Google Sign-In configuration.
 *
 * These values are PUBLIC client IDs (not secrets) and are safe to ship.
 * Override them either with EXPO_PUBLIC_* env vars or via app.json `extra`.
 *
 * Android note: `webClientId` is what the native module needs; the Android
 * OAuth client is matched by package name + SHA-1 registered in Google Cloud
 * (see GOOGLE_SIGNIN_SETUP.md). No client ID is passed for Android.
 */

type Extra = {
  googleWebClientId?: string;
  googleIosClientId?: string;
  googleAndroidClientId?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

// Reuse the web OAuth client already present in this project.
const DEFAULT_WEB_CLIENT_ID =
  '373246222051-3lkjpv7pbreoos757dn5csp6f3gmm2al.apps.googleusercontent.com';

export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || extra.googleWebClientId || DEFAULT_WEB_CLIENT_ID;

export const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || extra.googleIosClientId || '';

/** Documented for reference — not passed to the native module. */
export const GOOGLE_ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || extra.googleAndroidClientId || '';

/** True when a usable client ID is present. */
export const isGoogleAuthConfigured = (): boolean =>
  GOOGLE_WEB_CLIENT_ID.length > 0 && !GOOGLE_WEB_CLIENT_ID.startsWith('<');
