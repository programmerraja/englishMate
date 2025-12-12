
import React from 'react';

const NavRail = ({ tabs, activeTab, onTabChange, onClose }) => {
    return (
        <div className="nav-rail">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                    title={tab.label}
                >
                    {tab.icon}
                </button>
            ))}

            <div className="nav-spacer"></div>

            <button
                className="nav-item close-btn"
                onClick={onClose}
                title="Close Sidebar"
            >
                ✕
            </button>
        </div>
    );
};

export default NavRail;
