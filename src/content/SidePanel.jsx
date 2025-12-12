import React, { useState, useEffect, useRef } from 'react';
import { fetchDefinition } from '../lib/api';
import { saveVocabularyItem } from '../lib/storage';

const SidePanel = ({ word, isOpen, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const saveBtnRef = useRef(null);

    useEffect(() => {
        if (word && isOpen) {
            loadDefinition();
        }
    }, [word, isOpen]);

    const loadDefinition = async () => {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            const result = await fetchDefinition(word);
            setData(result);
        } catch (err) {
            setError("Definition not found");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (data) {
            try {
                await saveVocabularyItem(data);
                // Show success feedback
                if (saveBtnRef.current) {
                    const originalText = saveBtnRef.current.innerText;
                    saveBtnRef.current.innerText = "Saved! ✅";
                    setTimeout(() => {
                        if (saveBtnRef.current) {
                            saveBtnRef.current.innerText = originalText;
                        }
                    }, 2000);
                }
            } catch (err) {
                console.error("Failed to save:", err);
                // Optionally show error feedback
            }
        }
    };

    return (
        <div className={`em-side-panel ${isOpen ? 'open' : ''}`}>
            <div className="em-panel-header">
                <h2>📖 English Mate</h2>
                <button className="em-close-panel" onClick={onClose}>&times;</button>
            </div>

            <div className="em-panel-content">
                {loading && (
                    <div className="em-loading">
                        <span>Looking up "{word}"...</span>
                    </div>
                )}

                {error && (
                    <div className="em-error">
                        <p>😕 {error}</p>
                        <p style={{ fontSize: '0.8rem' }}>Try selecting a different word.</p>
                    </div>
                )}

                {data && !loading && (
                    <>
                        <div className="em-word-header">
                            <h1 style={{ margin: '0 0 4px 0', fontSize: '2rem', color: '#1f2937' }}>{data.word}</h1>
                            <span className="em-phonetic" style={{ color: '#6b7280', fontFamily: 'monospace' }}>{data.phonetic}</span>
                        </div>

                        <div style={{ margin: '16px 0' }}>
                            <span className="em-pos">{data.partOfSpeech}</span>
                        </div>

                        <p className="em-def">{data.definition}</p>

                        {data.example && (
                            <div className="em-example">
                                "{data.example}"
                            </div>
                        )}

                        <div style={{ marginTop: '24px' }}>
                            <button
                                ref={saveBtnRef}
                                className="em-save-btn"
                                onClick={handleSave}
                            >
                                ❤️ Save to English Mate
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SidePanel;
