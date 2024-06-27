import React, { createContext, useContext, useState, useMemo  } from 'react';
import ErrorMessage from './ErrorMessage';

interface ErrorMessageContextProps {
    showMessage: (message: string) => void;
}

const ErrorMessageContext = createContext<ErrorMessageContextProps | undefined>(undefined);

export const useErrorMessage = () => {
    const context = useContext(ErrorMessageContext);
    if (!context) {
        throw new Error('useErrorMessage must be used within an ErrorMessageProvider');
    }
    return context;
};

export const ErrorMessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState('');
    const [show, setShow] = useState(false);

    const showMessage = useMemo(() => (msg: string) => {
        setMessage(msg);
        setShow(true);
        setTimeout(() => setShow(false), 3000);
    }, []);

    return (
        <ErrorMessageContext.Provider value={{ showMessage }}>
            {children}
            <ErrorMessage message={message} show={show} />
        </ErrorMessageContext.Provider>
    );
};
