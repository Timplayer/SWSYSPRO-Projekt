import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import keycloak from '../keycloak';


export default function AccountManagement() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (settingLink: string) => {
    setAnchorElUser(null);
    console.log(settingLink);
    if (settingLink) {
      if (settingLink.startsWith('/auth')) {
        window.location.href = settingLink; // External URL navigation
       
      } else {
        navigate(settingLink); // Internal navigation
      }
    }
  };

  const settings = [
    { name: 'Buchungen', link: '/mybookings' },
    { name: 'Abos', link: '/subscription' },
    { name: 'Persönliche Daten', link: keycloak.createAccountUrl() },
    { name: 'Hilfe', link: '/help' },
    { name: 'Abmelden', link: '/logout' },
  ];

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <AccountCircleIcon fontSize="large" style={{ color: 'white' }} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={() => handleCloseUserMenu('')}
      >
        {settings.map((setting) => (
          <MenuItem key={setting.name} onClick={() => handleCloseUserMenu(setting.link)}>
            <Typography textAlign="center">{setting.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
