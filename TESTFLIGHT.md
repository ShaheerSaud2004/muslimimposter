# Deploy to TestFlight

Use this to build and submit Khafī to TestFlight so you can test on real devices.

## Prerequisites

1. **EAS CLI** – Install if needed:
   ```bash
   npm install -g eas-cli
   ```

2. **Expo account** – Log in:
   ```bash
   eas login
   ```

3. **Apple Developer account** – Your app is already on the App Store, so you should have access.

## Build and submit to TestFlight

Run:

```bash
eas build --platform ios --profile production --auto-submit
```

Or use the npm script:

```bash
npm run build:ios:testflight
```

This will:

1. Build the iOS app (production profile)
2. Submit the build to App Store Connect
3. Make it available in TestFlight after Apple processes it (usually 15–30 minutes)

## After the build

1. Open [App Store Connect](https://appstoreconnect.apple.com)
2. Go to **My Apps** → **Khafī** → **TestFlight**
3. Wait for the build to finish processing (status: “Processing” → “Ready to Test”)
4. Add yourself (or testers) as internal testers
5. Install the **TestFlight** app on your iPhone
6. Accept the invite and install Khafī from TestFlight

## Testing the update flow

1. Install the TestFlight build on your device
2. In `public/version.json` (and on khafi.org), set `minimumVersion` higher than the TestFlight build (e.g. `"1.1.8"` if the build is `1.1.7`)
3. Open the app – the “Update Required” screen should appear
4. Tap **Update** – it should open the App Store (or Safari with the store page)

## Without auto-submit

If you prefer to submit manually:

```bash
# Build only
eas build --platform ios --profile production

# Submit the latest build
eas submit --platform ios --latest
```
