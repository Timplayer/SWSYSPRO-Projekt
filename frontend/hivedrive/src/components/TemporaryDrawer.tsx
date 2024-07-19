import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Stack, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../../images/HiveDriveLogo.png'; 
import {Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  
  const CustomRouterLink = styled(RouterLink)(() => ({
    textDecoration: 'none',
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: "'Roboto Condensed', sans-serif",
    '&:hover': {
      color: '#646cff',
    },
  }));

  //Skalierung
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(min-width:600px) and (max-width:1200px)');
  const isLargeScreen = useMediaQuery('(min-width:1200px) and (max-width:2000px)');
  const isSuperLargeScreen = useMediaQuery('(min-width:2000px)');
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
          <CustomRouterLink
            to="/"
            sx={{ display: 'flex', alignItems: 'center', fontSize: 24 }}
          >
             <img src={logo} alt="Logo" style={{ height: 40, marginRight: 8 }} />
            {'HiveDrive'}
          </CustomRouterLink>
        </Box>
      </Stack>   
      <Divider />
      <Stack spacing={1}>
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <CustomRouterLink
          to="/subscription"
          sx = {{ color: 'black' }}
        >
          {'Hive-Abos'}
        </CustomRouterLink>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <CustomRouterLink
          to="/carclass"
          sx = {{ color: 'black' }}
        >
          {'Klassen Übersicht'}
        </CustomRouterLink>
      </Box> 
     
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <CustomRouterLink
          to="/bookingpage"
          sx = {{ color: 'black' }}
        >
          {'Auto Buchen'}
        </CustomRouterLink>
      </Box> 

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <CustomRouterLink
          to="/bonus"
          sx = {{ color: 'black' }}
        >
          {'Bonusprogramm'}
        </CustomRouterLink>
      </Box> 
    </Stack>
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
        sx={{ "& .MuiDrawer-paper": { backgroundColor: 'secondary.light' } }} 
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}
