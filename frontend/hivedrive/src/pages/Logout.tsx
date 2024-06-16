import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import keycloak from '../keycloak';

const Logout: React.FC = () => {
  useEffect(() => {
      keycloak.logout();
  }, []);

  return <Navigate to="/" />;
};

export default Logout;
