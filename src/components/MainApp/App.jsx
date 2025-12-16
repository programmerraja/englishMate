import React, { useState } from 'react';
import SidebarLayout from '../Layout/SidebarLayout';
import Lookup from '../Lookup';
import Library from '../Library';
import Dashboard from '../Dashboard/Dashboard';
import Practice from '../Practice/Practice';
import ChatContainer from '../Chat/ChatContainer';
import Settings from '../Settings/Settings';
import Flashcards from '../Flashcards';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <SidebarLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onClose={() => window.close()} // Valid for side panel
        >
            {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
            {activeTab === 'chat' && <ChatContainer />}
            {activeTab === 'lookup' && <Lookup />}
            {activeTab === 'library' && <Library />}
            {activeTab === 'flashcards' && <Flashcards />}
            {activeTab === 'practice' && <Practice />}
            {activeTab === 'settings' && <Settings />}
        </SidebarLayout>
    );
}

export default App;
