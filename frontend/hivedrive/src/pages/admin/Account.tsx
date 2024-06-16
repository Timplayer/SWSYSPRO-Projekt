import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import keycloak from '../../keycloak';

const Account: React.FC = () => {
    const handleAccountManagement = () => {
        window.location.href = keycloak.createAccountUrl();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Account Management
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAccountManagement}>
                Manage Account
            </Button>
        </Box>
    );
};

export default Account;
