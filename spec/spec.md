
# Project Specification: EnglishMate

## Current State
Currently, we have a UI with two main tabs:
1.  **Lookup**: Users can input a word, get the meaning/example, and save it.
2.  **Practice**: Users can practice the words they have saved.

## Requirements & Goals
We need a robust data structure to support long-term learning and better organization.
-   **Unified Storage**: A structured way to save both vocabulary and full sentences.
-   **Rich Metadata**: Support for tracking learning progress (spaced repetition), source context, and tags.

## Proposed Data Structure

We will store data in the following JSON structure:

```json
{
  "vocabulary": [
    {
      "id": "uuid-string",             // Unique identifier for safe updates/deletes
      "word": "Serendipity",           // The target word
      "meaning": "The occurrence of events by chance in a happy way.",
      "example": "It was pure serendipity that we met.",
      "notes": "Found this in a Medium article.", 
      "tags": ["advanced", "noun"],    // For filtering (e.g., #slang, #business)
      "stats": {                       // Spaced Repetition (SRS) data
        "practicedAt": "2023-10-27T10:00:00Z", // Last review time
        "nextReviewDate": "2023-10-28T10:00:00Z", // When to review next
        "confidenceLevel": 1           // 1-5 rating of how well it's known
      }
    }
  ],
  "sentences": [
    {
      "id": "uuid-string",
      "content": "The quick brown fox jumps over the lazy dog.",
      "highlightedWord": "fox",        // Optional: link to a vocabulary word
      "notes": "Good example of using all letters.",
      "stats": {
        "practicedAt": "2023-10-27T10:00:00Z",
        "nextReviewDate": "2023-10-28T10:00:00Z",
        "confidenceLevel": 1
      }
    }
  ]
}
```

## Key Improvements
1.  **Unique IDs**: Essential for editing or deleting specific items without errors.
2.  **Corrected Terminology**: changed `particeAt` to `practicedAt`.
3.  **Stats Object**: Grouping learning metrics (dates, confidence) keeps the root object clean.
4.  **Source & Tags**: Added fields for `sourceUrl` and `tags` to provide context and better organization.

## Feature Specification: Vocabulary Management & Notes

### 1. Add Notes during Lookup
**Objective**: Allow users to add personal context (mnemonics, source URL, thoughts) when saving a word.

**UI Changes**:
-   **Lookup Component**:
    -   Add a `textarea` labeled "Add Notes (Optional)" below the definition/example in the result card.
    -   Bind this input to a `notes` state variable.
    -   Pass the `notes` value to `saveVocabularyItem` when "Save Word" is clicked.

### 2. Vocabulary List (Management)
**Objective**: Create a dedicated view for users to browse, edit, and manage their saved collection.

**UI Changes**:
-   **New Tab**: Add a "Library" or "My List" tab to the main navigation (between Lookup and Practice).
-   **Library Component**:
    -   **Search Bar**: top of the list to filter by word or meaning.
    -   **List View**: Scrollable list of cards. Each card displays:
        -   Word (Heading)
        -   Part of Speech (Badge)
        -   Meaning (Truncated if long)
        -   Actions Row: [🔊 Listen] [✏️ Edit] [🗑️ Delete]

### 3. Edit & Delete Functionality
**Objective**: Full CRUD capabilities for vocabulary.

**Logic**:
-   **Delete**:
    -   Clicking "Delete" prompts for confirmation (simple `confirm()` or custom modal).
    -   Calls `deleteVocabularyItem(id)` from storage.
    -   Refreshes the list.
-   **Edit**:
    -   Clicking "Edit" switches the card (or opens a modal) to "Edit Mode".
    -   Fields available to edit: `Word` (maybe lock this?), `Meaning`, `Example`, `Notes`.
    -   "Save" button commits changes via `updateVocabularyItem(id, data)`.
    -   "Cancel" reverts to view mode.

## Roadmap / Future Features
-   **Context Menu Integration**: Select text on any webpage, right-click, and "Add to EnglishMate" to instantly save words or content without opening the extension.
-   **Activity Heatmap**: A dashboard visualization (like GitHub contributions) showing daily learning streaks to improved motivation.
-   **Smart Quizzes**: Auto-generate multiple-choice questions based on saved definitions and examples (e.g., "Which word fits this definition?").
-   **Data Export/Import**: Allow users to export their database to JSON/CSV for backup or use in external flashcard tools like Anki.