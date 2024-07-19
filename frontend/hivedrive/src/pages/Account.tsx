import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import keycloak from '../keycloak';

const Account: React.FC = () => {
  useEffect(() => {
        window.location.href = keycloak.createAccountUrl();
  }, []);

  return <Navigate to="/" />;
};

export default Account;
