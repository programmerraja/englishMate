import React from 'react';
import { X, MessageSquare, Plus, Trash2, ChevronRight } from 'lucide-react';

const HistoryDrawer = ({ isOpen, onClose, sessions, activeId, onSelect, onDelete, onNewChat }) => {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            <div className={`drawer-panel glass-panel ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h3>Chat History</h3>
                    <button className="icon-btn close-drawer" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="drawer-content">
                    <button className="new-chat-row" onClick={() => { onNewChat(); onClose(); }}>
                        <Plus size={18} /> New Chat
                    </button>

                    <div className="sessions-list">
                        {sessions.length === 0 ? (
                            <div className="empty-history">No past conversations</div>
                        ) : (
                            sessions.map(session => (
                                <div
                                    key={session.id}
                                    className={`session-item ${activeId === session.id ? 'active' : ''}`}
                                    onClick={() => onSelect(session)}
                                >
                                    <MessageSquare size={16} className="session-icon" />
                                    <div className="session-info">
                                        <span className="session-name">{session.title}</span>
                                        <span className="session-date">
                                            {new Date(session.lastUpdatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        className="delete-session-btn"
                                        onClick={(e) => onDelete(session.id, e)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HistoryDrawer;
