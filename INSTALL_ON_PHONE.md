# Installing Wavze on Physical Android Phone

## 📱 Complete Guide for Physical Device Installation

---

## 🔧 Initial Phone Setup (One-Time)

### Enable Developer Mode & USB Debugging

#### For Most Android Phones:

1. **Open Settings**
2. **Go to About Phone** (or About Device)
3. **Find Build Number**
   - Might be under: Software Information / Software / About
4. **Tap Build Number 7 times rapidly**
   - Enter PIN/password if prompted
   - Message appears: "You are now a developer!"
5. **Go back to Settings main menu**
6. **Find Developer Options** (newly appeared)
   - Usually under System / Additional Settings
7. **Enable USB Debugging**
   - Toggle ON
   - Confirm the dialog

#### Samsung Phones:
```
Settings → About phone → Software information 
→ Build number (tap 7x)
→ Back → Developer options → USB debugging (ON)
```

#### Xiaomi/MIUI Phones:
```
Settings → About phone → MIUI version (tap 7x)
→ Back → Additional settings → Developer options 
→ USB debugging (ON)
```

#### OnePlus Phones:
```
Settings → About phone → Build number (tap 7x)
→ Back → System → Developer options 
→ USB debugging (ON)
```

---

## 🔌 Connect Phone to Computer

### Step 1: Physical Connection

1. **Get a USB cable** (preferably the one that came with your phone)
2. **Connect phone to computer**
   - Use USB 2.0 or 3.0 port (not USB-C hub if possible)
3. **Unlock your phone**

### Step 2: USB Configuration

On your phone, when you connect:

1. **Swipe down** notification panel
2. **Tap USB notification**
   - Says "Charging this device via USB" or similar
3. **Select "File Transfer" or "MTP"**
   - Not "Charging only"

### Step 3: Authorize Computer

1. **Popup appears**: "Allow USB debugging?"
   - Shows computer's RSA key fingerprint
2. **Check**: "Always allow from this computer"
3. **Tap "OK" or "Allow"**

### Step 4: Verify Connection

Open PowerShell/Command Prompt:

```powershell
# Check connected devices
adb devices
```

**Expected Output:**
```
List of devices attached
RF8N30XXXXX    device
```

**If you see "unauthorized":**
- Unlock your phone
- Check for authorization popup
- Tap "Allow" in the USB debugging dialog

**If no devices appear:**
- Try a different USB cable
- Try a different USB port
- Restart ADB: `adb kill-server` then `adb start-server`
- Check USB connection mode (should be File Transfer)

---

## 🚀 Installation Methods

### ⚡ Method 1: Quick Run (Recommended)

#### Navigate to frontend folder:

```bash
cd "C:\Jagadeesh\CursorWorkspaces\WavzeDemo1.0 - Mobile\frontend"
```

#### Run on your phone:

```bash
npm run android:run
```

This will:
1. ✅ Build the Angular app
2. ✅ Sync with Android
3. ✅ Install on your phone
4. ✅ Launch the app

**Wait time:** ~30-60 seconds

---

### 🎯 Method 2: Using Android Studio

#### Step 1: Open Project

```bash
npm run android:open
```

#### Step 2: Select Your Device

In Android Studio toolbar:
```
┌────────────────────────────┐
│ [Device Dropdown ▼]  ▶️    │
│  - Medium Phone API 36     │
│  - Samsung Galaxy S21  ✓   │ ← Your phone!
└────────────────────────────┘
```

Click dropdown → Select your physical device

#### Step 3: Run

Click **▶️ Run** button or press `Shift + F10`

The app will:
- Build automatically
- Install on your phone
- Launch

---

### 📦 Method 3: Build APK & Install

#### Build the APK:

```bash
# Navigate to frontend
cd frontend

# Build debug APK
npm run android:build
```

APK Location:
```
frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

#### Install via ADB:

```bash
# Navigate to APK folder
cd android/app/build/outputs/apk/debug

# Install on phone
adb install app-debug.apk

# Force reinstall (if app already exists)
adb install -r app-debug.apk
```

#### Or Transfer to Phone:

1. **Copy APK file** to your phone's Downloads folder
2. **On phone**: Open Files/Downloads app
3. **Tap** `app-debug.apk`
4. **Tap Install**
5. If prompted, **allow "Install from unknown sources"**

---

## 📲 Install from Unknown Sources

If you get a security warning when installing APK:

### Android 8.0+

1. When prompted, tap **Settings**
2. Enable **"Allow from this source"**
3. Go back and tap **Install** again

### Android 11+

```
Settings → Apps → Special app access 
→ Install unknown apps → Files 
→ Allow from this source (ON)
```

---

## 🎨 Testing on Your Phone

### First Launch

1. **Find the app** on your phone
   - Look for "Wavze" icon
   - Blue icon with wave pattern

2. **Tap to open**

3. **Splash screen appears** (blue)

4. **Dashboard loads**
   - Stats cards
   - Today's Customers section
   - All features available!

### Test Features

- ✅ Navigation drawer (hamburger menu)
- ✅ Dashboard stats cards
- ✅ Today's Customers section
- ✅ Customer list
- ✅ Customer details
- ✅ Search functionality
- ✅ All mobile-optimized layouts

---

## 🔍 Debugging on Phone

### View Console Logs

#### Chrome DevTools:

1. **Connect phone via USB**
2. **Open Chrome browser** on computer
3. **Go to**: `chrome://inspect`
4. **Find your device** in the list
5. **Click "inspect"** under Wavze app
6. **DevTools opens** with console, network, etc.

