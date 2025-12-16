# Feature Specification: AI Tutor Chat (Revised UX)

## 1. Overview
Add a dedicated "Chat" tab where users can practice English with an AI Tutor. The feature supports multiple AI providers, persistent history, and session management.

## 2. User Experience (Mobile-First / Single Column)

Since our app already lives in a confined "Sidebar" or "Side Panel" context (width ~400px - 500px), splitting strictly into two vertical columns is too cramped. We will use a **Stacked Navigation / Drawer** approach.

### 2.1 The "Main Chat" View (Default State)
This is what the user sees immediately when clicking the "Chat" tab.
*   **Header Bar:**
    *   **Left:** "Hamburger" Menu Icon or "History" Icon. (Opens the Session Drawer).
    *   **Center:** Current Session Title (e.g., "Grammar Practice").
    *   **Right:** Model Selector (Icon/Dropdown) and "New Chat" (Plus Icon).
*   **Chat Content:** Occupies the full remaining height.
*   **Input Area:** Sticky at the bottom.

### 2.2 The "Session History" Drawer/Overlay
When the user clicks the "History" icon:
*   **Behavior:** A sleek overlay slides in from the left (covering 80% of the panel) OR replaces the view temporarily.
*   **Content:**
    *   **"Start New Chat" Button** (Large, at top).
    *   **List of Reviews:** "Yesterday", "Last Week" sections.
    *   **Actions:** Tap a session to open it (closes drawer). Swipe left on a row to Delete.

### 2.3 Workflow
1.  **Entry:** User opens "Chat" tab.
    *   *Scenario A (First Time):* Shows a friendly "Start your first conversation" empty state.
    *   *Scenario B (Returning):* Immediately loads the *last active* conversation so they can pick up where they left off.
2.  **Switching Context:** User wants to check an old chat.
    *   kliks the "History" icon top-left.
    *   Selects "Phrasal Verbs (Oct 12)".
    *   Drawer closes, chat view updates.
3.  **Model Switching:** 
    *   User clicks the "Brain/Chip" icon in the header.
    *   A small popover appears: "Select Tutor Intelligence" -> [Gemini] | [GPT-4].

## 3. Data Schema (Unchanged)
Reviewing for context, but structure remains the same:
`chatSessions: [{ id, title, provider, messages: [] }]`

## 4. Technical Implementation Changes

### 4.1 Component Structure
- `src/components/Chat/ChatContainer.jsx`: Managing state (isHistoryOpen, currentSession).
- `src/components/Chat/ChatView.jsx`: The message bubble list and input.
- `src/components/Chat/HistoryDrawer.jsx`: The slide-out/overlay component for session management.
- `src/components/Chat/ModelMenu.jsx`: The popover for selection.

### 4.2 Transitions
- Use simple CSS transitions (`transform: translateX`) for the drawer to make it feel native and smooth.

---
**Why this fits:** It respects the narrow width of the sidebar context while offering the full power of history management without cluttering the active conversation space.
