import React, { useState, useEffect } from 'react';
import { fetchDefinition } from '../lib/api';
import { saveVocabularyItem } from '../lib/storage';
import './Lookup.css';

const Lookup = ({ initialQuery = '' }) => {
    const [query, setQuery] = useState(initialQuery);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notes, setNotes] = useState('');

    const handleSearch = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);
        setNotes('');

        try {
            const data = await fetchDefinition(query);
            setResult(data);
        } catch (err) {
            setError(err.message === "Word not found" ? "Word not found. Try another?" : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!result) return;
        try {
            await saveVocabularyItem({ ...result, notes });
            alert(`Saved: ${result.word}`);
            setNotes(''); // Clear notes after save
        } catch (err) {
            console.error(err);
            alert("Failed to save word");
        }
    };

    // Trigger search initially if word is present
    useEffect(() => {
        if (initialQuery && initialQuery.trim()) {
            handleSearch({ preventDefault: () => { } });
        }
    }, [initialQuery]);

    return (
        <div className="lookup-container">
            <div className="lookup-scroll-area">
                {/* Welcome / Empty State */}
                {!result && !loading && !error && (
                    <div className="welcome-message">
                        <h3>Hi there! 👋</h3>
                        <p>Type a word below to get started, or select text on the page.</p>
                    </div>
                )}

                {/* Error Bubble */}
                {error && (
                    <div className="chat-bubble error">
                        {error}
                    </div>
                )}

                {/* Result Bubble */}
                {result && (
                    <div className="chat-bubble result">
                        <div className="word-header">
                            <h2>{result.word}</h2>
                            <span className="phonetic">{result.phonetic}</span>
                        </div>

                        <div className="pos-tag">{result.partOfSpeech}</div>

                        <p className="definition">{result.definition}</p>

                        {result.example && (
                            <div className="example">
                                <strong>Ex:</strong> "{result.example}"
                            </div>
                        )}

                        <textarea
                            className="notes-input"
                            placeholder="Add your own notes (optional)..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />

                        <button className="save-btn" onClick={handleSave}>
                            ❤️ Save Word
                        </button>
                    </div>
                )}

                {/* Loading Bubble */}
                {loading && (
                    <div className="chat-bubble loading">
                        <div className="typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Bottom Input */}
            <div className="lookup-input-area">
                <form onSubmit={handleSearch} className="search-box">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask the AI..."
                        autoFocus
                    />
                    <button type="submit" disabled={loading} className="send-btn">
                        ➤
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Lookup;

