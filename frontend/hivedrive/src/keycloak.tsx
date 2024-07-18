import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: '/auth/',
  realm: 'hivedrive',
  clientId: 'frontend'
});

keycloak.onTokenExpired = () => {  
  keycloak.updateToken(30).catch((error) => {
    console.error('Failed to refresh token', error);
  });
};

export default keycloak;
