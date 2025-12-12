import React, { useState, useEffect, useRef } from 'react';
import Tooltip from './Tooltip';
import SidePanel from './SidePanel';
import MainSidebar from './MainSidebar';
import Toast from './Toast';
import './content.css';

// Import App CSS to ensure it's injected into Shadow DOM
import appStyles from '../components/MainApp/App.css?inline';
import lookupStyles from '../components/Lookup.css?inline';
import flashcardStyles from '../components/Flashcards.css?inline';

export const injectedStyles = appStyles + '\n' + lookupStyles + '\n' + flashcardStyles;

const ContentApp = () => {
    const [selection, setSelection] = useState(null);
    const [panelWord, setPanelWord] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(false);
    const [activeToast, setActiveToast] = useState(null);

    // Use ref to access current state in event handlers without re-binding
    const isMainSidebarOpenRef = useRef(isMainSidebarOpen);
    useEffect(() => {
        isMainSidebarOpenRef.current = isMainSidebarOpen;
    }, [isMainSidebarOpen]);

    useEffect(() => {
        console.log("English Mate Content App Mounted");

        // Handle Text Selection
        const handleMouseUp = () => {
            const sel = window.getSelection();
            const text = sel.toString().trim();

            if (text.length > 0 && text.length < 50 && !isMainSidebarOpenRef.current) {
                const range = sel.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                setSelection({
                    text: text,
                    x: rect.left + window.scrollX + (rect.width / 2) - 16,
                    y: rect.top + window.scrollY - 45
                });
            } else {
                setTimeout(() => setSelection(null), 100);
            }
        };

        // Handle Messages (via Custom Event from index.jsx)
        const handleToggle = () => {
            console.log("Toggling sidebar via event...");
            setIsMainSidebarOpen(prev => !prev);
        };

        // Handle Chrome Messages for Lookup (still need this for context menu if we want specific word lookup)
        // OR we can move context menu handling to index.jsx too? 
        // For now, let's keep context menu here but be aware it might have the same race condition if not mounted.
        // Actually, let's move context menu to index.jsx too for consistency? 
        // No, let's just keep it simple. If the app is mounted, it works. 
        // The "toggle" is the critical one for the icon click.

        const handleChromeMessage = (request) => {
            if (request.action === "lookup") {
                setPanelWord(request.word);
                setIsPanelOpen(true);
                setSelection(null);
            } else if (request.action === "show_toast") {
                setActiveToast({
                    message: request.message,
                    type: request.type || 'success',
                    id: Date.now() // unique id to force re-render if needed
                });
            }
        };

        document.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('english-mate-toggle', handleToggle);
        chrome.runtime.onMessage.addListener(handleChromeMessage);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('english-mate-toggle', handleToggle);
            chrome.runtime.onMessage.removeListener(handleChromeMessage);
        };
    }, []);

    const openPanel = () => {
        if (selection) {
            setPanelWord(selection.text);
            setIsPanelOpen(true);
            setSelection(null);
        }
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setTimeout(() => setPanelWord(null), 300);
    };

    return (
        <>
            {selection && !isPanelOpen && !isMainSidebarOpen && (
                <Tooltip
                    x={selection.x}
                    y={selection.y}
                    onOpen={openPanel}
                />
            )}

            <SidePanel
                word={panelWord}
                isOpen={isPanelOpen}
                onClose={closePanel}
            />

            <MainSidebar
                isOpen={isMainSidebarOpen}
                onClose={() => setIsMainSidebarOpen(false)}
            />

            {activeToast && (
                <Toast
                    key={activeToast.id}
                    message={activeToast.message}
                    type={activeToast.type}
                    onClose={() => setActiveToast(null)}
                />
            )}
        </>
    );
};

export default ContentApp;
