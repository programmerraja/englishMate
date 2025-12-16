
import React, { useState, useCallback, useEffect } from 'react';
import NavRail from './NavRail';
import { LayoutDashboard, Search, BookOpen, Mic2, Settings, MessageSquare } from 'lucide-react';
import '../../styles/layout.css';

const SIDEBAR_MIN_WIDTH = 350;
const SIDEBAR_MAX_WIDTH = 800;

const SidebarLayout = ({ activeTab, onTabChange, onClose, children }) => {
    // Current width state
    const [width, setWidth] = useState(450);
    const [isResizing, setIsResizing] = useState(false);

    // Navigation configuration
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={22} /> },
        { id: 'chat', label: 'AI Tutor', icon: <MessageSquare size={22} /> },
        { id: 'lookup', label: 'Lookup', icon: <Search size={22} /> },
        { id: 'library', label: 'Library', icon: <BookOpen size={22} /> },
        { id: 'practice', label: 'Practice', icon: <Mic2 size={22} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={22} /> }
    ];

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsResizing(true);
        document.body.style.cursor = 'col-resize';
    };

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
        document.body.style.cursor = '';
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isResizing) return;

        // Calculate new width: Window Width - Mouse X
        // (Since sidebar is on the right)
        let newWidth = window.innerWidth - e.clientX;

        // Apply constraints
        if (newWidth < SIDEBAR_MIN_WIDTH) newWidth = SIDEBAR_MIN_WIDTH;
        if (newWidth > SIDEBAR_MAX_WIDTH) newWidth = SIDEBAR_MAX_WIDTH;

        setWidth(newWidth);
    }, [isResizing]);

    // Native Side Panel handles sizing for us mostly, 
    // but if we want internal resizability we can keep it. 
    // However, Chrome Side Panel is resizable by the user from the edge.
    // So we should probably remove the internal resizer handle logic to avoid conflict.

    // Expose width to parent/css
    const style = {
        '--sidebar-width': '100%',
        width: '100%',
        height: '100vh',
    };

    // Propagate width change to parent (for body resizing)
    useEffect(() => {
        // Dispatch custom event for `ContentApp` to listen to if needed
        // Or better, just update the host style here if we are shifting the page? 
        // NOTE: The `ContentApp` applies the width shift. We should probably bubble this up 
        // to `ContentApp` or have `ContentApp` pass a setter. 
        // For now, let's emit an event or assume `ContentApp` gets it via prop if we lift state.
        // Actually, let's keep it local here but fire an event for the outside world
        window.dispatchEvent(new CustomEvent('english-mate-resize', { detail: { width } }));
    }, [width]);


    return (
        <div className="sidebar-layout" style={style}>
            {/* Resizer Handle Removed (Native Panel) */}

            {/* Main Content Area */}
            <div className="content-area">
                <header className="content-header">
                    {tabs.find(t => t.id === activeTab)?.label}
                </header>
                <div className="view-container">
                    {children}
                </div>
            </div>

            {/* Navigation Rail */}
            <NavRail
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={onTabChange}
                onClose={onClose}
            />
        </div>
    );
};

export default SidebarLayout;
