import React, { useState } from 'react';
import { CssBaseline, Toolbar, Typography, Box, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Overview from "./admin/Overview.tsx";
import Vehicles from "./admin/Vehicles/Vehicles.tsx";
import Stations from "./admin/Stations/Stations.tsx";
import Reservations from './admin/Reservations.tsx';
import Users from './admin/Users.tsx';
import withRoot from '../withRoot.tsx';

const theme = createTheme({
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
const Admin: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState('Overview');

    const renderContent = () => {
        switch (selectedTab) {
            case 'Overview':
                return <Overview/>
            case 'Cars':
                return <Vehicles/>;
            case 'Stations':
                return <Stations/>;
            case 'Reservations':
                return <Reservations/>;
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
