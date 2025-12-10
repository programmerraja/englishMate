import React, { useState, useEffect } from 'react';
import App from '../components/MainApp/App';

const MainSidebar = ({ isOpen, onClose }) => {
    return (
        <div className={`em-main-sidebar ${isOpen ? 'open' : ''}`}>
            <button className="em-sidebar-close" onClick={onClose}>&times;</button>
            <div className="em-app-container">
                <App />
            </div>
        </div>
    );
};

export default MainSidebar;
