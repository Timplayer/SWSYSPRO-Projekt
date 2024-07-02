import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '../components/AppBar';
import Toolbar from '../components/Toolbar';
import TemporaryDrawer from '../components/TemporaryDrawer';
import logo from '../../images/HiveDriveLogo.png'; // Pfad zum Logo
import keycloak from '../keycloak';
import AccountManagement from '../components/Accountmanagement';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';


function checkAdminRole() {
  if (keycloak.tokenParsed && keycloak.tokenParsed.realm_access){
  if (keycloak.tokenParsed.realm_access?.roles.includes('admin') ) {
    return true;
  }
}
  return false;
}

const rightLink = {
  fontSize: 16,
  color: 'common.white',
  ml: 3,
};

const handleLogout = (event: { preventDefault: () => void; }) => {
  event.preventDefault();
  keycloak.logout();
};

function AppAppBar() {
  return (
    <div>
      <AppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}></Box>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <TemporaryDrawer />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ height: 40, marginRight: 8 }} />
            <Link
              variant="h6"
              underline="none"
              color="inherit"
              href="/"
              sx={{ fontSize: 24 }}
            >
              {'HiveDrive'}
            </Link>
          </Box>
          {!keycloak.authenticated && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              href={keycloak.createLoginUrl()}
              sx={rightLink}
            >
              {'Sign In'}
            </Link>
            <Link
              variant="h6"
              underline="none"
              href={keycloak.createRegisterUrl()}    
              sx={{ ...rightLink, color: 'secondary.main' }}
            >
              {'Sign Up'}
            </Link>
          </Box>
          )}
          {keycloak.authenticated && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <AccountManagement/>
            <Button
              variant="text"
              onClick={handleLogout}
              sx={{ ...rightLink, color: 'secondary.main' }}
            >
              {'Sign Out'}
            </Button>
          </Box>
           )}

          {checkAdminRole() && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button
              variant="text"
              component={RouterLink}
              to="/admin" 
              sx={{ ...rightLink, color: 'secondary.main' }}
            >
              {'Adminpage'}
            </Button>
          </Box>
           )}


          {!checkAdminRole() && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}></Box>
          )}   

        </Toolbar>
      </AppBar>
    </div>
  );
}

export default AppAppBar;
