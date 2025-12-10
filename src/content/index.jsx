import React from 'react';
import ReactDOM from 'react-dom/client';
import ContentApp, { injectedStyles } from './ContentApp';
import styles from './content.css?inline';

console.log('English Mate Content Script Loading...');

// 1. Setup Message Listener IMMEDIATELY (Before React Mounts)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Global Message Listener received:", request);

    if (request.action === "toggle_sidebar") {
        // Dispatch a custom event for React to handle
        window.dispatchEvent(new CustomEvent('english-mate-toggle'));
    }

    // We must return true if we want to sendResponse asynchronously, 
    // but we aren't sending a response here.
});

// 2. Create Container & Shadow DOM
const container = document.createElement('div');
container.id = 'english-mate-root';
document.body.appendChild(container);

const shadowRoot = container.attachShadow({ mode: 'open' });

// 3. Inject Styles
const styleTag = document.createElement('style');
styleTag.textContent = styles + '\n' + injectedStyles;
shadowRoot.appendChild(styleTag);

// 4. Mount React
try {
    const root = ReactDOM.createRoot(shadowRoot);
    root.render(
        <React.StrictMode>
            <ContentApp />
        </React.StrictMode>
    );
    console.log('English Mate React App Mounted Successfully');
} catch (err) {
    console.error('English Mate Failed to Mount:', err);
}
