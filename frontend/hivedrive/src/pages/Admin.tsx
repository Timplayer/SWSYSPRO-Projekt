import React, { useState } from 'react';
import { CssBaseline, Toolbar, Typography, Box, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Overview from "./admin/Overview.tsx";
import Vehicles from "./admin/Vehicles/Vehicles.tsx";
import Stations from "./admin/Stations/Stations.tsx";
import Users from './admin/Users.tsx';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212'
        },
        text: {
            primary: '#ffffff',
            secondary: '#aaaaaa'
        }
    }
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#ffffff'
        },
        text: {
            primary: '#000000',
            secondary: '#555555'
        }
    }
});


const Admin: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState('Overview');

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = prefersDarkMode ? darkTheme : lightTheme;

    const renderContent = () => {
        switch (selectedTab) {
            case 'Overview':
                return <Overview/>
            case 'Cars':
                return <Vehicles/>;
            case 'Stations':
                return <Stations/>;
            case 'Accounts':
                return <Users/>
            case 'Error':
                return <Typography paragraph>Error Content</Typography>;
            default:
                return <Typography paragraph>Overview Content</Typography>;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    {renderContent()}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Admin;