#### Android Studio Logcat:

1. Open Android Studio
2. Bottom toolbar → **Logcat**
3. Select your device
4. Filter by: `com.wavze.app`
5. See all logs in real-time

---

## 🔄 Live Development on Phone

For faster development, use live reload:

### Setup:

1. **Get your computer's IP address**
   ```powershell
   ipconfig
   ```
   Look for IPv4 Address (e.g., `192.168.1.100`)

2. **Update `capacitor.config.ts`**:
   ```typescript
   const config: CapacitorConfig = {
     appId: 'com.wavze.app',
     appName: 'Wavze',
     webDir: 'dist/wavzedemo1',
     server: {
       url: 'http://192.168.1.100:4200',  // Your IP
       cleartext: true
     }
   };
   ```

3. **Start dev server**:
   ```bash
   npm start
   ```

4. **Sync and run**:
   ```bash
   npm run android:sync
   npm run android:run
   ```

Now changes auto-reload on your phone!

**Remember**: Remove `server.url` before production build!

---

## ⚠️ Common Issues & Solutions

### Issue: Phone not detected

**Solutions:**
- ✅ Try different USB cable
- ✅ Try different USB port
- ✅ Enable "File Transfer" mode on phone
- ✅ Restart ADB: `adb kill-server` then `adb start-server`
- ✅ Unplug and replug USB cable
- ✅ Restart phone

### Issue: "Unauthorized" device

**Solutions:**
- ✅ Unlock phone screen
- ✅ Check for USB debugging popup
- ✅ Tap "Always allow" and "OK"
- ✅ Revoke authorizations: Developer Options → Revoke USB debugging authorizations
- ✅ Reconnect and reauthorize

### Issue: App won't install

**Solutions:**
- ✅ Uninstall existing app first
- ✅ Use `adb install -r app-debug.apk` (force reinstall)
- ✅ Clean build: `cd android && ./gradlew clean`
- ✅ Check phone storage (need ~50MB free)

### Issue: App crashes on launch

**Solutions:**
- ✅ Check Logcat for errors
- ✅ Rebuild: `npm run build:android`
- ✅ Clear app data: Settings → Apps → Wavze → Clear data
- ✅ Reinstall app

### Issue: White screen

**Solutions:**
- ✅ Ensure backend API is accessible from phone's network
- ✅ Check `chrome://inspect` console for errors
- ✅ Verify `environment.prod.ts` has correct API URL
- ✅ Check Content Security Policy in `index.html`

### Issue: Can't see logs in chrome://inspect

**Solutions:**
- ✅ Enable "USB debugging" on phone
- ✅ Phone must be unlocked
- ✅ Try different Chrome/Edge browser
- ✅ Disconnect and reconnect USB

---

## 📋 Pre-Flight Checklist

Before installing on phone:

- [ ] USB debugging enabled on phone
- [ ] Phone connected via USB
- [ ] Phone unlocked
- [ ] USB debugging authorized
- [ ] `adb devices` shows your device
- [ ] Angular app built: `npm run build`
- [ ] API URL configured in environment files

---

## 🚀 Quick Command Reference

```bash
# Navigate to project
cd "C:\Jagadeesh\CursorWorkspaces\WavzeDemo1.0 - Mobile\frontend"

# Build and run on phone
npm run build:android
npm run android:run

# Check connected devices
adb devices

# Install APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Uninstall app
adb uninstall com.wavze.app

# View logs
adb logcat | findstr "Wavze"

# Open Android Studio
npm run android:open
```

---

## 🎯 Performance Tips

### For Best Performance:

1. **Use "File Transfer" USB mode** (not MTP)
2. **Close other apps** on phone
3. **Ensure good internet** (for API calls)
4. **Keep phone charged** (>20%)
5. **Use physical USB cable** (not wireless)

### For Faster Builds:

1. **Don't clean every time**
2. **Use incremental builds**
3. **Keep Android Studio open**
4. **Use SSD storage** (if available)

---

## 📱 Device Compatibility

### Minimum Requirements:
- **Android**: 5.0 (Lollipop) / API Level 22+
- **RAM**: 2GB+
- **Storage**: 50MB+ free space
- **Screen**: Any size (optimized for 4.5" - 6.8")

### Tested Devices:
- Samsung Galaxy series
- Google Pixel series
- OnePlus devices
- Xiaomi/Redmi devices
- Most modern Android phones

---

## 🔐 Security Notes

### Development Build (Debug APK):
- ✅ Safe for testing
- ✅ Has debug features enabled
- ⚠️ Not for production/distribution
- ⚠️ Larger file size

### For Production:
- Generate signed release APK
- Remove debug features
- Use release build configuration
- Follow Play Store guidelines

---

## 📞 Support

### If You're Stuck:

1. **Check**: This guide's troubleshooting section
2. **Check**: `ANDROID_BUILD_GUIDE.md` for detailed build info
3. **Check**: Logcat for error messages
4. **Check**: Chrome DevTools console

### Useful Commands:

```bash
# Check ADB version
adb version

# Restart ADB
adb kill-server
adb start-server

# Check phone info
adb shell getprop ro.build.version.release

# Screen recording (for bug reports)
adb shell screenrecord /sdcard/demo.mp4
```

---

**You're all set to run Wavze on your Android phone!** 📱✨

**Happy Testing!** 🎉

