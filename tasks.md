# Implementation Tasks - EnglishMate V2

## Phase 1: Foundation & Dependencies
- [x] Install dependencies: `chart.js`, `react-chartjs-2`, `lucide-react`, `clsx`, `tailwind-merge`, `framer-motion`
- [x] Install AI SDK: `ai`, `@ai-sdk/google`, `@ai-sdk/openai`
- [x] Review and update `src/styles/theme.css` and `src/index.css` (if exists) for comprehensive design tokens (colors, typing, glassmorphism).
- [x] Create `src/lib/storage.js` (or update existing) to handle `userSettings` (API keys) and new `stats` schema.
- [x] Create `src/lib/ai-service.js` using Vercel AI SDK.

## Phase 2: Settings & Data Management
- [x] Create `src/components/Settings/Settings.jsx`.
- [x] Implement API Key input forms with secure storage in localStorage.
- [x] Implement specific Export/Import JSON functionality.

## Phase 3: Manual Entry & Library Updates
- [x] Update `src/components/Library.jsx` to include "Add Word" button.
- [x] Create `src/components/AddWordModal.jsx` (or inline form) with fields: Word, Meaning, Example, Notes.
- [x] Ensure added words are saved correctly to the `vocabulary` array with new ID structure.

## Phase 4: Dashboard
- [x] Create `src/components/Dashboard/Dashboard.jsx`.
- [x] Implement "Total Vocabulary" and "Daily Streak" cards.
- [x] Implement `LearningVelocityChart` using `react-chartjs-2`.
- [x] Implement "Decay" logic to show words needing review.
- [x] Implement "Daily Mix" button logic.

## Phase 5: AI Speaking Coach (Practice Tab)
- [x] Create `src/components/Practice/Practice.jsx` (replacing or upgrading existing Flashcards/Practice).
- [x] Implement `AudioRecorder` component with visualizer.
- [x] Implement "Topic Generator" (random or vocab-based).
- [x] Implement "Processing" state (calling Deepgram then Gemini).
- [x] Display "Structured Feedback" (Transcript, Grammar, Pronunciation).

## Phase 6: Navigation & Polish
- [x] Update Main Navigation to include: Dashboard, Library, Practice, Settings.
- [x] Review overall UX/UI for "Premium" feel (animations, gradients).
- [x] Verify SEO/Meta tags (even for extension/SPA).
