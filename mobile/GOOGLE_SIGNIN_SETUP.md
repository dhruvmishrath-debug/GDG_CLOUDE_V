# Google Sign-In setup (CityCare mobile app)

The code is wired up. To make Google sign-in actually work in the APK you must
register the app's signing certificate with Google. This is a Google-account
step I cannot do for you.

## What's already done in the repo

- `@react-native-google-signin/google-signin` installed (native module).
- Login screen (`src/app/index.tsx`) has a **Continue with Google** button.
- `src/services/google-auth.ts` wraps the native sign-in flow.
- Web client ID configured in `app.json` → `extra.googleWebClientId`.
- EAS `preview` profile produces an installable **.apk**.

## Package name

```
com.dhruv21112007.mobile
```

## Step 1 — Get the app's SHA-1 fingerprint

There are two signing keys: the **local debug** key and the **EAS release** key
used for the APK you will install. Register **both**.

### Local debug SHA-1 (already computed for you)

```
5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

### EAS release SHA-1 (needed for the APK from `eas build`)

Run this after the first build (or before, it works too):

```bash
cd mobile
npx eas credentials -p android
# choose the build profile, then "Keystore" → view/download
# or run:
npx eas credentials -p android --json
```

Look for the `sha1` / `SHA1 Fingerprint` value of the **Release Keystore**.
Alternatively, after downloading the built APK, run:

```bash
npx @react-native-google-signin/config-doctor
```

which prints the SHA-1 of the installed/built app for you.

## Step 2 — Create the Android OAuth client

1. Open <https://console.cloud.google.com/apis/credentials>.
2. Make sure the correct project is selected (the one that owns web client
   `373246222051-...`), or create a project.
3. **Create credentials → OAuth client ID → Android**.
4. Package name: `com.dhruv21112007.mobile`
5. SHA-1: paste the fingerprint from Step 1.
6. Repeat for each SHA-1 (debug + EAS release).

You do **not** need to copy any Android client ID into the code. The native
module matches the app to this OAuth client via package name + signature.

## Step 3 — Verify the web client ID

The `configure()` call needs the **Web** client ID. It is already set in
`app.json`:

```
373246222051-3lkjpv7pbreoos757dn5csp6f3gmm2al.apps.googleusercontent.com
```

If that web client belongs to a different Google Cloud project than the Android
client you create in Step 2, create both clients in the **same** project.

## Step 4 — Link accounts to portals

The app routes by email. Google sign-in only lands in a portal if the Google
account's email matches one of these (see `portalForEmail` in `src/app/index.tsx`):

| Email | Portal |
| --- | --- |
| `dhruvmishrath@gmail.com` or `hodpital@health.ai` | Hospital (Admin) |
| `dhruvmishrata@gmail.com` or `medical@health.ai` | Pharmacy |
| `dhruvmishrats@gmail.com` or `patient@health.ai` | Patient |

Sign in with one of these Google accounts, or update the mapping to your email.

## Step 5 — Build the APK

```bash
cd mobile
npx eas build -p android --profile preview
```

This produces a downloadable `.apk`. Install it on your device:

```bash
adb install path/to/app.apk
# or just open the download link EAS gives you on the phone
```

## Troubleshooting

- **`DEVELOPER_ERROR` (code 10)** → SHA-1 / package mismatch. Re-check Steps 1–2.
- **Sign-in cancelled immediately** → add the EAS release SHA-1, not just debug.
- **Works on debug APK but not release** → register the release SHA-1 too.
- **"Account not linked"** → the Google email isn't in the portal mapping (Step 4).

## Notes

- No `google-services.json` / Firebase is required for Android. If you later
  want Firebase, add `google-services.json` and set
  `"android": { "googleServicesFile": "./google-services.json" }` in `app.json`.
- The app is configured **without** the Firebase config plugin, because that
  plugin requires a `google-services.json` that this project doesn't have.
