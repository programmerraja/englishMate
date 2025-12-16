# English Mate 🇬🇧✨

Hey! This is **English Mate**, a personal project I built to help me (and hopefully you) improve English skills while browsing the web. 

I wanted a way to practice speaking, get instant feedback, and save interesting words I find online—all without constantly switching between tabs. So, I built a friendly AI companion that lives right in your browser's side panel.

## Features 🚀

Here’s what it can do right now:

*   **AI Tutor Chat**: Have a natural conversation with an AI tutor (powered by Gemini or OpenAI). It's patient, friendly, and will gently correct your grammar or vocabulary mistakes as you chat.
*   **Speech Analysis**: Practice your speaking! Record your voice, and it uses **Deepgram** to transcribe it and AI to give you structured feedback on your pronunciation, grammar, and vocabulary usage.
*   **Smart Flashcards**: Found a new word? Save it instantly. The app creates flashcards with definitions and examples, and uses a simple spaced repetition system to help you remember them. 🧠
*   **Side Panel Experience**: It works in the Chrome Side Panel, so you can keep reading an article or watching a video while you look up words or chat with the tutor.

## How to Run it Locally 💻

If you want to try it out or tweak the code:

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/programmerraja/englishMate.git
    cd englishMate
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Build the extension**:
    ```bash
    npm run build
    ```

4.  **Load into Chrome**:
    *   Open Chrome and go to `chrome://extensions/`.
    *   Turn on **Developer mode** (top right).
    *   Click **Load unpacked**.
    *   Select the `dist` folder created in step 3.

5.  **Configure Keys**:
    *   Open the extension in the side panel.
    *   Go to **Settings** and enter your API keys (Deepgram for speech, and either verify your Google Gemini or OpenAI key).

## Tech Stack 🛠️

I built this using some cool modern tools:

*   **Vite + React** for the UI (super fast!).
*   **Chrome Extension (Manifest V3)** with Side Panel API.
*   **Vercel AI SDK** to handle the LLM interactions.
*   **Deepgram** for insanely fast speech-to-text.
*   **Tailwind CSS** & **Framer Motion** for styling and smooth animations.

## Future Ideas 🔮

I'm still working on this! Here is what I want to add next:
*   Context-aware lookups (highlight text on a page to explain it).
*   Better gamification for the flashcards.
*   Voice output for the AI Tutor (so it can talk back!).

---

Feel free to fork it, break it, or suggest new features! Happy learning! 🎓
