# Screenshots & App Previews Guide

## Which screenshots to use where

### Website (hero + features)
Use these **with a phone border** (CSS `.phone-mockup` on the site):

| Use | Screenshot | Why |
|-----|------------|-----|
| **Hero (main)** | Main menu — khafi logo, "Get Started", "How to Play", "View stats & achievements" | First impression; clear branding and CTA. |
| **Features / How to Play** | Game setup — Collections & Categories, "Start Game" | Shows customization and categories. |
| **Features** | Word card — Player 1, "HAJJ & UMRAH", "Madinah", "Back to Deck" | Core gameplay: secret word on card. |
| **Features** | Discussion & voting — timer, "+30 sec", "Reveal When Ready" | Social mechanic and timer. |
| **Features** | Game Results — Secret Word, Imposter, "Learn about Madinah", "Watch video" | Outcome + learning feature. |

### Update section (what’s new)
Use these in the **Updates** section for v1.1.6:

- **Round Instructions** — "Starting player", "Direction", "Clue Round", "Voting", "Proceed to Timer"
- **Discussion & voting** — timer and "Reveal When Ready"
- **Game Results** — Secret Word, Imposter, "Learn about Madinah"
- **Settings** — Theme, Language, Haptic, Sound, **Create Custom Category** (good “what’s new” visual)

### App Store / Google Play previews
Use **all** of the 8 app screens (main menu, setup, round instructions, select card, word card, discussion & voting, game results, settings) in order of gameplay. Resize them to the required dimensions (see below) and add a phone frame if the store allows or your asset tool adds it.

---

## App preview dimensions (Apple)

From the App Store Connect error, **screenshots must be exactly** one of:

| Orientation | Size (px) |
|-------------|----------|
| Portrait    | **1242 × 2688** or **1284 × 2778** |
| Landscape   | **2688 × 1242** or **2778 × 1284** |

Use **1284 × 2778** (portrait) for iPhone 6.7" display (most common). Run the resize script to generate these.

---

## What’s new in this version (v1.1.6)

Use this for **App Store “What’s New”** and **Google Play “Release notes”**, and for the website Updates section.

**Short (for store character limits):**
```
• Android support — Khafī now on Google Play
• Target API 35 and smaller, faster release builds
• Create Custom Category — add your own word lists in Settings
• Theme, language, haptic feedback, and sound settings
• Bug fixes and stability improvements
```

**Full (for website):**
- **Android** — Khafī is now on Google Play. Same game, one phone, pass & play on iOS and Android.
- **Create Custom Category** — In Settings, tap “Create Custom Category” to add your own word lists (family traditions, events, or inside jokes).
- **Settings** — Theme (light/dark), language, haptic feedback, and sound toggles in one place.
- **Technical** — App now targets API level 35 and uses R8 for smaller, faster builds and better crash reporting.
- **Stability** — Bug fixes and performance improvements.

---

## Phone border

- **On the website:** Use the existing `.phone-mockup` and `.phone-frame` in `website/style.css`; wrap each screenshot in that div so it appears inside a phone frame.
- **For app store assets:** Run `node scripts/resize-app-previews.js` with the `--frame` option to generate images with a simple phone bezel, or use a design tool (Figma, Smartmockups, etc.) to add a device frame.

---

## Resize script

From the project root:

```bash
# Install dependency once
npm install --save-dev sharp

# Resize all PNGs in assets/screenshots to 1284×2778 (App Store portrait)
node scripts/resize-app-previews.js

# With phone frame
node scripts/resize-app-previews.js --frame
```

Output is written to `assets/app-previews/` (resized) and optionally `assets/app-previews-with-frame/`.
