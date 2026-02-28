# Forcing users to update the app

When you release a new version and want **everyone** to update (e.g. to fix a bug or avoid old UI), you can force an update so the app cannot be used until they install the new version.

## How it works

- The app fetches `https://khafi.org/version.json` on launch and when the app comes back to the foreground.
- If the app’s version is **below** `minimumVersion` in that file, a full-screen “Update required” block is shown. The user can only tap “Update” to open the store; they cannot use the app.
- The request is cache-busted so devices get the latest `minimumVersion` (no stale cached config).

## How to force an update

1. **Release the new build** to the App Store (and Play Store if you use it). Note the **exact** version string (e.g. `1.1.7`).

2. **Set `minimumVersion` to that version** in your version config:
   - In this repo: edit `public/version.json`.
   - On your server: update the same file at **https://khafi.org/version.json** (or wherever `VERSION_CHECK_URL` points).

   Example for version `1.1.7`:

   ```json
   {
     "ios": {
       "minimumVersion": "1.1.7",
       "latestVersion": "1.1.7",
       "storeUrl": "https://apps.apple.com/us/app/khafi/id6758224320"
     },
     "android": {
       "minimumVersion": "1.1.7",
       "latestVersion": "1.1.7",
       "storeUrl": "https://play.google.com/store/apps/details?id=com.khafi.app"
     }
   }
   ```

3. **Deploy** the updated `version.json` to khafi.org so the live URL returns the new `minimumVersion`.

4. **Result:** Any user still on an older version will see the blocking “Update required” screen on next launch (and each time they open the app until they update). The check runs again when they return from the store, so after they update they can use the app normally.

## Optional vs required

- **`minimumVersion`** – If the app version is **below** this, the app shows the **blocking** “Update required” screen (forced update).
- **`latestVersion`** – If the app version is below this but **at or above** `minimumVersion`, the app shows an **optional** “Update available” alert (user can choose “Later” or “Update”).

To force everyone to move to the newest build, set both `minimumVersion` and `latestVersion` to the current store version (e.g. `1.1.7`).

---

## Testing the blocking screen

1. **Unit tests**  
   Run: `npm test -- --testPathPattern=versionCheck`  
   This checks that:
   - The block only appears when the app version is **strictly below** `minimumVersion`.
   - On fetch failure, bad response, or missing config the app stays **up-to-date** (no false “update required”).

2. **Simulate on device/simulator (dev only)**  
   - Open the app in development (`npx expo start` then run on iOS/Android).
   - Go to **Settings**.
   - Tap the **“First version” / version area** 5 times quickly to open the **Debug** menu.
   - Tap **“Simulate update required”**.
   - The blocking “Update required” screen should appear (you can’t use the app).
   - In dev, a **“Dismiss (debug)”** button is shown so you can close the block and continue.
   - Confirm the **Update** button would open the store (or dismiss and use the app again).
