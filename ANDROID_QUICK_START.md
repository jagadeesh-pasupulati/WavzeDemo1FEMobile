# Wavze Android App - Quick Start Guide

## ⚡ Quick Commands

### First Time Setup
```bash
cd frontend
npm install
npm run build:android
npm run android:open
```

### Daily Development
```bash
# Build Angular + Sync Android
npm run build:android

# Open in Android Studio
npm run android:open

# Run on device/emulator
npm run android:run
```

### Testing
```bash
# Build debug APK
npm run android:build

# Build release APK
npm run android:release
```

## 📱 Running the App

### Option 1: Capacitor CLI (Easiest)
```bash
npm run android:run
```

### Option 2: Android Studio
1. `npm run android:open`
2. Select device/emulator
3. Click Run (▶️)

### Option 3: Manual APK Install
```bash
npm run android:build
cd android/app/build/outputs/apk/debug
adb install app-debug.apk
```

## 🔧 Common Issues

### "SDK not found"
Create `android/local.properties`:
```
sdk.dir=C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk
```

### "webDir not found"
```bash
npm run build
```

### White screen
1. Check API URL in environments
2. Verify device can reach API
3. Check Chrome DevTools: `chrome://inspect`

### App won't install
```bash
# Clean build
cd android
./gradlew clean
cd ..
npm run build:android
```

## 📊 Project Info

- **App Name:** Wavze
- **Package:** com.wavze.app
- **Min SDK:** 22 (Android 5.0+)
- **Target SDK:** Latest

## 🌐 API Configuration

### Development (localhost)
`src/environments/environment.ts`:
```typescript
apiUrl: 'http://localhost:8080'
```

### Production (Azure)
`src/environments/environment.prod.ts`:
```typescript
apiUrl: 'https://wavzedemo.azurewebsites.net'
```

## 🐛 Debugging

### Chrome DevTools
1. Connect phone via USB
2. Enable USB debugging
3. Open `chrome://inspect`
4. Inspect Wavze app

### Android Studio Logcat
1. View → Tool Windows → Logcat
2. Filter: `com.wavze.app`

## 📁 Key Files

| File | Purpose |
|------|---------|
| `capacitor.config.ts` | Capacitor settings |
| `android/app/build.gradle` | Android build config |
| `android/app/src/main/AndroidManifest.xml` | App permissions |
| `src/environments/` | API endpoints |
| `src/index.html` | Mobile meta tags |

## 🚀 Build for Production

1. **Update version** in `android/app/build.gradle`:
   ```gradle
   versionCode 2
   versionName "1.1"
   ```

2. **Configure signing** (see ANDROID_BUILD_GUIDE.md)

3. **Build release:**
   ```bash
   npm run android:release
   ```

4. **Locate APK:**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

## 💡 Pro Tips

### Live Reload
```typescript
// capacitor.config.ts (development only)
server: {
  url: 'http://YOUR_IP:4200',
  cleartext: true
}
```
Then:
```bash
npm start
npm run android:sync
```

### Fast Rebuild
```bash
# Skip Android Studio, use Gradle
cd android && ./gradlew assembleDebug && cd ..
```

### Check Environment
```bash
npx cap doctor
```

## 📚 Full Documentation

- **Detailed Guide:** [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md)
- **Mobile Features:** [MOBILE_README.md](./MOBILE_README.md)
- **Backend API:** [../backend/README.md](../backend/README.md)

---

**Need Help?** Check ANDROID_BUILD_GUIDE.md for comprehensive troubleshooting.

