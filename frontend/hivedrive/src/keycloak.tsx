import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://localhost:8080/auth/',
  realm: 'hivedrive',
  clientId: 'frontend'
});

export default keycloak;