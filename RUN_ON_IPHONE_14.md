# Run the app on iPhone simulator (14, 17 Pro, etc.)

## Option 1: Expo Go (recommended)

1. **Open the simulator you want**  
   - **Simulator** menu → **File** → **Open Simulator** → pick your iOS version → **iPhone 14** or **iPhone 17 Pro** (or any device).

2. **Start Expo** (in project folder):
   ```bash
   npx expo start --port 8082
   ```

3. **Install/open on the simulator**  
   - In the Expo terminal, press **Shift + I**.  
   - Choose your device (e.g. **iPhone 17 Pro**) from the list.  
   - Expo will install Expo Go on that simulator if needed, then open your app.

4. If Expo Go was never installed on that simulator, the first **Shift + I** may take a minute to install Expo Go, then the app will open.

---

## Option 2: Native build (no Expo Go)

**iPhone 17 Pro:**
```bash
LANG=en_US.UTF-8 npx expo run:ios -d "iPhone 17 Pro"
```

**iPhone 14:**
```bash
LANG=en_US.UTF-8 npx expo run:ios -d "iPhone 14"
```

If it fails, open the project in Xcode to see the real error:

```bash
open ios/Khaf.xcworkspace
```

Then in Xcode: pick your device (e.g. **iPhone 17 Pro**) as the run destination and press **Run** (⌘R).
