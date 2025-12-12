import React, { useState, useEffect } from 'react';
import { fetchDefinition } from '../lib/api';
import { saveVocabularyItem } from '../lib/storage';

const Modal = ({ word, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDefinition = async () => {
            try {
                const result = await fetchDefinition(word);
                setData(result);
            } catch (err) {
                setError("Definition not found");
            } finally {
                setLoading(false);
            }
        };
        loadDefinition();
    }, [word]);

    const handleSave = async () => {
        if (data) {
            try {
                await saveVocabularyItem(data);
                onClose();
            } catch (err) {
                // Handle error mainly if user tries to save duplicate, maybe show a toast?
                // For now, simple logging or closing is ok as per current logic
                console.error("Failed to save:", err);
                onClose(); // Close anyway for now, or we could keep it open to show error
            }
        }
    };

    return (
        <div className="em-modal-overlay" onClick={onClose}>
            <div className="em-modal" onClick={(e) => e.stopPropagation()}>
                <button className="em-close-btn" onClick={onClose}>&times;</button>

                {loading && <div className="em-loading">Looking up "{word}"...</div>}

                {error && <div className="em-loading" style={{ color: 'red' }}>{error}</div>}

                {data && (
                    <>
                        <div className="em-word-header">
                            <h2>{data.word}</h2>
                            <span className="em-phonetic">{data.phonetic}</span>
                        </div>

                        <div className="em-pos">{data.partOfSpeech}</div>
                        <p className="em-def">{data.definition}</p>

                        {data.example && (
                            <div className="em-example">"{data.example}"</div>
                        )}

                        <button className="em-save-btn" onClick={handleSave}>
                            ❤️ Save to English Mate
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Modal;
