import React, { useState } from 'react';
import SidebarLayout from '../Layout/SidebarLayout';
import Lookup from '../Lookup';
import Library from '../Library';
import Dashboard from '../Dashboard/Dashboard';
import Practice from '../Practice/Practice';
import Settings from '../Settings/Settings';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <SidebarLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onClose={() => window.close()} // Valid for side panel
        >
            {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
            {activeTab === 'lookup' && <Lookup />}
            {activeTab === 'library' && <Library />}
            {activeTab === 'practice' && <Practice />}
            {activeTab === 'settings' && <Settings />}
        </SidebarLayout>
    );
}

export default App;
