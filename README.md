# Daily Prayers & Supplications (Mobile App)

A simple Expo React Native application for daily prayers and supplications.

## Features
- View a highlighted **Today’s Supplication** card.
- Browse all supplications.
- Add a **new daily supplication** from the app.
- Saves your supplications locally on the device using AsyncStorage.

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm run start
   ```
3. Open on Android/iOS emulator or Expo Go.

## Build APK (Android)
This project is configured for Expo EAS APK builds.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
3. Login to Expo:
   ```bash
   eas login
   ```
4. Build APK:
   ```bash
   eas build -p android --profile preview
   ```
5. After the build finishes, Expo provides a download URL for the `.apk` file.

### Notes
- `preview` profile in `eas.json` is configured with `buildType: apk`.
- `production` profile builds Android App Bundle (`.aab`) for Play Store upload.
