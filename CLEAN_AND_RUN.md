# Clean build and run (so simulator matches your local code)

If the simulator shows an "old" version but you submitted this same code, the app is usually **cached** (Metro JS bundle or the installed app). Do this:

## Option A: Fresh run with cleared Metro cache (recommended)

1. **Stop the current run** – In the terminal where `npx expo run:ios` is running, press **Ctrl+C**.

2. **Clear caches and remove app from simulator:**
   ```bash
   rm -rf node_modules/.cache .expo
   xcrun simctl uninstall booted com.khafi.app
   ```

3. **Run with a fresh Metro bundle** (Metro starts with `--clear`, app uses that bundle):
   ```bash
   npm run ios:fresh
   ```
   When the app has opened, you can stop the Metro process in the background (Ctrl+C in that terminal, or find and kill the `expo start` process).

## Option B: Two terminals (same effect)

1. **Terminal 1** – Start Metro with cache cleared:
   ```bash
   npx expo start --clear
   ```
   Leave this running.

2. **Terminal 2** – Build and run the app (it will use the Metro from Terminal 1):
   ```bash
   npx expo run:ios --no-bundler
   ```

## Option C: Nuclear clean (if it still looks old)

```bash
rm -rf ios/build node_modules/.cache .expo
xcrun simctl uninstall booted com.khafi.app
npx expo run:ios
```
Then in another terminal run `npx expo start --clear` and press **r** to reload the app, or use Option B next time.

After this, the simulator should run the same code you have on disk (the one you submitted).
