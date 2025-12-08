# Wavze Android Application - Build Guide

This guide provides comprehensive instructions for building and running the Wavze Android application using Capacitor.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Workflow](#development-workflow)
4. [Building the App](#building-the-app)
5. [Running on Device/Emulator](#running-on-deviceemulator)
6. [Troubleshooting](#troubleshooting)
7. [Available NPM Scripts](#available-npm-scripts)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Android Studio** (Latest version recommended)
- **Java Development Kit (JDK)** (v17 or higher)

### Android Studio Setup
1. Download and install [Android Studio](https://developer.android.com/studio)
2. During installation, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
3. Set up environment variables:
   ```bash
   # Windows (PowerShell)
   $env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"
   $env:PATH += ";$env:ANDROID_HOME\platform-tools"
   $env:PATH += ";$env:ANDROID_HOME\tools"
   
   # Add to System Environment Variables for persistence
   ```

---

## Initial Setup

### 1. Install Dependencies

Navigate to the frontend directory and install all required packages:

```bash
cd frontend
npm install
```

### 2. Verify Capacitor Installation

Check if Capacitor is properly configured:

```bash
npx cap doctor
```

This command will verify your environment and highlight any missing requirements.

---

## Development Workflow

### Step 1: Build Angular Application

Build the Angular web application for production:

```bash
npm run build
```

This creates optimized production files in the `dist/wavzedemo1` directory.

### Step 2: Sync with Android Platform

Sync the built web assets with the Android project:

```bash
npm run android:sync
```

Or use the combined build and sync command:

```bash
npm run build:android
```

### Step 3: Open in Android Studio

Open the Android project in Android Studio:

```bash
npm run android:open
```

Or manually open:
```
File → Open → Navigate to: frontend/android
```

---

## Building the App

### Debug Build (Development)

For development and testing:

```bash
# Method 1: Using npm script
npm run android:build

# Method 2: Using Android Studio
# Click: Build → Build Bundle(s) / APK(s) → Build APK(s)

# Method 3: Using Gradle directly
cd android
./gradlew assembleDebug
cd ..
```

The debug APK will be located at:
```
frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

### Release Build (Production)

For production release:

```bash
# Using npm script
npm run android:release

# Or using Gradle
cd android
./gradlew assembleRelease
cd ..
```

**Note:** For release builds, you'll need to configure signing keys. See [Signing Configuration](#signing-configuration) below.

The release APK will be located at:
```
frontend/android/app/build/outputs/apk/release/app-release.apk
```

---

## Running on Device/Emulator

### Method 1: Using Capacitor CLI (Recommended)

```bash
npm run android:run
```

This command will:
- Build the Angular app
- Sync with Android
- Launch the app on a connected device or running emulator

### Method 2: Using Android Studio

1. Open the project in Android Studio
2. Select a device/emulator from the device dropdown
3. Click the "Run" button (green play icon)

### Method 3: Manual Installation

Install the APK on a connected device:

```bash
# Navigate to the APK location
cd android/app/build/outputs/apk/debug

# Install using ADB
adb install app-debug.apk
```

---

## Signing Configuration

For release builds, you need to configure app signing:

### 1. Generate a Keystore

```bash
keytool -genkey -v -keystore wavze-release-key.keystore -alias wavze -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Gradle

Create a file `frontend/android/keystore.properties`:

```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=wavze
storeFile=path/to/wavze-release-key.keystore
```

### 3. Update build.gradle

Add to `frontend/android/app/build.gradle`:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('keystore.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

**Important:** Never commit `keystore.properties` or your keystore file to version control!

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "SDK location not found"

**Solution:**
Create `frontend/android/local.properties`:
```properties
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

#### Issue: "Capacitor sync failed - webDir not found"

**Solution:**
Build the Angular app first:
```bash
npm run build
```

#### Issue: "JAVA_HOME not set"

**Solution:**
Set JAVA_HOME environment variable:
```bash
# Windows
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
```

#### Issue: App shows white screen on launch

**Solutions:**
1. Check if the API URL is accessible from the device
2. Verify Content Security Policy in `index.html`
3. Check browser console in Chrome DevTools:
   - Enable USB debugging on device
   - Open chrome://inspect in Chrome browser
   - Select your device and inspect

#### Issue: "Cleartext HTTP not permitted"

**Solution:**
For development with HTTP APIs, the `android:usesCleartextTraffic="true"` is already configured in the manifest. For production, use HTTPS.

---

## Available NPM Scripts

Here are all the available commands for Android development:

| Command | Description |
|---------|-------------|
| `npm run build:mobile` | Build Angular app and sync all platforms |
| `npm run build:android` | Build Angular app and sync Android platform |
| `npm run android:open` | Open Android project in Android Studio |
| `npm run android:run` | Build, sync, and run app on device/emulator |
| `npm run android:sync` | Sync web assets to Android platform |
| `npm run android:build` | Build debug APK |
| `npm run android:release` | Build release APK |
| `npm run cap:sync` | Sync all Capacitor platforms |
| `npm run cap:update` | Update Capacitor dependencies |

---

## Development Tips

### Live Reload During Development

For faster development, you can use the Angular dev server and access it from your device:

1. Find your computer's IP address (e.g., 192.168.1.100)
2. Update `capacitor.config.ts`:
   ```typescript
   server: {
     url: 'http://192.168.1.100:4200',
     cleartext: true
   }
   ```
3. Start Angular dev server:
   ```bash
   npm start
   ```
4. Sync and run:
   ```bash
   npm run android:sync
   npm run android:run
   ```

**Remember:** Remove the `server.url` before production builds!

### Debugging

1. **Chrome DevTools:**
   - Connect device via USB
   - Enable USB debugging on Android device
   - Open `chrome://inspect` in Chrome
   - Inspect the Wavze app

2. **Android Studio Logcat:**
   - View → Tool Windows → Logcat
   - Filter by package: `com.wavze.app`

---

## Production Checklist

Before releasing to production:

- [ ] Update version in `android/app/build.gradle`
- [ ] Configure proper signing keys
- [ ] Remove any development `server.url` from `capacitor.config.ts`
- [ ] Test on multiple Android versions
- [ ] Verify all API endpoints use HTTPS
- [ ] Test with ProGuard enabled (if using)
- [ ] Generate signed release APK/AAB
- [ ] Test the signed build on actual devices

---

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [Angular Documentation](https://angular.io/docs)
- [Wavze Backend API Documentation](../backend/README.md)

---

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Capacitor logs: `npx cap doctor`
3. Check Android Logcat in Android Studio
4. Refer to the main project README.md

---

**Last Updated:** December 2025
**Version:** 1.0.0

