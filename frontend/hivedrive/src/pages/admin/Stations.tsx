import React, { useState, useEffect } from 'react';
import { Box, Button, List, ListItem, ListItemText, Typography, IconButton, Divider, Tabs, Tab, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const CustomTextField = styled(TextField)({
    '& .MuiInputBase-input': {
        color: 'white',
    },
    '& .MuiInputLabel-root': {
        color: 'white',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
    '& .MuiInputBase-input::placeholder': {
        color: 'white',
    },
});

const CustomTabs = styled(Tabs)({
    color: 'white',
    '& .MuiTab-root': {
        color: 'white',
    },
    '& .Mui-selected': {
        color: 'white',
    },
});

const CustomTab = styled(Tab)({
    color: 'white',
    '&.Mui-selected': {
        color: 'white',
    },
});

// Fix for default icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Station {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    state: string;
    city: string;
    zip: string;
    street: string;
    house_number: string;
    capacity: number;
}

const germanyBounds = [
    [47.2701114, 5.8663425], // Southwest coordinates
    [55.099161, 15.0419319]  // Northeast coordinates
];

const Stations: React.FC = () => {
    const [stations, setStations] = useState<Station[]>([]);
    const [stationName, setStationName] = useState<string>('');
    const [latitude, setLatitude] = useState<number>(51.1657); // Default latitude for Germany
    const [longitude, setLongitude] = useState<number>(10.4515); // Default longitude for Germany
    const [country, setCountry] = useState<string>('');
    const [state, setState] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [zip, setZip] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [houseNumber, setHouseNumber] = useState<string>('');
    const [capacity, setCapacity] = useState<number>(0);
    const [tabIndex, setTabIndex] = useState<number>(0);

    useEffect(() => {
        // Fetch stations from the backend
        axios.get('/api/stations')
            .then(response => {
                setStations(response.data);
            })
            .catch(error => {
                console.error('Error fetching stations:', error);
            });
    }, []);

    const handleAddStation = () => {
        const newStation = {
            name: stationName,
            latitude,
            longitude,
            country,
            state,
            city,
            zip,
            street,
            house_number: houseNumber,
            capacity,
        };

        axios.post('/api/stations', newStation)
            .then(response => {
                setStations([...stations, response.data]);
                setStationName('');
                setLatitude(51.1657);
                setLongitude(10.4515);
                setCountry('');
                setState('');
                setCity('');
                setZip('');
                setStreet('');
                setHouseNumber('');
                setCapacity(0);
            })
            .catch(error => {
                console.error('Error adding station:', error);
            });
    };

    const handleDeleteStation = (id: number) => {
        axios.delete(`/stations/${id}`)
            .then(() => {
                setStations(stations.filter(station => station.id !== id));
            })
            .catch(error => {
                console.error('Error deleting station:', error);
            });
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const SetMapBounds = () => {
        const map = useMap();
        map.fitBounds(germanyBounds);
        return null;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Stations
            </Typography>
            <CustomTabs value={tabIndex} onChange={handleTabChange}>
                <CustomTab label="Station List" />
                <CustomTab label="Map" />
            </CustomTabs>
            <Divider sx={{ mb: 2 }} />
            {tabIndex === 0 && (
                <Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        <CustomTextField
                            label="Station Name"
                            value={stationName}
                            onChange={(e) => setStationName(e.target.value)}
                            variant="outlined"
                            sx={{ minWidth: '200px' }}
                        />
                        <CustomTextField
                            label="Latitude"
                            type="number"
                            value={latitude}
                            onChange={(e) => setLatitude(parseFloat(e.target.value))}
                            variant="outlined"
                            sx={{ minWidth: '150px' }}
                        />
                        <CustomTextField
                            label="Longitude"
                            type="number"
                            value={longitude}
                            onChange={(e) => setLongitude(parseFloat(e.target.value))}
                            variant="outlined"
                            sx={{ minWidth: '150px' }}
                        />
                        <CustomTextField
                            label="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            variant="outlined"
                            sx={{ minWidth: '200px' }}
                        />
                        <CustomTextField
                            label="State"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            variant="outlined"
                            sx={{ minWidth: '200px' }}
                        />
                        <CustomTextField
                            label="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            variant="outlined"
                            sx={{ minWidth: '200px' }}
                        />
                        <CustomTextField
                            label="Zip"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            variant="outlined"
                            sx={{ minWidth: '200px' }}
                        />
                        <CustomTextField
                            label="Street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            variant="outlined"
                            sx={{ minWidth: '200px' }}
                        />
                        <CustomTextField
                            label="House Number"
                            value={houseNumber}
                            onChange={(e) => setHouseNumber(e.target.value)}
                            variant="outlined"
                            sx={{ minWidth: '150px' }}
                        />
                        <CustomTextField
                            label="Capacity"
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
                            variant="outlined"
                            sx={{ minWidth: '150px' }}
                        />
                        <Button variant="contained" color="primary" onClick={handleAddStation} sx={{ alignSelf: 'center' }}>
                            Add Station
                        </Button>
                    </Box>
                    <List>
                        {stations.map((station) => (
                            <ListItem key={station.id} secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteStation(station.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                                <ListItemText
                                    primary={station.name}
                                    secondary={
                                        <>
                                            Location: ({station.latitude}, {station.longitude})<br />
                                            Country: {station.country}, State: {station.state}, City: {station.city}, Zip: {station.zip}<br />
                                            Street: {station.street}, House Number: {station.house_number}<br />
                                            Capacity: {station.capacity}
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
            {tabIndex === 1 && (
                <MapContainer bounds={germanyBounds} style={{ height: '500px', width: '100%' }}>
                    <SetMapBounds />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {stations.map((station) => (
                        <Marker key={station.id} position={[station.latitude, station.longitude]}>
                            <Popup>
                                {station.name}<br />
                                Location: ({station.latitude}, {station.longitude})<br />
                                Country: {station.country}, State: {station.state}, City: {station.city}, Zip: {station.zip}<br />
                                Street: {station.street}, House Number: {station.house_number}<br />
                                Capacity: {station.capacity}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            )}
        </Box>
    );
};

export default Stations;
