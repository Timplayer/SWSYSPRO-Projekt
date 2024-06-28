// Vehicles.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Divider, Typography, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import VehicleList from './VehicleList';
import AddVehicle from './AddVehicle';
import VehicleCategories from './VehicleCategories';
import Producers from './Producers';
import { Vehicle, VehicleCategory, Producer } from './types';

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

const Vehicles: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [categories, setCategories] = useState<VehicleCategory[]>([]);
    const [producers, setProducers] = useState<Producer[]>([]);
    const [tabIndex, setTabIndex] = useState<number>(0);

    useEffect(() => {
        axios.get('/api/vehicles')
            .then(response => setVehicles(response.data))
            .catch(error => console.error('Error fetching vehicles:', error));
        
        axios.get('/api/vehicleCategories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching vehicle categories:', error));
        
        axios.get('/api/producers')
            .then(response => setProducers(response.data))
            .catch(error => console.error('Error fetching producers:', error));
    }, []);

    const handleAddVehicle = (newVehicle: Omit<Vehicle, 'id'>) => {
        axios.post('/api/vehicles', newVehicle)
            .then(response => {
                setVehicles([...vehicles, response.data]);
            })
            .catch(error => console.error('Error adding vehicle:', error));
    };

    const handleAddCategory = (name: string) => {
        const newCategory = { name };

        axios.post('/api/vehicleCategories', newCategory)
            .then(response => {
                setCategories([...categories, response.data]);
            })
            .catch(error => console.error('Error adding vehicle category:', error));
    };

    const handleAddProducer = (name: string) => {
        const newProducer = { name };

        axios.post('/api/producers', newProducer)
            .then(response => {
                setProducers([...producers, response.data]);
            })
            .catch(error => console.error('Error adding producer:', error));
    };

    const handleDeleteVehicle = (id: number) => {
        axios.delete(`/api/vehicles/${id}`)
            .then(() => {
                setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
            })
            .catch(error => console.error('Error deleting vehicle:', error));
    };

    const handleDeleteCategory = (id: number) => {
        axios.delete(`/api/vehicleCategories/id/${id}`)
            .then(() => {
                setCategories(categories.filter(category => category.id !== id));
            })
            .catch(error => console.error('Error deleting vehicle category:', error));
    };

    const handleDeleteProducer = (id: number) => {
        axios.delete(`/api/producers/id/${id}`)
            .then(() => {
                setProducers(producers.filter(producer => producer.id !== id));
            })
            .catch(error => console.error('Error deleting producer:', error));
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Vehicles
            </Typography>
            <CustomTabs value={tabIndex} onChange={handleTabChange}>
                <CustomTab label="Vehicle List" />
                <CustomTab label="Add Vehicle" />
                <CustomTab label="Vehicle Categories" />
                <CustomTab label="Producers" />
            </CustomTabs>
            <Divider sx={{ mb: 2 }} />
            {tabIndex === 0 && (
                <VehicleList
                    vehicles={vehicles}
                    categories={categories}
                    producers={producers}
                    handleDeleteVehicle={handleDeleteVehicle}
                />
            )}
            {tabIndex === 1 && (
                <AddVehicle
                    categories={categories}
                    producers={producers}
                    handleAddVehicle={handleAddVehicle}
                />
            )}
            {tabIndex === 2 && (
                <VehicleCategories
                    categories={categories}
                    handleAddCategory={handleAddCategory}
                    handleDeleteCategory={handleDeleteCategory}
                />
            )}
            {tabIndex === 3 && (
                <Producers
                    producers={producers}
                    handleAddProducer={handleAddProducer}
                    handleDeleteProducer={handleDeleteProducer}
                />
            )}
        </Box>
    );
};

export default Vehicles;
