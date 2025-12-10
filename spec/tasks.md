# 📋 Development Tasks: English Mate

## 🟢 Phase 1: Core Logic & Popup UI (Current Focus)

### 1.1. Dictionary API Integration
- [ ] Create `src/lib/api.js`
- [ ] Implement `fetchDefinition(word)` using `dictionaryapi.dev`
- [ ] Handle errors (word not found, network error)

### 1.2. Popup UI - Structure & Navigation
- [ ] Create Tab System (Lookup / Flashcards) in `App.jsx`
- [ ] Create `LookupView` component
- [ ] Create `FlashcardView` component

### 1.3. Popup UI - Lookup Feature
- [ ] Implement Search Bar & Button
- [ ] Display Word Definition (Meaning, Example, Part of Speech)
- [ ] Add "Save Word" button (Visual only for now)
- [ ] Add Loading & Error states

### 1.4. Storage Logic
- [ ] Create `src/lib/storage.js`
- [ ] Implement `saveWord(wordData)`
- [ ] Implement `getSavedWords()`
- [ ] Connect "Save" button to Storage

## 🟡 Phase 2: Flashcards
- [ ] Fetch saved words in `FlashcardView`
- [ ] Implement "Show Meaning" toggle
- [ ] Implement "I Know / I Don't Know" logic (Simple loop)
- [ ] Empty state (No words saved)

## 🔵 Phase 3: Content Script (Context Menu & Tooltip)
- [ ] Implement `src/content/Tooltip.jsx` (Floating icon on selection)
- [ ] Implement `src/content/Modal.jsx` (The actual popup in the page)
- [ ] Connect Background Script context menu to open the Modal
- [ ] Ensure styles are isolated (Shadow DOM)

## 🟣 Phase 4: Polish & Release
- [ ] Add Animations (Framer Motion or CSS)
- [ ] Improve Error Handling
- [ ] Export/Import Feature
- [ ] Final Build & Test
