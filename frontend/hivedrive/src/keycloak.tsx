import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: '/auth/',
  realm: 'hivedrive',
  clientId: 'frontend'
});

export default keycloak;