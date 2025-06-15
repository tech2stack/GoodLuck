import React, { useEffect, useRef } from 'react';
import '../../styles/FlashMessage.css';
import { FaTimesCircle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const FlashMessage = ({ message, type, onClose, className }) => {
    const flashMessageRef = useRef(null);

    useEffect(() => {
        if (message) {
            // Optional: Focus on the message for accessibility when it appears
            flashMessageRef.current?.focus();
        }
    }, [message]);

    if (!message) return null;

    const icon = type === 'success' ? <FaCheckCircle /> :
                 type === 'error'   ? <FaTimesCircle /> :
                 type === 'warning' ? <FaExclamationCircle /> : null;

    return (
        <div
            ref={flashMessageRef}
            className={`flash-message ${type} ${className}`}
            role="alert"
            aria-live="assertive"
            tabIndex="-1" // Make it focusable
        >
            <div className="flash-message-content">
                {icon && <span className="flash-message-icon">{icon}</span>}
                <p className="flash-message-text">{message}</p>
            </div>
            {onClose && (
                <button onClick={onClose} className="flash-message-close-btn" aria-label="Close message">
                    &times;
                </button>
            )}
        </div>
    );
};

export default FlashMessage;