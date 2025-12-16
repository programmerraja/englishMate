import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Menu, Plus, Zap, Trash2, Send, X, PlusCircle } from 'lucide-react';
import ChatView from './ChatView';
import HistoryDrawer from './HistoryDrawer';
import DockedVocabForm from './DockedVocabForm';
import { getChatSessions, createChatSession, updateChatSession, saveMessageToSession, deleteChatSession } from '../../lib/storage';
import { streamChat } from '../../lib/ai-service';
import './Chat.css';

const ChatContainer = () => {
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isVocabDockOpen, setIsVocabDockOpen] = useState(false);
    const [provider, setProvider] = useState('gemini'); // Default

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        const s = await getChatSessions();
        setSessions(s);
        if (s.length > 0 && !currentSession) {
            setCurrentSession(s[0]);
            setProvider(s[0].provider || 'gemini');
        }
    };

    const handleNewChat = async () => {
        const newSession = await createChatSession('New Conversation', provider);
        setSessions([newSession, ...sessions]);
        setCurrentSession(newSession);
        setIsDrawerOpen(false);
    };

    const handleSelectSession = (session) => {
        setCurrentSession(session);
        setProvider(session.provider || 'gemini');
        setIsDrawerOpen(false);
    };

    const handleDeleteSession = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("Delete this chat?")) {
            await deleteChatSession(id);
            const remaining = sessions.filter(s => s.id !== id);
            setSessions(remaining);
            if (currentSession?.id === id) {
                setCurrentSession(remaining[0] || null);
            }
        }
    };

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    // Passed to ChatView to save messages
    const onMessagesUpdate = async (sessionId, newMessages) => {
        // Update local state immediately for UI responsiveness
        setCurrentSession(prev => ({ ...prev, messages: newMessages }));

        // In a real app, we might debounce this or save individual messages.
        // For simplicity, we update the whole session object or push the last message.
        // But our storage helper `saveMessageToSession` is better.
        // Actually, the streaming hook manages state locally. We need to sync it to DB when it finishes.
        // Let's rely on `onFinish` from the AI SDK hook in ChatView to persist.
    };

    const onSessionTitleChange = async (sessionId, newTitle) => {
        await updateChatSession(sessionId, { title: newTitle });
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: newTitle } : s));
    };

    return (
        <div className="chat-container">
            {/* Header */}
            <header className="chat-header glass-panel">
                <div className="header-left">
                    <button className="icon-btn" onClick={toggleDrawer}>
                        <Menu size={20} />
                    </button>
                    <span className="session-title">
                        {currentSession ? (currentSession.title || "Chat") : "AI Tutor"}
                    </span>

                    {/* Add Vocab Toggle */}
                    <button
                        className={`icon-btn ${isVocabDockOpen ? 'active' : ''}`}
                        onClick={() => setIsVocabDockOpen(!isVocabDockOpen)}
                        title="Add Vocabulary"
                        style={{ marginLeft: '1rem', color: isVocabDockOpen ? '#8b5cf6' : 'inherit' }}
                    >
                        <PlusCircle size={20} />
                    </button>
                </div>

                <div className="header-right">
                    <div className="provider-badge" title="Current Model">
                        <Zap size={14} fill="currentColor" />
                        <select
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            className="provider-select"
                        >
                            <option value="gemini">Gemini 1.5</option>
                            <option value="openai">GPT-4</option>
                        </select>
                    </div>
                    <button className="icon-btn" onClick={handleNewChat} title="New Chat">
                        <Plus size={20} />
                    </button>
                </div>
            </header>

            {/* Main View */}
            <div className="chat-main-area">
                {currentSession ? (
                    <ChatView
                        session={currentSession}
                        provider={provider}
                        onMessagesUpdate={onMessagesUpdate} // Mostly for purely local updates if needed
                        onSessionTitleChange={onSessionTitleChange}
                    />
                ) : (
                    <div className="empty-chat-state">
                        <Bot size={48} className="bot-icon-lg" />
                        <p>Start a conversation to practice your English!</p>
                        <button className="btn-primary" onClick={handleNewChat}>Start New Chat</button>
                    </div>
                )}

                {/* Docked Form Overlays Bottom of ChatView/Input */}
                <DockedVocabForm
                    isOpen={isVocabDockOpen}
                    onClose={() => setIsVocabDockOpen(false)}
                />
            </div>

            {/* History Drawer Overlay */}
            <HistoryDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sessions={sessions}
                activeId={currentSession?.id}
                onSelect={handleSelectSession}
                onDelete={handleDeleteSession}
                onNewChat={handleNewChat}
            />
        </div>
    );
};

export default ChatContainer;
