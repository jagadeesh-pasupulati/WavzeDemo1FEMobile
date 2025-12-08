# Wavze Mobile Application (Android)

## Overview

This is the Android mobile application version of Wavze, built using Angular 17 and Capacitor. It provides all the features of the web application optimized for mobile devices.

## Features

The Wavze Android app includes all features from the web application:

- 📊 **Dashboard** - Real-time statistics and KPIs
- 👥 **Customer Management** - View and manage customer information
- 📞 **Call Summaries** - AI-powered call transcription and analysis
- 📱 **Mobile Optimized** - Native Android experience with Capacitor
- 🎨 **Modern UI** - Beautiful interface with PrimeNG and Tailwind CSS

## Technology Stack

- **Framework:** Angular 17 (Standalone Components)
- **Mobile Runtime:** Capacitor 7
- **UI Components:** PrimeNG 17
- **Styling:** Tailwind CSS
- **State Management:** RxJS
- **Build Tool:** Angular CLI

## Quick Start

### Prerequisites

1. Install Node.js (v18+) and npm
2. Install Android Studio
3. Set up Android SDK and environment variables

### Installation & Build

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Build and sync Android
npm run build:android

# 4. Open in Android Studio
npm run android:open
```

### Run on Device/Emulator

```bash
# Run on connected device or emulator
npm run android:run
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Angular components
│   │   │   ├── dashboard/       # Dashboard view
│   │   │   ├── customers/       # Customer list
│   │   │   ├── customer-details/# Customer details
│   │   │   ├── call-summary/    # Call summary & transcription
│   │   │   └── shared/          # Shared components (sidebar, etc.)
│   │   ├── services/            # Angular services
│   │   │   ├── platform.service.ts      # Platform detection
│   │   │   ├── customer.service.ts      # Customer API
│   │   │   ├── dashboard.service.ts     # Dashboard API
│   │   │   ├── communication.service.ts # Communication API
│   │   │   └── call-summary.service.ts  # Call summary API
│   │   ├── models/              # TypeScript interfaces
│   │   └── app.routes.ts        # Route configuration
│   ├── environments/            # Environment configurations
│   ├── assets/                  # Static assets (images, audio)
│   └── index.html              # Main HTML file
├── android/                     # Native Android project
│   ├── app/                    # Android app module
│   │   └── src/main/
│   │       ├── res/            # Android resources (icons, splash)
│   │       └── AndroidManifest.xml
│   └── build.gradle            # Android build configuration
├── capacitor.config.ts         # Capacitor configuration
├── angular.json                # Angular CLI configuration
└── package.json                # Node dependencies & scripts
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run development server |
| `npm run build` | Build Angular app for production |
| `npm run build:android` | Build and sync to Android |
| `npm run android:open` | Open in Android Studio |
| `npm run android:run` | Run on device/emulator |
| `npm run android:sync` | Sync web assets to Android |
| `npm run android:build` | Build debug APK |
| `npm run android:release` | Build release APK |

## Capacitor Plugins Used

- **@capacitor/core** - Core Capacitor runtime
- **@capacitor/android** - Android platform support
- **@capacitor/status-bar** - Status bar styling
- **@capacitor/splash-screen** - Splash screen management

## Configuration

### API Endpoints

Update API endpoints in environment files:

- **Development:** `src/environments/environment.ts`
- **Production:** `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-url.com',
  mobile: true
};
```

### App Configuration

Main Capacitor config: `capacitor.config.ts`

```typescript
const config: CapacitorConfig = {
  appId: 'com.wavze.app',
  appName: 'Wavze',
  webDir: 'dist/wavzedemo1',
  // ... other settings
};
```

## Building for Production

### Generate Release APK

1. Configure signing keys (see [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md))
2. Build release APK:
   ```bash
   npm run android:release
   ```
3. Locate APK at: `android/app/build/outputs/apk/release/`

### App Store Deployment

For Google Play Store deployment:

1. Generate signed AAB (Android App Bundle):
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
2. Locate AAB at: `android/app/build/outputs/bundle/release/`
3. Upload to Google Play Console

## Mobile-Specific Features

### Platform Detection

The app uses `PlatformService` to detect the runtime environment:

```typescript
// In any component
constructor(private platform: PlatformService) {}

if (this.platform.isNative()) {
  // Mobile-specific code
}

if (this.platform.isAndroid()) {
  // Android-specific code
}
```

### Status Bar & Splash Screen

Configured in `app.component.ts`:
- Status bar color matches app theme
- Splash screen auto-hides after app initialization

### Responsive Design

The UI automatically adapts to mobile screen sizes using:
- Tailwind CSS responsive utilities
- PrimeNG responsive components
- Mobile-first design approach

## Development Workflow

### 1. Web Development

Develop and test in browser first:

```bash
npm start
# Open http://localhost:4200
```

### 2. Mobile Testing

Test on Android device/emulator:

```bash
npm run build:android
npm run android:run
```

### 3. Live Reload (Optional)

For live reload on device during development:

1. Get your computer's IP address
2. Update `capacitor.config.ts`:
   ```typescript
   server: {
     url: 'http://YOUR_IP:4200',
     cleartext: true
   }
   ```
3. Run: `npm start` and `npm run android:sync`

**Remember to remove server.url before production builds!**

## Debugging

### Chrome DevTools

1. Connect device via USB
2. Enable USB debugging on Android
3. Open `chrome://inspect` in Chrome browser
4. Click "Inspect" on Wavze app

### Android Studio Logcat

1. Open Android Studio
2. View → Tool Windows → Logcat
3. Filter by: `com.wavze.app`

## Troubleshooting

See [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md#troubleshooting) for common issues and solutions.

### Quick Fixes

**White screen on launch:**
- Check API connectivity
- Verify CSP in index.html
- Check Chrome DevTools console

**Build errors:**
- Run `npx cap doctor` to check setup
- Ensure Android SDK is properly configured
- Verify all dependencies are installed

**Sync errors:**
- Build Angular app first: `npm run build`
- Clean Android build: `cd android && ./gradlew clean`

## Performance Optimization

The mobile app includes several optimizations:

1. **Production Builds:**
   - AOT compilation
   - Tree shaking
   - Minification
   - Bundle optimization

2. **Lazy Loading:**
   - Route-based code splitting
   - On-demand component loading

3. **Asset Optimization:**
   - Compressed images
   - Optimized audio files
   - Minimal external dependencies

## Security

### Content Security Policy

CSP is configured in `index.html` to allow:
- Self-hosted resources
- API endpoints
- Required third-party resources

### Network Security

- HTTPS enforced in production
- Cleartext traffic allowed only in development
- Secure storage for sensitive data

## Updates & Maintenance

### Update Capacitor

```bash
npm run cap:update
npx cap sync
```

### Update Angular

```bash
npm update
npm run build:android
```

### Update Android SDK

Update through Android Studio:
- Tools → SDK Manager → Check for updates

## License

Copyright © 2025 Wavze. All rights reserved.

## Additional Documentation

- [Detailed Android Build Guide](./ANDROID_BUILD_GUIDE.md)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Angular Documentation](https://angular.io/docs)
- [Backend API Documentation](../backend/README.md)

---

For detailed build instructions, see [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md)

