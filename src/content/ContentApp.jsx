
import React, { useState, useEffect, useRef } from 'react';
import Tooltip from './Tooltip';
import Toast from './Toast';
import SidebarLayout from '../components/Layout/SidebarLayout';

// Views
import Lookup from '../components/Lookup';
import Library from '../components/Library';
import Flashcards from '../components/Flashcards';

// Styles
import './content.css';
import appStyles from '../components/MainApp/App.css?inline';
import lookupStyles from '../components/Lookup.css?inline';
import flashcardStyles from '../components/Flashcards.css?inline';
import libraryStyles from '../components/Library.css?inline';
import themeStyles from '../styles/theme.css?inline';
import layoutStyles from '../styles/layout.css?inline';

const safeStyle = (s) => typeof s === 'string' ? s : '';

export const injectedStyles =
    safeStyle(themeStyles) + '\n' +
    safeStyle(layoutStyles) + '\n' +
    safeStyle(appStyles) + '\n' +
    safeStyle(lookupStyles) + '\n' +
    safeStyle(flashcardStyles) + '\n' +
    safeStyle(libraryStyles);

console.log("Injected Styles Length:", injectedStyles.length);


const ContentApp = () => {
    // UI State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('lookup');

    // Data State
    const [selection, setSelection] = useState(null);
    const [lookupWord, setLookupWord] = useState('');
    const [activeToast, setActiveToast] = useState(null);

    const isSidebarOpenRef = useRef(isSidebarOpen);
    useEffect(() => {
        isSidebarOpenRef.current = isSidebarOpen;
    }, [isSidebarOpen]);

    // --- Page Shift Logic ---
    useEffect(() => {
        // Initial setup for body transition
        document.body.style.transition = 'width 0.3s ease-out';

        const handleResize = (e) => {
            if (isSidebarOpenRef.current) {
                const width = e.detail?.width || 450;
                document.body.style.width = `calc(100% - ${width}px)`;
            }
        };

        window.addEventListener('english-mate-resize', handleResize);
        return () => window.removeEventListener('english-mate-resize', handleResize);
    }, []);

    useEffect(() => {
        if (isSidebarOpen) {
            // Trigger a resize event or manually set width based on current sidebar width
            // Since we don't store width here (it's in SidebarLayout), we can default or wait for event.
            // Better: SidebarLayout mounts and sets its default width, potentially firing event?
            // Fallback:
            document.body.style.width = `calc(100% - 450px)`; // Default sync
        } else {
            document.body.style.width = '100%';
        }
    }, [isSidebarOpen]);

    // --- Interaction Logic ---
    useEffect(() => {
        console.log("English Mate Content App Mounted");

        const handleMouseUp = () => {
            const sel = window.getSelection();
            const text = sel.toString().trim();

            if (text.length > 0 && text.length < 50 && !isSidebarOpenRef.current) {
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

        const handleToggle = () => {
            console.log("Toggle Sidebar");
            setIsSidebarOpen(prev => !prev);
        };

        const handleChromeMessage = (request) => {
            if (request.action === "lookup") {
                setLookupWord(request.word);
                setActiveTab('lookup');
                setIsSidebarOpen(true);
                setSelection(null);
            } else if (request.action === "show_toast") {
                setActiveToast({
                    message: request.message,
                    type: request.type || 'success',
                    id: Date.now()
                });
            } else if (request.action === "toggle_sidebar") {
                // Should be handled by global listener in index.jsx dispatching event, but generic fallback
                setIsSidebarOpen(prev => !prev);
            }
        };

        document.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('english-mate-toggle', handleToggle);
        console.log("Content App Mounted");
        chrome.runtime.onMessage.addListener(handleChromeMessage);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('english-mate-toggle', handleToggle);
            chrome.runtime.onMessage.removeListener(handleChromeMessage);
        };
    }, []);

    const handleTooltipOpen = () => {
        if (selection) {
            setLookupWord(selection.text);
            setActiveTab('lookup');
            setIsSidebarOpen(true);
            setSelection(null);
        }
    };

    return (
        <>
            <div style={{ position: 'fixed', bottom: 10, left: 10, background: 'lime', padding: 5, color: 'black', zIndex: 9999999 }}>
                React Active ({isSidebarOpen ? 'OPEN' : 'CLOSED'})
            </div>
            {selection && !isSidebarOpen && (
                <Tooltip
                    x={selection.x}
                    y={selection.y}
                    onOpen={handleTooltipOpen}
                />
            )}

            {isSidebarOpen && (
                <SidebarLayout
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onClose={() => setIsSidebarOpen(false)}
                >
                    {activeTab === 'lookup' && <Lookup initialQuery={lookupWord} key={lookupWord} />}
                    {activeTab === 'library' && <Library />}
                    {activeTab === 'flashcards' && <Flashcards />}
                </SidebarLayout>
            )}

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
