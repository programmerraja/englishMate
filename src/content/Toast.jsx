
import React, { useEffect, useState } from 'react';

const Toast = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setVisible(true));

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        container: {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: type === 'error' ? '#ff4d4f' : '#52c41a',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 2147483647,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            opacity: visible ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none' // Don't block clicks underneath
        },
        icon: {
            fontSize: '16px'
        }
    };

    return (
        <div style={styles.container}>
            <span style={styles.icon}>{type === 'error' ? '⚠️' : '✅'}</span>
            {message}
        </div>
    );
};

export default Toast;
