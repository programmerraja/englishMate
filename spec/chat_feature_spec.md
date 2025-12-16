# Feature Specification: AI Tutor Chat

## 1. Overview
Add a dedicated "Chat" tab where users can practice English with an AI Tutor. The feature supports multiple AI providers (Gemini, OpenAI), persistent chat history, and session management.

## 2. User Experience (UX)

### 2.1 Layout (Split View)
To ensure "better UX" and easy access to history, the Chat Tab will have an internal 2-column layout (similar to ChatGPT/Claude):
*   **Sidebar (Left - 25% width):** "History & Sessions"
    *   **"New Chat" Button:** Prominent button at the top.
    *   **Session List:** Scrollable list of past conversations (sorted by date).
        *   Each item shows: Title (auto-generated or first few words), Date, and a "Delete" (Trash) icon.
*   **Main Chat Area (Right - 75% width):**
    *   **Header:**
        *   **Model Selector:** A sleek dropdown/popover to choose the Provider & Model (e.g., `Gemini 1.5 Pro`, `GPT-4 Turbo`). Only providers with valid API keys (from Settings) will be enabled.
    *   **Message List:** Scrollable area showing message bubbles.
        *   **User:** Aligned right, distinct color.
        *   **AI Tutor:** Aligned left, glass-panel style.
    *   **Input Area:** Text input field with a "Send" button.

### 2.2 Workflow
1.  **Starting:** User clicks the "Chat" tab. The last active conversation loads automatically, or a "New Chat" screen appears.
2.  **Model Switching:** User can verify or change the active model via the header dropdown before sending a message.
3.  **Conversation:**
    *   User types a message.
    *   **Tutor Persona:** The AI responds as a patient English teacher, offering corrections if the user makes mistakes, but keeping the flow natural.
4.  **History:** The chat is auto-saved to `localStorage` (or `chrome.storage`) after every message.
5.  **Management:** User can switch between past chats via the sidebar or delete old ones to cleanup.

## 3. Data Schema
We will create a new top-level key `chatSessions` in the storage.

```json
{
  "chatSessions": [
    {
      "id": "uuid-1234",
      "title": "Practice: Past Tense", 
      "createdAt": "2023-11-20T10:00:00Z",
      "updatedAt": "2023-11-20T10:05:00Z",
      "provider": "gemini", // Last used provider
      "messages": [
        { "id": "m1", "role": "user", "content": "I goed to the store." },
        { "id": "m2", "role": "assistant", "content": "I went to the store. (Correction)" }
      ]
    }
  ]
}
```

## 4. Technical Implementation

### 4.1 AI Service Update
- Enhance `src/lib/ai-service.js` to expose a `streamChat` or `chat` function that accepts `messages` history, not just a single prompt.
- **System Prompt:** We will inject a hidden system instruction:
  > "You are EnglishMate, a friendly and professional English Tutor. Your goal is to converse with the user to help them practice. If the user makes a grammar or vocabulary mistake, gently correct them at the end of your response or in a natural way. Keep responses concise and encouraging."

### 4.2 Component Structure
- `src/components/Chat/ChatLayout.jsx`: Main container handling the split view.
- `src/components/Chat/ChatSidebar.jsx`: List of sessions.
- `src/components/Chat/ChatWindow.jsx`: Message rendering and Input.
- `src/components/Chat/ModelSelector.jsx`: Dropdown component.

### 4.3 State Management
- We will manage the `currentSessionId` state.
- If `currentSessionId` is `null`, we show a "Start a new conversation" empty state.
- When the first message is sent in a new session, we create the `session` entry in storage.

## 5. Dependencies
- Reuse existing `lucide-react` for icons (MessageSquare, Plus, Trash2, ChevronDown).
- Reuse `ai` SDK for handling message streaming if applicable, or standard fetch for simplicity in V1.

---
**Does this plan meet your requirement for a "Better UX" and "Tutor Persona"?**
