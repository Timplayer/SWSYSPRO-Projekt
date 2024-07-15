// Stations.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import StationList from './StationsList';
import AddStation from './AddStation';
import { Station } from './StationTypes';


const Stations: React.FC = () => {
    const [stations, setStations] = useState<Station[]>([]);
    const [tabIndex, setTabIndex] = useState<number>(0);

    useEffect(() => {
        axios.get('/api/stations')
            .then(response => setStations(response.data))
            .catch(error => console.error('Error fetching stations:', error));
    }, []);

    const handleAddStation = (newStation: Omit<Station, 'id'>) => {
        axios.post('/api/stations', newStation)
            .then(response => {
                setStations([...stations, response.data]);
            })
            .catch(error => console.error('Error adding station:', error));
    };

    const handleEditStation = (id: number) => {
        axios.delete(`/api/stations/id/${id}`)
            .then(() => {
                setStations(stations.filter(station => station.id !== id));
            })
            .catch(error => console.error('Error deleting station:', error));
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Stations
            </Typography>
            <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab label="Station List" />
                <Tab label="Add Station" />
            </Tabs>
            <Divider sx={{ mb: 2 }} />
            {tabIndex === 0 && (
                <StationList
                    stations={stations}
                    handleEditStation={handleEditStation}
                />
            )}
            {tabIndex === 1 && (
                <AddStation
                    handleAddStation={handleAddStation}
                />
            )}
        </Box>
    );
};

export default Stations;