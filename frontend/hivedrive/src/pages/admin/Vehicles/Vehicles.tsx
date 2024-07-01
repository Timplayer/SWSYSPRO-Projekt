// Vehicles.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Divider, Typography, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import VehicleList from './VehicleList';
import AddVehicle from './AddVehicle';
import VehicleCategories from './VehicleCategories';
import Producers from './Producers';
import { Vehicle, VehicleCategory, Producer } from './VehicleTypes';
import keycloak from '../../../keycloak';


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

    const handleAddVehicle = (newVehicle: Omit<Vehicle, 'id'>) : Promise<number> => {
        
        return axios.post('/api/vehicles', newVehicle)
            .then(response => {
                setVehicles([...vehicles, response.data]);
                return response.data.id;
            })
            .catch(error => console.error('Error adding vehicle:', error));

    };

    const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
        axios.put(`/api/vehicles/id/${updatedVehicle.id}`, updatedVehicle)
            .then(response => {
                setVehicles(vehicles.map(vehicle => 
                    vehicle.id === updatedVehicle.id ? response.data : vehicle
                ));
            })
            .catch(error => console.error('Error updating vehicle:', error));
    };
    

    const handleAddCategory = (name: string) => {
        const newCategory = { name };

        axios.post('/api/vehicleCategories', newCategory)
            .then(response => {
                setCategories([...categories, response.data]);
            })
            .catch(error => console.error('Error adding vehicle category:', error));
    };

    const handleUpdateCategory = (id: number, name: string) => {
        const updatedCategory = { id, name };

        axios.put(`/api/vehicleCategories/id/${id}`, updatedCategory)
            .then(response => {
                setCategories(categories.map(category =>
                    category.id === id ? response.data : category
                ));
            })
            .catch(error => console.error('Error updating vehicle category:', error));
    };

    const handleAddProducer = (name: string) => {
        const newProducer = { name };

        axios.post('/api/producers', newProducer)
            .then(response => {
                setProducers([...producers, response.data]);
            })
            .catch(error => console.error('Error adding producer:', error));
    };

    const handleUpdateProducer = (id: number, name: string) => {
        const updatedProducer = { name };
    
        axios.put(`/api/producers/id/${id}`, updatedProducer)
            .then(response => {
                setProducers(producers.map(producer =>
                    producer.id === id ? { ...producer, name: response.data.name } : producer
                ));
            })
            .catch(error => console.error('Error updating producer:', error));
    };
    
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleFetchImages = async (vehicleId: number) => {
        try {
            const response = await axios.get(`/api/images/vehicles/id/${vehicleId}`);
            var urls = new Array<string>();
            urls.push(response.data.url);
            return urls;
        } catch (error) {
            return new Array<string>();
        }
    };

    return (
        <Box sx={{ p: 3, color: "#ffffff" }}>
            <Typography variant="h4" gutterBottom>
                Vehicles
            </Typography>
            <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab label="Fahrzeugliste" />
                <Tab label="Fahrzeug hinzufügen" />
                <Tab label="Fahrzeugkategorien" />
                <Tab label="Hersteller" />
            </Tabs>
            <Divider sx={{ mb: 2 }} />
            {tabIndex === 0 && (
                <VehicleList
                    vehicles={vehicles}
                    categories={categories}
                    producers={producers}
                    handleFetchImage={handleFetchImages}
                    handleUpdateVehicle={handleUpdateVehicle}
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
                    handleUpdateCategory={handleUpdateCategory}
                />
            )}
            {tabIndex === 3 && (
                <Producers
                    producers={producers}
                    handleAddProducer={handleAddProducer}
                    handleUpdateProducer={handleUpdateProducer}
                />
            )}
        </Box>
    );
};

export default Vehicles;
