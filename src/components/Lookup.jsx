import React, { useState } from 'react';
import { fetchDefinition } from '../lib/api';
import { saveWord } from '../lib/storage';
import './Lookup.css';

const Lookup = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

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
            await saveWord(result);
            alert(`Saved: ${result.word}`);
        } catch (err) {
            console.error(err);
            alert("Failed to save word");
        }
    };

    return (
        <div className="lookup-container">
            <form onSubmit={handleSearch} className="search-box">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type a word..."
                    autoFocus
                />
                <button type="submit" disabled={loading}>
                    {loading ? '...' : '🔍'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {result && (
                <div className="result-card">
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

                    <button className="save-btn" onClick={handleSave}>
                        ❤️ Save Word
                    </button>
                </div>
            )}
        </div>
    );
};

export default Lookup;
