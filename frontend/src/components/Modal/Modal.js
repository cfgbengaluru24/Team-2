import React from 'react';

const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{title}</h2>
                <div className="modal-content">{children}</div>
                <button onClick={onClose} className="btn btn-close">Close</button>
            </div>
        </div>
    );
};

export default Modal;
