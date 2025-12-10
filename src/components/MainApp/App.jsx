import React, { useState } from 'react';
import Lookup from '../Lookup';
import Flashcards from '../Flashcards';
import './App.css';

function App() {
    const [activeTab, setActiveTab] = useState('lookup');

    return (
        <div className="App">
            <header className="app-header">
                <h1>English Mate</h1>
            </header>

            <nav className="tabs">
                <button
                    className={activeTab === 'lookup' ? 'active' : ''}
                    onClick={() => setActiveTab('lookup')}
                >
                    🔍 Lookup
                </button>
                <button
                    className={activeTab === 'flashcards' ? 'active' : ''}
                    onClick={() => setActiveTab('flashcards')}
                >
                    🎓 Practice
                </button>
            </nav>

            <main className="app-content">
                {activeTab === 'lookup' ? <Lookup /> : <Flashcards />}
            </main>
        </div>
    );
}

export default App;
