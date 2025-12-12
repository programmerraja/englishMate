
# Vocabulary Management Implementation Tasks

- [x] **Task 1: Add Notes to Lookup**
    - Modify `src/components/Lookup.jsx`:
        - Add state for `notes`.
        - Add a textarea in the result card UI.
        - Pass `notes` to `saveVocabularyItem` function.
        - Clear `notes` after saving or new search.

- [x] **Task 2: Create Library Component**
    - Create `src/components/Library.jsx`.
    - Fetch words using `getVocabulary` on mount.
    - Implement a search bar to filter the local `words` state.
    - Render a list of cards.

- [x] **Task 3: Implement Delete Functionality**
    - In `src/lib/storage.js`: Ensure `deleteVocabularyItem` is exported (it is).
    - In `Library.jsx`: Add delete button to cards.
    - Add confirmation dialog.
    - Call delete function and update state.

- [x] **Task 4: Implement Edit Functionality**
    - Create an `EditModal` or inline editing mode in `Library.jsx`.
    - Allow editing Meaning, Example, and Notes.
    - Save changes using `updateVocabularyItem`.

- [x] **Task 5: Integrate into Main App**
    - Modify `src/components/MainApp/App.jsx`.
    - Add "Library" to the navigation tabs.
    - Render `Library` component when tab is active.
