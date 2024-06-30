// AddStation.tsx
import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { Station } from './StationTypes';

interface AddStationProps {
    handleAddStation: (station: Omit<Station, 'id'>) => void;
}

const AddStation: React.FC<AddStationProps> = ({ handleAddStation }) => {
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

    const handleSubmit = () => {
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

        handleAddStation(newStation);
        
        // Reset form fields
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
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
                label="Station Name"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <TextField
                label="Latitude"
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                variant="outlined"
                sx={{ minWidth: '150px' }}
            />
            <TextField
                label="Longitude"
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                variant="outlined"
                sx={{ minWidth: '150px' }}
            />
            <TextField
                label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <TextField
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <TextField
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <TextField
                label="Zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <TextField
                label="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <TextField
                label="House Number"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '150px' }}
            />
            <TextField
                label="Capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
                variant="outlined"
                sx={{ minWidth: '150px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ alignSelf: 'center' }}>
                Add Station
            </Button>
        </Box>
    );
};

export default AddStation;
