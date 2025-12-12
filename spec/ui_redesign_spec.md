
# UI Redesign Specification: Modern "Side-OS" Interface

## 1. Design Philosophy
We are moving away from a standard "popup" aesthetic to a **persistent, immersive operating-system-like sidebar**. The design will mimic the "Leeco AI" aesthetic seen in the reference:
-   **Dark & Premium**: Deep charcoal backgrounds, glassmorphism effects, and subtle borders.
-   **Right-Aligned Navigation**: Navigation icons sit on the far right edge, separating app control from content.
-   **Chat-Centric Interaction**: The main interaction (Lookup) feels like a conversation with an AI.

## 2. Layout Architecture
The injected shadow DOM will act as a **Resizable Right Sidebar**.

### Structure
The internal layout of the sidebar will be a **Grid** with three distinct columns:

```text
[ Resizer Handle ] [      Content Area      ] [ Nav Rail ]
  ( ~5px width )      ( Flexible Width )       ( ~60px )
```

1.  **Resizer Handle (Left Edge)**:
    -   A transparent (hover-visible) drag handle.
    -   Dragging this adjusts the `--sidebar-width` CSS variable.
    -   **Constraint**: Min-width 300px, Max-width 800px.

2.  **Content Area (Center)**:
    -   This is where the active view (Lookup, Library, Practice) renders.
    -   It has a separate scrollbar if needed.
    -   **Header**: Minimal, sticky header showing the current view title (e.g., "Lookup").

3.  **Navigation Rail (Right Edge)**:
    -   Fixed width (~50-60px).
    -   Contains vertically stacked icons for the main tabs.
    -   **Active State**: The active icon gets a highlighted background/accent color.
    -   **Bottom**: Settings or User Profile icon.

## 3. Page Interaction ("Page Shift")
Instead of floating *over* the page, the sidebar will physically **squeeze** the current webpage to prevent content obscuration.

-   **Mechanism**:
    -   When Sidebar opens:
        -   Set Sidebar `right: 0`.
        -   Apply `transition: width 0.3s ease-out`.
        -   Modify Host Page: `document.body.style.width = "calc(100% - [var(--sidebar-width)])"`.
        -   Modify Host Page: `document.body.style.transition = "width 0.3s ease-out"`.
    -   When Sidebar closes:
        -   Reset Host Page width to `100%`.

## 4. Theme System (Dark Mode)
We will implement a CSS Variable based theme system.

**Palette (Proposed):**
-   `--bg-app`: `#121212` (Main background)
-   `--bg-panel`: `#1E1E1E` (Cards, Inputs)
-   `--bg-rail`: `#0A0A0A` (Nav Rail - darker)
-   `--text-primary`: `#EAEAEA`
-   `--text-secondary`: `#A0A0A0`
-   `--accent-primary`: `#8B5CF6` (Vivid Purple/Violet - similar to Leeco's chat bubbles)
-   `--border-subtle`: `#333333`

## 5. View Redesigns

### A. Lookup Tab (The "Chat" Interface)
Mimic an AI chat interface.
-   **Layout**:
    -   **Top (History)**: A scrollable area showing previously looked-up words in "bubbles" or cards.
    -   **Bottom (Input)**: A fixed input bar at the bottom.
        -   "Type or paste a word..."
        -   Send button (or Enter key).
-   **Result Display**:
    -   When a word is found, it appears as a new "message" in the stream.
    -   The "Save" button is an action on the card itself.

### B. Library Tab
A sleek list view.
-   **Search**: Sticky search bar at top (styled like a glass pill).
-   **List**: Dark cards with white text.
-   **Actions**: "Edit", "Delete" icons appear on hover (or swipe actions).

### C. Practice Tab
Focus mode.
-   **Card**: A large, centered card with specific background color (maybe deep blue/gray) to distinguish it.
-   **Buttons**: Large, thumb-friendly buttons at the bottom for "I Know" / "I Don't Know".

## 6. Migration Steps
1.  **CSS Refactor**: Create `theme.css` and define variables.
2.  **Layout Component**: Build the `SidebarLayout` component (Grid structure).
3.  **Nav Component**: Create `NavRail` on the right.
4.  **Resizer Logic**: Implement the mouse-drag logic.
5.  **Page Shifter**: Update `ContentApp.jsx` to handle body resizing.
6.  **Refactor Views**: Update `Lookup`, `Library`, `Practice` to use the new CSS variables and layout structures.
