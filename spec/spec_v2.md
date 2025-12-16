# EnglishMate V2 Specification

## 1. Overview
This document outlines the roadmap for EnglishMate V2, focusing on enhanced vocabulary management, a new personalized dashboard, an AI-powered speaking practice coach, and robust user settings.

## 2. New Features Breakdown

### 2.1. Manual Vocabulary Entry
**Goal:** Allow users to manually input vocabulary items instead of relying solely on the "lookup" feature.
- **UI:** A simple form in the "Library" or "Home" tab.
- **Fields:**
  - Word (Required)
  - Meaning (Required)
  - Example Sentence (Optional)
  - Personal Notes (Optional)
  - Tags (Optional)

### 2.2. User Dashboard
**Goal:** Provide a central hub for users to track progress and stay motivated.
- **Key Metrics:**
  - **Total Vocabulary:** Simple counter of saved words.
  - **Daily Streak:** Visual counter of consecutive days with at least one practice session.
- **Visualizations:**
  - **Learning Velocity Graph:** A line chart showing the number of words added/learned over the last 30 days.
  - **Decay Highlights:** A list or visual indicator of identifying words that haven't been reviewed in a long time (based on `nextReviewDate`).
- **"Daily Mix" Playlist:**
  - A simple "Start Practice" button that auto-generates a session containing:
    - 5 "Decaying" words to review.
    - 1 Speaking Topic based on recent vocabulary.

### 2.3. AI Speaking Coach (Practice Tab)
**Goal:** Allow users to practice speaking and receive structural feedback.
- **Flow:**
  1.  **Topic Generation:** The app presents a random conversational topic (or one related to the user's specific vocabulary).
  2.  **Recording:**
      - User clicks "Start Recording".
      - **Visualizer:** A real-time audio waveform validates the microphone input.
  3.  **Processing (AI Integration):**
      - **Transcription:** Audio is sent to Deepgram (or similar) to convert speech to text.
      - **Analysis:** Transcript is sent to an LLM (Gemini/OpenAI) for feedback.
  4.  **Results (Structured Feedback):**
      - **Transcript:** Display what the user said.
      - **Grammar Check:** Specific corrections on sentence structure.
      - **Pronunciation Notes:** Highlight words that were likely mispronounced (based on confidence scores or AI heuristics).
      - **Vocabulary Suggestions:** Suggest better or more precise synonyms for words used.

### 2.4. Settings & Data Management
**Goal:** Give users control over their data and external services.
- **API Key Management:**
  - Secure input fields for users to provide their own keys:
    - **Deepgram API Key** (for Transcription).
    - **Gemini / OpenAI API Key** (for AI Feedback).
  - Keys should be stored in `localStorage` (or encrypted browser storage) and never sent to a backend server.
- **Data Portability:**
  - **Export:** Download all vocabulary/sentences as a JSON file.
  - **Import:** Upload a JSON file to restore or merge data.

## 3. Technical Implementation Plan

### 3.1. Tech Stack Changes
- **Framework:** Continue using Vite + React.
- **New Libraries:**
  - `chart.js` or `recharts`: For the Learning Velocity Graph.
  - `react-audio-voice-recorder` (or native MediaRecorder API): For handling audio capture.
  - `framer-motion`: For simple animations (optional, for the "Daily Mix" and visualizer).
  - `axios` or standard `fetch`: For making API calls to Deepgram/LLMs.

### 3.2. Data Structure Updates (`localStorage` Schema)
We need to update our existing JSON structure to support these new features.

```json
{
  "userSettings": {
    "apiKeys": {
      "deepgram": "...",
      "gemini": "...",
      "openai": "..."
    },
    "dailyGoal": 5 // Learning goal (words per day)
  },
  "stats": {
    "streak": 12,
    "lastPracticeDate": "2023-11-01",
    "wordsLearnedHistory": {
      "2023-10-30": 2,
      "2023-10-31": 5
    }
  },
  "vocabulary": [
    {
      "id": "uuid-1",
      "word": "Serendipity",
      "meaning": "...",
      "example": "...",
      "notes": "...",
      "srs": {
        "nextReview": "2023-11-05T10:00:00Z",
        "interval": 3 // Days until next review
      }
    }
    // ...
  ]
}
```

### 3.3. Implementation Steps
1.  **Refactor Storage:** Create a robust service to handle the new `userSettings` and `stats` fields in `localStorage`.
2.  **Build Settings Page:** Create the UI for API key input and Import/Export buttons.
3.  **Build Dashboard:**
    - Implement the logic to calculate streaks.
    - Integrate the Chart library for the velocity graph.
4.  **Build Speaking Practice:**
    - Implement the `MediaRecorder` hook.
    - Create the API handler service that takes the audio/text and calls the user's provided keys.
5.  **Build Manual Entry:** Add the simple form to the core UI.

## 4. Dependencies to Install
- `chart.js`
- `react-chartjs-2`
- `lucide-react` (if not already present, for icons)
- `clsx`, `tailwind-merge` (for cleaner styling if we use Tailwind utilities)
