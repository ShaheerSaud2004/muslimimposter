# Version check & update prompt

The app checks a remote JSON file on launch and can show "Update required" or "Update available" so users stay on a supported version.

## Where the app looks

- **URL:** `https://khafi.org/version.json` (set in `utils/versionCheck.ts` as `VERSION_CHECK_URL`).
- Host this file at that URL and update it when you release a new build.

## JSON format

Use the same shape as `public/version.json`:

```json
{
  "ios": {
    "minimumVersion": "1.1.2",
    "latestVersion": "1.1.2",
    "storeUrl": "https://apps.apple.com/us/app/khafi/id6758224320"
  },
  "android": {
    "minimumVersion": "1.1.2",
    "latestVersion": "1.1.2",
    "storeUrl": ""
  }
}
```

- **minimumVersion** – If the user’s app version is **older** than this, they see a **required** update (single "Update" button, open App Store). Use this when you need everyone to upgrade (e.g. breaking API).
- **latestVersion** – If the user’s app is older than this but ≥ minimumVersion, they see an **optional** "Update available" (Update / Later). Use for normal releases.
- **storeUrl** – Link opened when the user taps "Update" (iOS App Store or Play Store).

## How to test it

### 0. Testing before khafi.org/version.json is live

If you don’t have the file on khafi.org yet:

1. **Option A – JSON Bin:** Create a free JSON at [jsonbin.io](https://jsonbin.io), paste the version JSON, set `minimumVersion` or `latestVersion` to `"99.0.0"`, and copy the “raw” URL. In `utils/versionCheck.ts`, temporarily set `VERSION_CHECK_URL` to that URL. Run the app and use **Settings → Check for updates** (or restart).
2. **Option B – Local file:** You can’t point the app at `file://` from the device. Use Option A or host the file on khafi.org (or any HTTPS URL).

### 1. Use "Check for updates" in the app

1. Open the app → **Settings**.
2. Tap **Check for updates**.
3. If `https://khafi.org/version.json` isn’t reachable or is invalid, you’ll get "You're up to date" or "Check failed". That’s expected until the file is hosted.

### 2. Host the JSON so the app can reach it

- Upload `public/version.json` (or the same content) to **https://khafi.org/version.json** (your domain’s root or a path you control).
- Ensure the URL is **HTTPS** and returns **JSON** with the correct shape (CORS doesn’t matter for native app fetch).

### 3. Test "Update available" (optional prompt)

1. In `version.json` on the server, set **latestVersion** to something **higher** than your current app version (e.g. `"99.0.0"`).
2. Keep **minimumVersion** at your current version or lower (e.g. `"1.0.0"`).
3. In the app, tap **Settings → Check for updates** (or restart the app so the launch check runs).
4. You should see **"Update available"** with **Update** and **Later**. Tapping Update should open the App Store.

### 4. Test "Update required" (blocking prompt)

1. In `version.json`, set **minimumVersion** to something **higher** than your current app version (e.g. `"99.0.0"`).
2. Restart the app (or tap **Check for updates** in Settings).
3. You should see **"Update required"** with only an **Update** button that opens the App Store.

### 5. Test "You're up to date"

1. Set both **minimumVersion** and **latestVersion** in `version.json` to your **current** app version (e.g. `1.1.2`).
2. Tap **Check for updates** (or restart).
3. You should see **"You're up to date"**.

## When you release a new build

1. Bump the version in **app.json** (and build number for iOS).
2. After the build is live on the App Store, update **https://khafi.org/version.json**:
   - Set **minimumVersion** and **latestVersion** to the new version (e.g. `"1.1.3"`) if you want everyone to be prompted.
   - Or only bump **latestVersion** if you want an optional prompt and keep **minimumVersion** at the previous version.

## Changing the URL

To use a different URL (e.g. your own API or a CDN), edit **`utils/versionCheck.ts`** and set **`VERSION_CHECK_URL`** to your JSON URL.
