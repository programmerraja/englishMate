
import React, { useState, useEffect } from 'react';
import { getVocabulary, deleteVocabularyItem, updateVocabularyItem } from '../lib/storage';
import './Library.css';
import { Edit2, Search, Trash2, Plus, Save, X } from 'lucide-react';

const Library = () => {
    const [words, setWords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    // Add Mode State
    const [isAdding, setIsAdding] = useState(false);
    const [addForm, setAddForm] = useState({ word: '', meaning: '', example: '', notes: '' });

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

    // --- Edit Logic ---
    const startEditing = (wordItem) => {
        setEditingId(wordItem.id);
        setEditForm({
            meaning: wordItem.meaning || wordItem.definition,
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
            setWords(words.map(w => w.id === id ? { ...w, ...editForm } : w));
            setEditingId(null);
        } catch (error) {
            console.error("Failed to save edits", error);
        }
    };

    const handleAddChange = (field, value) => {
        setAddForm(prev => ({ ...prev, [field]: value }));
    };

    const saveNewWord = async () => {
        if (!addForm.word || !addForm.meaning) {
            alert("Word and Meaning are required.");
            return;
        }
        try {
            const newWord = await saveVocabularyItem(addForm);
            setWords([newWord, ...words]);
            setIsAdding(false);
            setAddForm({ word: '', meaning: '', example: '', notes: '' });
        } catch (e) {
            alert(e.message);
        }
    };

    const filteredWords = words.filter(w =>
        w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (w.meaning || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="library-container">
            <div className="library-header-row">
                <div className="search-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search vocabulary..."
                        className="library-search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="add-btn" onClick={() => setIsAdding(true)}>
                    <Plus size={18} /> Add Word
                </button>
            </div>

            {/* Add Modal / Form Overlay (Simple for now) */}
            {isAdding && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <h3>Add New Word</h3>
                        <div className="modal-form">
                            <input
                                placeholder="Word"
                                value={addForm.word}
                                onChange={e => handleAddChange('word', e.target.value)}
                                autoFocus
                            />
                            <textarea
                                placeholder="Meaning"
                                value={addForm.meaning}
                                onChange={e => handleAddChange('meaning', e.target.value)}
                            />
                            <textarea
                                placeholder="Example Sentence (Optional)"
                                value={addForm.example}
                                onChange={e => handleAddChange('example', e.target.value)}
                            />
                            <textarea
                                placeholder="Notes (Optional)"
                                value={addForm.notes}
                                onChange={e => handleAddChange('notes', e.target.value)}
                            />
                            <div className="modal-actions">
                                <button className="btn-primary" onClick={saveNewWord}>Save</button>
                                <button className="btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="library-list">
                {filteredWords.length === 0 ? (
                    <div className="empty-state">No words found.</div>
                ) : (
                    filteredWords.map(item => (
                        <div key={item.id} className="library-card glass-panel">
                            {editingId === item.id ? (
                                <div className="edit-form">
                                    <div className="card-header">
                                        <h3>{item.word}</h3>
                                    </div>
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
                                        <button className="btn-save" onClick={() => saveEdit(item.id)}><Save size={16} /> Save</button>
                                        <button className="btn-cancel" onClick={cancelEditing}><X size={16} /> Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="card-header">
                                        <h3>{item.word}</h3>
                                        <div className="card-actions">
                                            <button className="icon-btn edit-btn" onClick={() => startEditing(item)} title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="icon-btn delete-btn" onClick={() => handleDelete(item.id, item.word)} title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="card-meaning">{item.meaning || item.definition}</p>
                                    {item.example && <p className="card-example">"{item.example}"</p>}
                                    {item.notes && <div className="card-notes">📝 {item.notes}</div>}
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
