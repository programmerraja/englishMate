
# Implementation Tasks

- [x] **Task 1: Refactor Storage Layer**
    - Update `src/lib/storage.js` to initialize and manage the new data structure (`{ vocabulary: [], sentences: [] }`).
    - Implement a migration function to convert existing `savedWords` to the new `vocabulary` format with IDs and default stats.
    - Add utility functions: `getVocabulary`, `saveVocabularyItem`, `updateVocabularyItem` (for stats), `getSentences`, `saveSentence`.
    - Ensure backward compatibility or clear migration path.

- [x] **Task 2: Update Lookup Component**
    - Modify `src/components/Lookup.jsx` to construct the full vocabulary object (with `id` using `crypto.randomUUID()`, `stats`, `tags`, etc.) before saving.
    - Use the new `saveVocabularyItem` function.

- [x] **Task 3: Update Flashcards Component**
    - Modify `src/components/Flashcards.jsx` to use `getVocabulary`.
    - Implement the logic for "I Know" (Confidence +1, set next review date) and "I Don't Know" (Reset confidence).
    - Use `updateVocabularyItem` to save progress.

- [x] **Task 4: Implement Context Menu "Add to EnglishMate"**
    - **Background Script**:
        - Update `src/background/main.js` to create "Add to EnglishMate" context menu.
        - Import `fetchDefinition` and `saveVocabularyItem`.
        - Implement handler to fetch and save word silently.
        - Send success/error messages to content script.
    - **Content Script**:
        - Create a `Toast` component/logic in `ContentApp.jsx`.
        - Listen for `word_saved` and `save_error` messages.
        - Display a non-intrusive notification.
