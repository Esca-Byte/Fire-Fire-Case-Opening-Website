import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--ff-bg-card)',
                padding: '2rem',
                borderRadius: '16px',
                maxWidth: '500px',
                width: '90%',
                border: '1px solid var(--ff-orange)',
                position: 'relative',
                boxShadow: '0 0 30px rgba(255, 140, 0, 0.2)'
            }} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                }}>&times;</button>

                {title && <h2 style={{ marginTop: 0, color: 'var(--ff-orange)', textTransform: 'uppercase' }}>{title}</h2>}

                <div style={{ marginTop: '1rem' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
