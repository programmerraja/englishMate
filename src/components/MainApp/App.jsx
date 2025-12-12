import React, { useState } from 'react';
import SidebarLayout from '../Layout/SidebarLayout';
import Lookup from '../Lookup';
import Flashcards from '../Flashcards';
import Library from '../Library';
// App.css is likely legacy white theme, check validity or rely on new theme variables
import './App.css';

function App() {
    const [activeTab, setActiveTab] = useState('lookup');

    return (
        <SidebarLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onClose={() => window.close()} // Valid for side panel
        >
            {activeTab === 'lookup' && <Lookup />}
            {activeTab === 'library' && <Library />}
            {activeTab === 'flashcards' && <Flashcards />}
        </SidebarLayout>
    );
}

export default App;
