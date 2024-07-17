// Stations.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import StationList from './StationsList';
import AddStation from './AddStation';
import { Station } from './StationTypes';
import keycloak from '../../../keycloak';


const Stations: React.FC = () => {
    const [stations, setStations] = useState<Station[]>([]);
    const [tabIndex, setTabIndex] = useState<number>(0);

    useEffect(() => {
        axios.get('/api/stations', { 
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => setStations(response.data))
        .catch(error => console.error('Error fetching stations:', error));

    }, []);

    const handleAddStation = (newStation: Omit<Station, 'id'>) => {
        axios.post('/api/stations', newStation, { 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => { setStations([...stations, response.data]); })
            .catch(error => console.error('Error adding station:', error));
    };

    const handleEditStation = (new_station: Station) => {
        axios.put(`/api/stations`, new_station, { 
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {  
                setStations(stations.map(station =>
                    station.id === new_station.id ? response.data : station
                ));
            })
            .catch(error => console.error('Error editing station:', error));
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Stationen
            </Typography>
            <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab label="Station Liste" />
                <Tab label="Station hinzufügen" />
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
