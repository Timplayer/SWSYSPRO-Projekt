import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, Toolbar, Box, Avatar } from '@mui/material';
import {Home, CarRental, EvStation, EventNote, AccountBox} from '@mui/icons-material';
import Logo from '../assets/HiveDriveLogo.jpeg'; // Update the path to where your logo is located
import Users from '../pages/admin/Users';

const drawerWidth = 240;

export interface TabItem {
    key: string;
    label: string;
    icon: React.ReactNode;
}

export const tabs: TabItem[] = [
    { key: 'Overview', label: 'Übersicht', icon: <Home /> },
    { key: 'Cars', label: 'Autos', icon: <CarRental /> },
    { key: 'Stations', label: 'Stationen', icon: <EvStation /> },
    { key: 'Accounts', label: 'Konten', icon: <AccountBox /> },

];


interface SidebarProps {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
}


const Sidebar: React.FC<SidebarProps> = ({ selectedTab, setSelectedTab }) => {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#001927', color: '#fff' },
            }}
        >
            <Toolbar>
                <Avatar variant="square" src={Logo} sx={{ width: '100%', height: 'auto', margin: '0 auto' }} />
            </Toolbar>
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {tabs.map((tab: TabItem) => (
                        <ListItem button key={tab.key} selected={selectedTab === tab.key} onClick={() => setSelectedTab(tab.key)}>
                            <ListItemIcon>
                                {React.cloneElement(tab.icon as React.ReactElement, { sx: { color: selectedTab === tab.key ? '#F6AD55' : '#fff' } })}
                            </ListItemIcon>
                            <ListItemText primary={tab.label} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
