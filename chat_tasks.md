# Chat Feature Tasks

## Phase 1: Storage & Service Logic
- [x] Update `src/lib/storage.js`: Add `getChatSessions`, `createChatSession`, `updateChatSession`, `deleteChatSession`.
- [x] Update `src/lib/ai-service.js`: Add `streamChat` function handling multiple providers.

## Phase 2: Components
- [x] Create `Chat/ChatContainer.jsx`: Main state manager (current session, drawer open/close).
- [x] Create `Chat/ChatView.jsx`: Message list rendering and Input area.
- [x] Create `Chat/HistoryDrawer.jsx`: Slide-out list of sessions.
- [x] Create `Chat/ModelMenu.jsx`: Menu for picking Gemini/OpenAI.
- [x] Create `Chat/Chat.css`: Styling for bubbles, drawer animations.

## Phase 3: Integration
- [x] Update `SidebarLayout` navigation to include the new Chat tab.
- [x] Update `App.jsx` to render the Chat component.
- [x] Verify persistence and "Teacher Persona" prompt injection.
