import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '../components/AppBar';
import Toolbar from '../components/Toolbar';
import TemporaryDrawer from '../components/TemporaryDrawer';
import logo from '../../images/HiveDriveLogo.png'; // Pfad zum Logo
import keycloak from '../keycloak';
import AccountManagement from '../components/Accountmanagement';

const rightLink = {
  fontSize: 16,
  color: 'common.white',
  ml: 3,
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
              href="/login"
              sx={rightLink}
            >
              {'Sign In'}
            </Link>
            <Link
              variant="h6"
              underline="none"
              href="/register"    //jeweils sign in und up ändern
              sx={{ ...rightLink, color: 'secondary.main' }}
            >
              {'Sign Up'}
            </Link>
          </Box>
          )}
          {keycloak.authenticated && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <AccountManagement/>
            <Link
              variant="h6"
              underline="none"
              href="/signout"    
              sx={{ ...rightLink, color: 'secondary.main' }}
            >
              {'Sign Out'}
            </Link>
          </Box>
           )}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}></Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default AppAppBar;
