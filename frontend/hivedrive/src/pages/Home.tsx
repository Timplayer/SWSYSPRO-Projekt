import React from 'react';
import keycloak from '../keycloak';


const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {keycloak.authenticated ? (
        <div>
            <h1>
            Account Page: <a href='/account'> Account Page</a>
            </h1>
            <p>You are logged in</p>
            <a href="/logout">Logout</a>
        </div>
      ) : (
        <div>
          <p>You are not logged in</p>
          <a href="/login">Login</a>
        </div>
      )}
    </div>
  );
};

export default Home;
