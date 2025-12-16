import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Download, Upload } from 'lucide-react';
import { getUserSettings, updateUserSettings, getFullExportData, importData } from '../../lib/storage';
import './Settings.css';

const Settings = () => {
    const [keys, setKeys] = useState({
        deepgram: '',
        gemini: '',
        openai: ''
    });
    const [dailyGoal, setDailyGoal] = useState(5);
    const [status, setStatus] = useState(''); // 'saved', 'error', ''

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const s = await getUserSettings();
        setKeys(s.apiKeys);
        setDailyGoal(s.dailyGoal);
    };

    const handleSave = async () => {
        try {
            await updateUserSettings({
                apiKeys: keys,
                dailyGoal: parseInt(dailyGoal)
            });
            setStatus('saved');
            setTimeout(() => setStatus(''), 3000);
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    const handleExport = async () => {
        const data = await getFullExportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `englishmate_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const json = JSON.parse(event.target.result);
                const count = await importData(json);
                alert(`Successfully imported ${count} new items!`);
            } catch (err) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="settings-container">
            <h2 className="settings-header">Settings</h2>

            {/* API Keys Section */}
            <div className="settings-section glass-panel">
                <h3>API Keys</h3>
                <p className="settings-desc">
                    Required for AI features. Your keys are stored locally and never sent to our servers.
                </p>

                <div className="input-group">
                    <label>Deepgram API Key (Speech-to-Text)</label>
                    <input
                        type="password"
                        value={keys.deepgram}
                        onChange={e => setKeys({ ...keys, deepgram: e.target.value })}
                        placeholder="sk-..."
                    />
                </div>

                <div className="input-group">
                    <label>Gemini API Key (AI Feedback)</label>
                    <input
                        type="password"
                        value={keys.gemini}
                        onChange={e => setKeys({ ...keys, gemini: e.target.value })}
                        placeholder="AIza..."
                    />
                </div>

                <div className="input-group">
                    <label>OpenAI API Key (Optional Alternative)</label>
                    <input
                        type="password"
                        value={keys.openai}
                        onChange={e => setKeys({ ...keys, openai: e.target.value })}
                        placeholder="sk-..."
                    />
                </div>

                <div className="input-group">
                    <label>Daily Vocabulary Goal</label>
                    <input
                        type="number"
                        value={dailyGoal}
                        onChange={e => setDailyGoal(e.target.value)}
                        min="1"
                        max="50"
                    />
                </div>

                <button className="save-btn" onClick={handleSave}>
                    <Save size={18} />
                    Save Changes
                </button>

                {status === 'saved' && <span className="status-msg success">Settings Saved!</span>}
            </div>

            {/* Data Management Section */}
            <div className="settings-section glass-panel">
                <h3>Data Management</h3>
                <div className="data-actions">
                    <button className="secondary-btn" onClick={handleExport}>
                        <Download size={18} /> Export Data JSON
                    </button>

                    <label className="secondary-btn upload-btn">
                        <Upload size={18} /> Import Data JSON
                        <input type="file" accept=".json" hidden onChange={handleImport} />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Settings;
