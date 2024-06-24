import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Link, Stack, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../../images/HiveDriveLogo.png'; // Pfad zum Logo

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
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center'}}>
          <IconButton aria-label="close">
            <CloseIcon 
            sx={{ fontSize: 24, color: '#FFFFFF' }}
            />
          </IconButton> 
          <img src={logo} alt="Logo" style={{ height: 40, marginRight: 8 }} />
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            href="/"
            sx={{ fontSize: 24, color: '#FFFFFF' }}
          >
            {'HiveDrive'}
          </Link>
        </Box>
      </Stack>   
      <Divider />

      
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center'}}>
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            href="/subscription"
            sx={{ fontSize: 24, color: '#FFFFFF' }}
          >
            {'Hive-Abos'}
          </Link>
        </Box>

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center'}}>
        <Link
          variant="h6"
          underline="none"
          color="inherit"
          href="/carclass"
          sx={{ fontSize: 24, color: '#FFFFFF' }}
        >
          {'Klassen Übersicht'}
        </Link>
      </Box> 
     
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center'}}>
        <Link
          variant="h6"
          underline="none"
          color="inherit"
          href="/bookingpage"
          sx={{ fontSize: 24, color: '#FFFFFF' }}
        >
          {'Auto Buchen'}
        </Link>
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
