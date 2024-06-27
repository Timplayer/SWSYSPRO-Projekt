import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Stack, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../../images/HiveDriveLogo.png'; // Pfad zum Logo
import {Link as RouterLink } from 'react-router-dom';

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  
  // Media query hooks to determine screen size
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(min-width:600px) and (max-width:1200px)');
  const isLargeScreen = useMediaQuery('(min-width:1200px) and (max-width:2000px)');
  const isSuperLargeScreen = useMediaQuery('(min-width:2000px)');
  
  // Determine drawer width based on screen size
  const drawerWidth = isSmallScreen ? 200 : isMediumScreen ? 300 : isLargeScreen ? 400 : isSuperLargeScreen ? 500 : 250;

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: drawerWidth }} role="presentation" onClick={toggleDrawer(false)}>
      <Stack spacing={2} direction="row" sx={{ backgroundColor: '#021927', padding: '16px' }}>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <IconButton aria-label="close" onClick={toggleDrawer(false)}>
            <CloseIcon sx={{ fontSize: 24, color: '#FFFFFF' }} />
          </IconButton>
          <img src={logo} alt="Logo" style={{ height: 40, marginRight: 8 }} />
          <RouterLink
            to="/"
            style={{ textDecoration: 'none', fontSize: 24, color: '#FFFFFF' }}
          >
            {'HiveDrive'}
          </RouterLink>
        </Box>
      </Stack>   
      <Divider />

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <RouterLink
          to="/subscription"
          style={{ textDecoration: 'none', fontSize: 24, color: '#FFFFFF' }}
        >
          {'Hive-Abos'}
        </RouterLink>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <RouterLink
          to="/carclass"
          style={{ textDecoration: 'none', fontSize: 24, color: '#FFFFFF' }}
        >
          {'Klassen Übersicht'}
        </RouterLink>
      </Box> 
     
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <RouterLink
          to="/bookingpage"
          style={{ textDecoration: 'none', fontSize: 24, color: '#FFFFFF' }}
        >
          {'Auto Buchen'}
        </RouterLink>
      </Box> 

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <RouterLink
          to="/bonus"
          style={{ textDecoration: 'none', fontSize: 24, color: '#FFFFFF' }}
        >
          {'Bonusprogramm'}
        </RouterLink>
      </Box> 
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <MenuIcon sx={{ color: 'white' }} />
      </Button>
      <Drawer 
        open={open} 
        onClose={toggleDrawer(false)}
        sx={{ "& .MuiDrawer-paper": { backgroundColor: 'secondary.light' } }} // Hier ändere die Hintergrundfarbe
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}
