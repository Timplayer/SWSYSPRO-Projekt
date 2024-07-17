import React, {useEffect} from 'react';
import { Navigate  } from 'react-router-dom';
import keycloak from './keycloak';
import { useErrorMessage } from './Utils/ErrorMessageContext';

interface ProtectedRouteProps {
    element: React.ReactElement;
    requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Component, requiredRoles  }) => {
  
    const { showMessage } = useErrorMessage();

    useEffect(() => {
        if (!keycloak.authenticated || (requiredRoles && !requiredRoles.some(role => keycloak.hasRealmRole(role)))) {
            showMessage("You are not authorized to see this page.");
        }
    }, [requiredRoles, showMessage]);

    if (!keycloak.authenticated) {
        return <Navigate to="/" replace={true} />;
    }

    if (requiredRoles && !requiredRoles.some(role => keycloak.hasRealmRole(role))) {
        return <Navigate to="/" replace={true} />;
    }

    return Component;
};

export default ProtectedRoute;
