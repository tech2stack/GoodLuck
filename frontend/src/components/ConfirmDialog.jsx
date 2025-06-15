// frontend/src/components/ConfirmDialog.js
import React from 'react';
import '../styles/ConfirmDialog.css'; // You'll create this CSS file next

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirm-dialog-overlay">
            <div className="confirm-dialog-content">
                <p>{message}</p>
                <div className="confirm-dialog-actions">
                    <button className="btn btn-cancel" onClick={onCancel}>Cancel</button>
                    <button className="btn btn-confirm" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;