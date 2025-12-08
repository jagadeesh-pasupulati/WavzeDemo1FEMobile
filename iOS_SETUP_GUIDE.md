# Wavze iOS Application Setup Guide

## 📱 Creating iOS App from Angular Frontend

---

## ⚠️ **CRITICAL REQUIREMENT: macOS + Xcode**

**iOS apps can ONLY be built on macOS with Xcode installed.**

### System Requirements:
- **Operating System**: macOS 11.0 (Big Sur) or later
- **Xcode**: 13.0 or later (free from Mac App Store)
- **Node.js**: 18+ (same as Android)
- **CocoaPods**: For iOS dependencies

---

## 🚫 **Cannot Build on Windows**

Unfortunately, Apple requires:
- macOS operating system
- Xcode IDE
- Apple Developer tools

### Alternatives for Windows Users:

1. **Borrow/Buy a Mac**
   - MacBook, iMac, Mac Mini
   - Can be used temporarily

2. **Mac Virtual Machine**
   - VMware with macOS (technically violates Apple EULA)
   - Hackintosh (not recommended for production)

3. **Cloud Mac Services**
   - **MacStadium** - Rent Mac in cloud
   - **AWS EC2 Mac** - Amazon's Mac instances
   - **MacinCloud** - Cloud Mac rental
   - Cost: ~$20-100/month

4. **Continuous Integration Services**
   - **App Center** (Microsoft)
   - **Bitrise**
   - **CircleCI** with Mac executors
   - Build iOS without owning Mac

5. **Hire Developer**
   - One-time setup on their Mac
   - You maintain code, they build

---

## 🍎 **If You Have Access to a Mac**

Follow these steps to create the iOS app:

### Step 1: Install Xcode

