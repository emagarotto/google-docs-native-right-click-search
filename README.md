# Google Docs Native Right-Click Search

Add a native **Search Google for selection** option directly into Google Docs' custom right-click context menu—no `Shift + Right-Click` workaround required.

<img width="1400" height="560" alt="marquee_promo_tile_1400x560 (1)" src="https://github.com/user-attachments/assets/cfb0bb48-2451-44ba-bd6f-cb523a8d0160" />

## Why This Extension Exists

Google Docs renders document text on an HTML `<canvas>` element and replaces Chrome's default context menu with its own custom menu. Because of this:
1. Standard Chrome extensions cannot detect highlighted text via `selectionText`.
2. Standard right-click menu items are hidden behind Google Docs' custom menu unless you hold `Shift`.

This lightweight Manifest V3 extension solves both issues by injecting a native-looking **Search Google for selection** button directly below **Copy** in Google Docs' context menu and triggering Docs' built-in copy mechanism on `mousedown` before the menu dismisses.

---

## Features

- **Native Menu Integration:** Appears directly inside Google Docs' standard right-click menu right beneath **Copy**.
- **One-Click Search:** Captures highlighted text and immediately opens Google Search results in a new browser tab.
- **Zero External Tracking:** Runs 100% locally in your browser with no external servers, analytics, or data collection.
- **Lightweight Manifest V3:** Uses a single content script scoped strictly to `https://docs.google.com/document/*`.

---

## Installation (Developer Mode)

1. Download or clone this repository to your computer.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Toggle **Developer mode** on in the top-right corner.
4. Click **Load unpacked** and select the folder containing `manifest.json`, `content.js`, and the icon files.
5. Open any Google Doc, highlight text, right-click, and select **Search Google for selection**.
   - *Note: The first time you click the option, click **Allow** if Chrome prompts you to grant `docs.google.com` permission to read your clipboard.*

---

## Repository Contents

- `manifest.json` — Chrome Extension Manifest V3 configuration and permissions.
- `content.js` — Context menu observer, button injector, and clipboard search handler.
- `icon16.png`, `icon48.png`, `icon128.png` — Extension icons for Chrome and the Chrome Web Store.
- `PRIVACY_POLICY.md` — Standalone privacy policy document.

---

## Privacy Policy

**Effective Date:** November 18, 2026

**Google Docs Native Right-Click Search** ("the Extension") is committed to protecting your privacy.

### 1. Data Collection and Usage
- **No Data Collection:** The Extension does not collect, store, log, or transmit any personal information, browsing history, document contents, or clipboard data to any external server or third party.
- **Local Clipboard Access Only:** When you explicitly click **Search Google for selection** inside Google Docs' right-click menu, the Extension temporarily reads your clipboard locally within your browser solely to construct a `https://www.google.com/search?q=...` URL and open it in a new tab.
- **No Background Monitoring:** The Extension never reads your clipboard automatically or in the background.

### 2. Host Permissions
- The Extension runs exclusively on `https://docs.google.com/document/*` to inject the context menu button into the Google Docs interface. It cannot access any other websites or browser tabs.

### 3. Third-Party Services
- When you trigger a search, your selected query is opened directly in **Google Search** in a new tab, subject to Google's standard Privacy Policy. No intermediary servers or analytics tools are used.

### 4. Contact
If you have questions about this privacy policy or the Extension's source code, please open an issue in this GitHub repository: [emagarotto/google-docs-native-right-click-search](https://github.com/emagarotto/google-docs-native-right-click-search).
