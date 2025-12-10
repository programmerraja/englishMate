
# 📌 **PRODUCT REQUIREMENTS DOCUMENT (PRD)**

**Product Name:** QuickVocab (working title)
**Type:** Chrome Extension (Popup + Context Menu)
**MVP Duration:** 24 hours
**Storage:** Local only (IndexedDB / localStorage)
**AI:** Allowed; ideally free API or fallback dictionary API
**Screens:** 2 screens
**Practice:** Minimal flashcard loop

---

# 1. **Vision Statement**

A lightweight Chrome extension that lets users instantly look up words, save them, and practice them through simple flashcards—focused on speed, minimal UI, and no backend.

---

# 2. **Primary User Value**

The user can:

1. Highlight any word
2. Get meaning + example instantly
3. Save it to a local list
4. Practice saved words through flashcards
5. Export/import vocabulary for backup

This validates the core value proposition: **“fast capture → review → retention.”**

---

# 3. **Core User Journey (Unified for MVP)**

### **(A) Capture → Meaning → Save**

Users find a new word on a website and want meaning + examples + save it.

### **(B) Manual Input**

Users type a word inside popup to look it up and save it.

### **(C) Practice**

Users open Flashcard mode to practice saved words.

### **(D) Learn via Mini Explanation**

AI/dictionary generates meaning + example + part of speech.

---

# 4. **MVP Feature Scope (Strict)**

## ✅ **IN SCOPE (Essential Only)**

### **1. Word Lookup**

* Input: selected word OR manually typed
* Output:

  * meaning
  * example sentence
  * part of speech

### **2. AI/Dictionary Integration**

* If AI is available → call AI
* If not → use free dictionary API (e.g., dictionaryapi.dev)

### **3. Save Word Locally**

Store fields:

* word
* meaning
* example
* POS
* timestamp

### **4. Flashcard Practice**

Minimal loop:

1. Show word
2. Tap “show meaning”
3. Tap “I know / I don’t know”
4. Move to next word

### **5. Export/Import**

* Export saved words as JSON
* Import JSON to restore words
  (local-only, no backend)

### **6. Chrome-Specific Trigger Options**

MVP supports all three but merges them cleanly:

**A) Right-click → “Look up word”**
**B) Popup search bar**
**C) Auto-popup for selected text (tiny tooltip)**

Keep the auto-popup minimal to avoid UI complexity.

### **7. Two-Screen Layout**

Screen 1: **Lookup + Save**
Screen 2: **Saved Words + Flashcards**

Navigation is simply two tabs at the top.

---

# 5. **OUT OF SCOPE (Removed for MVP)**

(Removing to fit 24 hours)

* No user accounts
* No sync
* No settings page
* No customization
* No dark/light theming
* No progress analytics
* No spaced repetition algorithm (simple next card only)
* No AI chat interface
* No multi-language support
* No offline dictionary
* No animations
* No advanced UI flows

---

# 6. **User Flows (Step-by-Step)**

## **Flow 1: Look Up Word via Right-Click**

1. User highlights a word
2. Right-click → “Look up word”
3. Extension popup opens
4. Meaning + example appear
5. User taps “Save”
6. Word stored locally

---

## **Flow 2: Look Up Word via Popup Search**

1. User clicks extension icon
2. Popup shows search bar
3. User types a word
4. Meaning + example appear
5. User taps “Save”

---

## **Flow 3: Auto-Popup on Selection**

1. User highlights text
2. Small tooltip appears with “Look up”
3. Clicking it opens popup with meaning

---

## **Flow 4: Practice Using Flashcards**

1. User clicks “Practice” tab
2. Flashcard shows a word
3. User clicks “Show meaning”
4. Meaning appears
5. User taps “I know / I don’t know”
6. Next card loads

---

## **Flow 5: Export / Import**

**Export:**

* Button → downloads words.json

**Import:**

* User uploads JSON
* Words merge into local storage

---

# 7. **UI Wireframe (Text-Based)**

### **🔹 Screen 1: Lookup**

```
------------------------------------
|   [ Search bar ]  [Search Btn]   |
------------------------------------
| Word: ____                       |
| Meaning: ____                    |
| Example: ____                    |
| POS: ____                        |
------------------------------------
[ Save Button ]
------------------------------------
[ Tab: Lookup | Tab: Flashcards ]
```

### **🔹 Screen 2: Flashcards**

```
------------------------------------
| Flashcard Mode                  |
------------------------------------
| WORD                            |
| [Show Meaning]                  |
------------------------------------
| MEANING (revealed on tap)       |
------------------------------------
[ I Know ]    [ I Don’t Know ] 
------------------------------------
[ Tab: Lookup | Tab: Flashcards ]
```

---

# 8. **Technical Scope**

## **Chrome Extension Structure**

```
/manifest.json
/popup.html
/popup.js
/styles.css
/background.js
/content.js
/storage.js
/api.js
/flashcards.js
```

### **Manifest Requirements**

* “contextMenus” permission
* “activeTab” permission
* “storage” permission
* content script injected on all pages

---

# 9. **Data Model**

```json
{
  "word": "example",
  "meaning": "a thing illustrating something",
  "example": "This is an example sentence",
  "pos": "noun",
  "dateAdded": 1733819261
}
```

Stored as an array in localStorage/IndexedDB.

---

# 10. **AI / Dictionary Logic**

Pseudocode:

```
try {
    response = callAI(word)
} catch {
    response = callDictionaryAPI(word)
}
```

Dictionary fallback ensures the MVP always works.

---

# 11. **Success Criteria (24-hour MVP)**

The MVP is successful if users can:

1. Look up any word from any webpage
2. Save it locally
3. View it in a list
4. Practice through flashcards
5. Export and import saved words

Everything else is unnecessary.

---

# 12. **What I Need From You to Proceed (Optional)**

If you want, I can also generate:

* bolt.new code scaffold
* full UI components (React/Tailwind)
* chrome manifest.json
* lookup API code
* flashcard logic

Just tell me:

**“Generate the full build-ready scaffolding.”**