1. Open **Mac App Store**
2. Search for **"Xcode"**
3. Click **Get** / **Install** (it's free, but ~12GB)
4. Wait for installation (~1-2 hours)
5. Open Xcode
6. Accept license agreement
7. Install additional components when prompted

### Step 2: Install Command Line Tools

```bash
xcode-select --install
```

### Step 3: Install CocoaPods

```bash
sudo gem install cocoapods
```

Or if using Homebrew:
```bash
brew install cocoapods
```

### Step 4: Navigate to Project

```bash
cd /path/to/WavzeDemo1.0\ -\ Mobile/frontend
```

### Step 5: Install iOS Capacitor Package

```bash
npm install @capacitor/ios
```

### Step 6: Add iOS Platform

```bash
npx cap add ios
```

This creates:
```
frontend/
├── ios/
│   ├── App/
│   │   ├── App/
│   │   │   ├── Assets.xcassets/    # Icons, splash screens
│   │   │   ├── Info.plist          # App configuration
│   │   │   └── ...
│   │   ├── App.xcodeproj/
│   │   └── App.xcworkspace/        # Open this!
│   └── Podfile
```

### Step 7: Build Angular App

```bash
npm run build
```

### Step 8: Sync with iOS

```bash
npx cap sync ios
```

Or use the combined script:
```bash
npm run build:ios  # (add this script to package.json)
```

### Step 9: Open in Xcode

```bash
npx cap open ios
```

Or manually:
```bash
open ios/App/App.xcworkspace
```

**Important**: Always open `.xcworkspace`, NOT `.xcodeproj`!

---

## 📱 Building for iPhone/iPad

### Step 1: Configure Signing

In Xcode:

1. Select **App** project (top-left)
2. Select **App** target
3. Go to **Signing & Capabilities** tab
4. **Team**: Select your Apple ID
   - Or add account: Xcode → Preferences → Accounts
5. **Bundle Identifier**: `com.wavze.app`
6. Check **Automatically manage signing**

### Step 2: Select Device

Top toolbar:
```
[App > iPhone 14 Pro ▼]  [▶️]
```

Options:
- **iOS Simulator** (virtual device)
- **Physical iPhone** (connected via USB)

### Step 3: Run

Click **▶️ Run** button (or `Cmd + R`)

The app will:
- Build
- Install on selected device
- Launch automatically

---

## 📦 **Package.json Scripts for iOS**

Add these to `frontend/package.json`:

```json
{
  "scripts": {
    "build:ios": "ng build --configuration production && npx cap sync ios",
    "ios:open": "npx cap open ios",
    "ios:run": "npx cap run ios",
    "ios:sync": "npx cap sync ios",
    "cap:update": "npx cap update"
  }
}
```

---

## 🎨 iOS App Icons & Splash Screens

### Icons

Required sizes (in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`):

| Size | Usage | File |
|------|-------|------|
| 20x20 @2x | iPhone Notification | Icon-App-20x20@2x.png |
| 20x20 @3x | iPhone Notification | Icon-App-20x20@3x.png |
| 29x29 @2x | iPhone Settings | Icon-App-29x29@2x.png |
| 29x29 @3x | iPhone Settings | Icon-App-29x29@3x.png |
| 40x40 @2x | iPhone Spotlight | Icon-App-40x40@2x.png |
| 40x40 @3x | iPhone Spotlight | Icon-App-40x40@3x.png |
| 60x60 @2x | iPhone App | Icon-App-60x60@2x.png |
| 60x60 @3x | iPhone App | Icon-App-60x60@3x.png |
| 1024x1024 | App Store | Icon-App-1024x1024.png |

### Splash Screen

Located in `ios/App/App/Assets.xcassets/Splash.imageset/`

Capacitor handles this automatically with your configured splash screen.

---

## ⚙️ iOS-Specific Configuration

Update `capacitor.config.ts`:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wavze.app',
  appName: 'Wavze',
  webDir: 'dist/wavzedemo1',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',  // Add this
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1e40af',
      // iOS-specific
      iosSpinnerStyle: 'large',
      showSpinner: false,
      spinnerColor: '#ffffff'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1e40af',
      // iOS-specific
      iosOverlaysWebView: false
    }
  },
  ios: {
    contentInset: 'automatic',
    // Additional iOS config
  }
};

export default config;
```

---

## 🔧 iOS Build Commands

### Development Build (Simulator/Device)

```bash
# Build and run on simulator
npm run build:ios
npx cap run ios

# Or specific simulator
npx cap run ios --target="iPhone 14 Pro"
```

### Production Build (App Store)

In Xcode:

1. Select **Any iOS Device** (not simulator)
2. Menu: **Product** → **Archive**
3. Wait for archive to complete
4. **Distribute App**
5. Choose distribution method:
   - **App Store Connect** (for public release)
   - **Ad Hoc** (for testing on registered devices)
   - **Development** (for personal testing)
   - **Enterprise** (if you have enterprise account)

---

## 📱 Running on Physical iPhone

### Step 1: Trust Developer on iPhone

First time running:

1. App installs but won't open
2. On iPhone: **Settings** → **General** → **VPN & Device Management**
3. Under **Developer App**, tap your Apple ID
4. Tap **Trust "Your Name"**
5. Confirm trust
6. Now app will open

### Step 2: Enable Developer Mode (iOS 16+)

On iOS 16+:

1. **Settings** → **Privacy & Security** → **Developer Mode**
2. Toggle **On**
3. Restart iPhone
4. Confirm when prompted

---

## 🆚 iOS vs Android Differences

### Handled Automatically by Capacitor:

- ✅ Status bar styling
- ✅ Safe area insets (notch, home indicator)
- ✅ Splash screen
- ✅ App icons
- ✅ Permissions

### iOS-Specific Considerations:

1. **No Back Button**
   - Use navigation bar with back button
   - Already implemented in our mobile layout

2. **Safe Area**
   - Top notch on newer iPhones
   - Bottom home indicator
   - Capacitor handles automatically

3. **Permissions**
   - Must request before use
   - More strict than Android

4. **Review Process**
   - App Store review takes 1-3 days
   - Stricter guidelines than Google Play

---

## 🎯 Development Workflow on Mac

### Daily Development:

```bash
# 1. Make code changes
# 2. Build Angular
npm run build

# 3. Sync to iOS
npx cap sync ios

# 4. Xcode auto-reloads
# 5. Click Run in Xcode
```

### Live Reload (Optional):

```bash
# 1. Get Mac's IP address
ifconfig | grep "inet "

# 2. Update capacitor.config.ts
server: {
  url: 'http://YOUR_MAC_IP:4200',
  cleartext: true
}

# 3. Start dev server
npm start

# 4. Sync and run
npx cap sync ios
npx cap open ios
```

---

## 📝 Info.plist Configuration

Key settings in `ios/App/App/Info.plist`:

```xml
<!-- App Name -->
<key>CFBundleDisplayName</key>
<string>Wavze</string>

<!-- Bundle Identifier -->
<key>CFBundleIdentifier</key>
<string>com.wavze.app</string>

<!-- Version -->
<key>CFBundleShortVersionString</key>
<string>1.0</string>
<key>CFBundleVersion</key>
<string>1</string>

<!-- Permissions (add as needed) -->
<key>NSCameraUsageDescription</key>
<string>Wavze needs camera access to scan documents</string>

<key>NSMicrophoneUsageDescription</key>
<string>Wavze needs microphone access for calls</string>
```

---

## 🐛 Common iOS Issues

### Issue: "Unable to boot simulator"

**Solution:**
```bash
# Quit Xcode
# Reset simulator
xcrun simctl shutdown all
xcrun simctl erase all

# Restart Xcode
```

### Issue: "CocoaPods not installed"

**Solution:**
```bash
sudo gem install cocoapods
cd ios/App
pod install
```

### Issue: "No signing certificate"

**Solution:**
1. Xcode → Preferences → Accounts
2. Add Apple ID
3. Download Manual Profiles
4. In project: Select Team

### Issue: "Module not found"

**Solution:**
```bash
cd ios/App
pod install
pod update
```

### Issue: White screen on launch

**Solution:**
1. Check `capacitor.config.ts` webDir
2. Verify Angular build: `npm run build`
3. Check console in Safari Web Inspector
4. Sync again: `npx cap sync ios`

---

## 🌐 Testing iOS App

### Safari Web Inspector (Like Chrome DevTools):

On Mac:

1. **Safari** → **Preferences** → **Advanced**
2. Check **"Show Develop menu in menu bar"**
3. Connect iPhone via USB
4. On iPhone: **Settings** → **Safari** → **Advanced** → **Web Inspector** (ON)
5. In Safari: **Develop** → **[Your iPhone]** → **Wavze**
6. Inspector opens with console, network, etc.

---

## 💰 Apple Developer Account

### Free Account:
- ✅ Test on your own devices
- ✅ Run on simulator
- ❌ Cannot publish to App Store
- ❌ Apps expire after 7 days

### Paid Account ($99/year):
- ✅ Publish to App Store
- ✅ TestFlight beta testing
- ✅ Push notifications
- ✅ Advanced capabilities
- ✅ Apps don't expire

---

## 📱 App Store Submission

### Prepare for Release:

1. **Update version** in `Info.plist`
2. **Create App Store Connect listing**
3. **Prepare screenshots** (6.7", 6.5", 5.5" sizes)
4. **Write app description**
5. **Archive in Xcode**
6. **Upload to App Store Connect**
7. **Submit for review**
8. **Wait 1-3 days** for approval

### Required Assets:

- App Icon (1024x1024)
- Screenshots (multiple sizes)
- Privacy Policy URL
- Support URL
- App description
- Keywords
- Category

---

## 🔄 Update Capacitor & iOS

```bash
# Update all Capacitor packages
npm run cap:update

# Update iOS pods
cd ios/App
pod update
cd ../..

# Sync changes
npx cap sync ios
```

---

## 📊 iOS vs Android Comparison

| Feature | Android (Windows) | iOS (macOS Only) |
|---------|------------------|------------------|
| **Development OS** | ✅ Windows | ❌ Requires macOS |
| **Build Tool** | Android Studio | Xcode |
| **Emulator** | ✅ Fast | ✅ Fast |
| **Physical Device** | ✅ Any Android phone | ✅ Any iPhone |
| **App Store** | Google Play | Apple App Store |
| **Review Time** | Hours | 1-3 days |
| **Developer Fee** | $25 one-time | $99/year |
| **Code Signing** | Optional for debug | Always required |

---

## 🎯 Quick Reference

### Essential Commands:

```bash
# Add iOS platform (one-time, on Mac)
npx cap add ios

# Build and sync
npm run build:ios

# Open in Xcode
npx cap open ios

# Run on device/simulator
npx cap run ios

# Update iOS platform
npx cap update ios
```

### Xcode Shortcuts:

| Action | Shortcut |
|--------|----------|
| Build | `Cmd + B` |
| Run | `Cmd + R` |
| Stop | `Cmd + .` |
| Clean | `Cmd + Shift + K` |
| Open Quickly | `Cmd + Shift + O` |

---

## 🚀 When You're Ready

1. **Get access to a Mac** (any method above)
2. **Install Xcode** (from Mac App Store)
3. **Clone/transfer this project** to Mac
4. **Run**: `npm install`
5. **Add iOS**: `npx cap add ios`
6. **Build**: `npm run build`
7. **Sync**: `npx cap sync ios`
8. **Open**: `npx cap open ios`
9. **Click Run** ▶️ in Xcode
10. **Your iOS app is live!** 🎉

---

## 📚 Resources

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Xcode Documentation](https://developer.apple.com/xcode/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [CocoaPods](https://cocoapods.org/)

---

## 💡 Alternatives to Owning a Mac

### 1. **Cloud Mac Services** (Recommended for Windows Users)

#### MacStadium
- **Website**: macstadium.com
- **Cost**: ~$79/month
- **Pros**: Real Mac hardware, fast, reliable
- **Cons**: Monthly cost

#### MacinCloud
- **Website**: macincloud.com  
- **Cost**: ~$20/month (pay-as-you-go available)
- **Pros**: Affordable, flexible plans
- **Cons**: Slower than dedicated

### 2. **CI/CD Services**

#### App Center (Microsoft)
- Free tier available
- Build iOS without Mac
- Automatic builds from Git

#### Bitrise
- Specializes in mobile CI/CD
- iOS and Android
- Free for open source

### 3. **Rent a Mac Temporarily**

- Use for initial setup
- Return when done
- Build updates via CI/CD

---

**The project is ready for iOS!** When you have Mac access, just follow the steps above. All the mobile optimizations we made for Android will work perfectly on iOS too! 🍎✨


