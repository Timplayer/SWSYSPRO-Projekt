import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import keycloak from '../keycloak';

const Login: React.FC = () => {
  useEffect(() => {
    if (!keycloak.authenticated) {
      keycloak.login();
    }
  }, []);

  return <Navigate to="/" />;
};

export default Login;
