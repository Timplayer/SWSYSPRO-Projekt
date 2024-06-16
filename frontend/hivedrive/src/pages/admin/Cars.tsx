import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemText, Typography, IconButton, Divider, Tabs, Tab, TextField, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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

interface Car {
    id: number;
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
    stationId: number;
}

const Cars: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [make, setMake] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [year, setYear] = useState<number>(2020);
    const [color, setColor] = useState<string>('');
    const [licensePlate, setLicensePlate] = useState<string>('');
    const [stationId, setStationId] = useState<number>(0);
    const [nextId, setNextId] = useState<number>(1);
    const [tabIndex, setTabIndex] = useState<number>(0);

    const handleAddCar = () => {
        if (make.trim() && model.trim() && !isNaN(year) && color.trim() && licensePlate.trim() && !isNaN(stationId)) {
            setCars([...cars, {
                id: nextId,
                make,
                model,
                year,
                color,
                licensePlate,
                stationId,
            }]);
            setMake('');
            setModel('');
            setYear(2020);
            setColor('');
            setLicensePlate('');
            setStationId(0);
            setNextId(nextId + 1);
        }
    };

    const handleDeleteCar = (id: number) => {
        setCars(cars.filter(car => car.id !== id));
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Cars
            </Typography>
            <CustomTabs value={tabIndex} onChange={handleTabChange}>
                <CustomTab label="Car List" />
                <CustomTab label="Add Car" />
            </CustomTabs>
            <Divider sx={{ mb: 2 }} />
            {tabIndex === 0 && (
                <Box>
                    <List>
                        {cars.map((car) => (
                            <ListItem key={car.id} secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCar(car.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                                <ListItemText
                                    primary={`${car.make} ${car.model} (${car.year})`}
                                    secondary={
                                        <>
                                            Color: {car.color}<br />
                                            License Plate: {car.licensePlate}<br />
                                            Station ID: {car.stationId}
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
            {tabIndex === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <CustomTextField
                        label="Make"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        variant="outlined"
                        sx={{ minWidth: '200px' }}
                    />
                    <CustomTextField
                        label="Model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        variant="outlined"
                        sx={{ minWidth: '200px' }}
                    />
                    <CustomTextField
                        label="Year"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value, 10))}
                        variant="outlined"
                        sx={{ minWidth: '150px' }}
                    />
                    <CustomTextField
                        label="Color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        variant="outlined"
                        sx={{ minWidth: '150px' }}
                    />
                    <CustomTextField
                        label="License Plate"
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                        variant="outlined"
                        sx={{ minWidth: '200px' }}
                    />
                    <CustomTextField
                        label="Station ID"
                        type="number"
                        value={stationId}
                        onChange={(e) => setStationId(parseInt(e.target.value, 10))}
                        variant="outlined"
                        sx={{ minWidth: '150px' }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddCar} sx={{ alignSelf: 'center' }}>
                        Add Car
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Cars;
