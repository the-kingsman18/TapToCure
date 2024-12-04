import React from 'react';
import styles from './LoginModal.module.css';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
    if (!isOpen) return null; // Don't render if modal is not open

    return (
        <div className={styles.modaloverlay} onClick={onClose}>
            <div className={styles.modalcontent} onClick={(e) => e.stopPropagation()}>
                <h2>Login Required</h2>
                <p>You must be logged in to book an appointment.</p>
                <div className={styles.buttoncontainer}>
                    <button className={styles.buttons} onClick={onLogin}>Login</button>
                    <button className={styles.buttons} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
