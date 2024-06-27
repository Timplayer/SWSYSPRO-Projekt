import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
    message: string;
    show: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, show }) => {
    return (
        <div className={`error-message ${show ? 'show' : ''}`}>
            {message}
        </div>
    );
};

export default ErrorMessage;