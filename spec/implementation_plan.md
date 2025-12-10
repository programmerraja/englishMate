# 🛠️ Implementation Plan: English Mate (QuickVocab)

## 1. Overview
This document outlines the technical plan to build the **English Mate** Chrome Extension using **Vite** and **React**. The goal is to meet the MVP requirements defined in `spec.md` while addressing technical constraints like the Context Menu limitation.

## 2. Technology Stack
- **Build Tool:** Vite (Fast, supports multi-entry builds)
- **Framework:** React (for Popup UI)
- **Styling:** Vanilla CSS / CSS Modules (Lightweight, full control)
- **State/Storage:** `chrome.storage.local` (Async, persistent across browser sessions)
- **Manifest Version:** V3

## 3. Architecture & Components

### A. The Popup (`src/popup`)
*   **Trigger:** User clicks the extension icon in the toolbar.
*   **Functionality:**
    *   **Tab 1: Lookup:** Search bar, Word details (Meaning, Example, POS), Save button.
    *   **Tab 2: Flashcards:** List of saved words, Flashcard practice mode.
*   **Tech:** React App.

### B. The Content Script (`src/content`)
*   **Trigger:** Injected into every webpage.
*   **Functionality:**
    *   **Text Selection:** Detects when a user highlights text -> Shows a "Tiny Tooltip" icon.
    *   **Tooltip Action:** Clicking the tooltip opens an **Injected Modal** with the word definition and a "Save" button.
    *   **Context Menu Handler:** Listens for messages from the Background script (when user right-clicks "Look up word") -> Opens the same **Injected Modal**.
*   **Tech:** Vanilla JS + Preact (or lightweight React mount) to render the Tooltip/Modal to avoid heavy DOM impact. *Decision: We will use a lightweight React root inside a Shadow DOM to isolate styles.*

### C. The Background Script (`src/background`)
*   **Trigger:** Runs in the background (Service Worker).
*   **Functionality:**
    *   Initializes the Context Menu item ("Look up word").
    *   Handles the click event and sends a message to the active tab's Content Script to open the Modal.

## 4. File Structure (Proposed)

```
englishMate/
├── manifest.json
├── vite.config.js
├── package.json
├── public/
│   └── icons/
├── src/
│   ├── assets/
│   ├── components/       # Reusable UI (Buttons, Cards)
│   ├── lib/
│   │   ├── storage.js    # Helpers for chrome.storage
│   │   ├── api.js        # Dictionary API logic
│   │   └── utils.js
│   ├── popup/            # Main Extension Popup
│   │   ├── index.html
│   │   ├── main.jsx
│   │   └── App.jsx
│   ├── content/          # Content Scripts
│   │   ├── index.jsx     # Entry point
│   │   ├── Tooltip.jsx   # The tiny button
│   │   └── Modal.jsx     # The lookup result window
│   └── background/       # Service Worker
│       └── main.js
└── spec/
```

## 5. Migration Steps (Vite)

1.  **Cleanup:** Remove `react-scripts` and old CRA structure.
2.  **Install:** Install `vite`, `@vitejs/plugin-react`, and necessary dev dependencies.
3.  **Configure:** Setup `vite.config.js` to output three separate bundles:
    *   `popup.html` (and its JS)
    *   `content.js`
    *   `background.js`
4.  **Manifest Update:** Rewrite `manifest.json` to point to the new Vite build outputs.

## 6. Development Phases

1.  **Phase 1: Skeleton & Build:** Get the extension loading in Chrome with a "Hello World" Popup, Content Script, and Background worker.
2.  **Phase 2: Core Logic (Lib):** Implement `api.js` (Dictionary API) and `storage.js` (Save/Load words).
3.  **Phase 3: Popup UI:** Build the Lookup and Flashcard tabs.
4.  **Phase 4: Content Interactions:** Implement the Text Selection Tooltip and Context Menu Modal.
5.  **Phase 5: Polish:** CSS styling and UX refinements.
