import React, { useState } from 'react';
import { CssBaseline, Toolbar, Typography, Box, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Overview from "./admin/Overview.tsx";
import Cars from "./admin/Cars.tsx";
import Stations from "./admin/Stations.tsx";
import Reservations from './admin/Reservations.tsx';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1A202C',
        },
        secondary: {
            main: '#F6AD55',
        },
        background: {
            default: '#1A202C',
            paper: '#1A202C',
        },
        text: {
            primary: '#fff',
        },
    },
});

const App: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState('Overview');

    const renderContent = () => {
        switch (selectedTab) {
            case 'Overview':
                return <Overview/>
            case 'Cars':
                return <Cars/>;
            case 'Stations':
                return <Stations/>;
            case 'Reservations':
                return <Reservations/>;
            case 'Account':
                return <Typography paragraph>Account Content</Typography>;
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

export default App;
