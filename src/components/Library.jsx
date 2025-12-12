
import React, { useState, useEffect } from 'react';
import { getVocabulary, deleteVocabularyItem, updateVocabularyItem } from '../lib/storage';
import './Library.css';

const Library = () => {
    const [words, setWords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        loadVocabulary();
    }, []);

    const loadVocabulary = async () => {
        const data = await getVocabulary();
        setWords(data);
    };

    const handleDelete = async (id, word) => {
        if (window.confirm(`Are you sure you want to delete "${word}"?`)) {
            await deleteVocabularyItem(id);
            setWords(words.filter(w => w.id !== id));
        }
    };

    const startEditing = (wordItem) => {
        setEditingId(wordItem.id);
        setEditForm({
            meaning: wordItem.meaning || wordItem.definition, // Handle legacy
            example: wordItem.example,
            notes: wordItem.notes
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const saveEdit = async (id) => {
        try {
            await updateVocabularyItem(id, editForm);

            // Update local state
            setWords(words.map(w => w.id === id ? { ...w, ...editForm } : w));
            setEditingId(null);
        } catch (error) {
            console.error("Failed to save edits", error);
            alert("Failed to save changes.");
        }
    };

    const filteredWords = words.filter(w =>
        w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (w.meaning || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="library-container">
            <div className="library-header">
                <input
                    type="text"
                    placeholder="Search your vocabulary..."
                    className="library-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="library-stats">
                    {words.length} Saved Words
                </div>
            </div>

            <div className="library-list">
                {filteredWords.length === 0 ? (
                    <div className="empty-state">No words found.</div>
                ) : (
                    filteredWords.map(item => (
                        <div key={item.id} className="library-card">
                            <div className="card-header">
                                <h3>{item.word}</h3>
                                <span className="pos-badge">{item.partOfSpeech}</span>
                            </div>

                            {editingId === item.id ? (
                                <div className="edit-form">
                                    <label>Meaning:</label>
                                    <textarea
                                        value={editForm.meaning}
                                        onChange={(e) => handleEditChange('meaning', e.target.value)}
                                    />

                                    <label>Example:</label>
                                    <textarea
                                        value={editForm.example}
                                        onChange={(e) => handleEditChange('example', e.target.value)}
                                    />

                                    <label>Notes:</label>
                                    <textarea
                                        value={editForm.notes}
                                        onChange={(e) => handleEditChange('notes', e.target.value)}
                                    />

                                    <div className="edit-actions">
                                        <button className="btn-save" onClick={() => saveEdit(item.id)}>Save</button>
                                        <button className="btn-cancel" onClick={cancelEditing}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="card-meaning">{item.meaning || item.definition}</p>
                                    {item.example && <p className="card-example">" {item.example} "</p>}
                                    {item.notes && <div className="card-notes">📝 {item.notes}</div>}

                                    <div className="card-actions">
                                        <button className="icon-btn edit-btn" onClick={() => startEditing(item)} title="Edit">✏️</button>
                                        <button className="icon-btn delete-btn" onClick={() => handleDelete(item.id, item.word)} title="Delete">🗑️</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Library;
