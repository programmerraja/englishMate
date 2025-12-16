import React, { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { saveVocabularyItem } from '../../lib/storage';

const DockedVocabForm = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        word: '',
        meaning: '',
        example: '',
        notes: ''
    });

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!form.word) return alert("Word is required");
        try {
            await saveVocabularyItem(form);
            alert("Word saved!");
            setForm({ word: '', meaning: '', example: '', notes: '' });
            onClose();
        } catch (e) {
            alert(e.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="docked-vocab-form glass-panel">
            <div className="dock-header">
                <h3>Add to Library</h3>
                <button className="icon-btn" onClick={onClose}><X size={18} /></button>
            </div>

            <div className="dock-inputs">
                <input
                    placeholder="Word"
                    value={form.word}
                    onChange={e => handleChange('word', e.target.value)}
                    className="dock-input"
                    autoFocus
                />
                <textarea
                    placeholder="Meaning"
                    value={form.meaning}
                    onChange={e => handleChange('meaning', e.target.value)}
                    className="dock-textarea"
                />
                <textarea
                    placeholder="Example (Optional)"
                    value={form.example}
                    onChange={e => handleChange('example', e.target.value)}
                    className="dock-textarea"
                />
                {/* Notes hidden to save space, or optional toggle */}
            </div>

            <button className="dock-save-btn" onClick={handleSave}>
                <Save size={16} /> Save Word
            </button>
        </div>
    );
};

export default DockedVocabForm;
