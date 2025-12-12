
# UI Redesign Tasks

- [x] **Task 1: Theme & Styles Infrastructure**
    - Create `src/styles/theme.css` with CSS variables for the dark theme.
    - Create `src/styles/layout.css` for the 3-column grid structure.
    - Update `src/content/ContentApp.jsx` and `index.jsx` to inject these new styles.

- [x] **Task 2: Layout Components**
    - Create `src/components/Layout/NavRail.jsx`: Right-aligned navigation bar.
    - Create `src/components/Layout/SidebarLayout.jsx`: Main container handling the grid.
    - Implement the "Page Shift" logic (resizing `document.body`) in `ContentApp.jsx` or a hook.

- [x] **Task 3: Resizable Logic**
    - Implement drag handle logic in `SidebarLayout`.
    - Persist width preference in storage (optional but good).

- [x] **Task 4: Refactor Lookup View**
    - Move Input bar to the bottom (Chat style).
    - Style results as "Chat Bubbles" or cards in the scrollable area.
    - Update CSS to use `var(--bg-panel)`, etc.

- [x] **Task 5: Refactor Library View**
    - Update styling to match the dark theme.
    - Ensure it fits within the "Content Area" of the grid.

- [x] **Task 6: Refactor Practice View**
    - Update styling for focus mode.

- [x] **Task 7: Cleanup**
    - Remove old navbar from `App.jsx` (Optional, as App.jsx is legacy/popup).
    - Remove unused CSS.
