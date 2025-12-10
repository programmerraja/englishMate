import React from 'react';

const Tooltip = ({ x, y, onOpen }) => {
    return (
        <div
            className="em-tooltip"
            style={{ top: y, left: x }}
            onMouseDown={(e) => {
                e.preventDefault(); // Prevent text deselection
                e.stopPropagation();
                onOpen();
            }}
        >
            📖
        </div>
    );
};

export default Tooltip;
