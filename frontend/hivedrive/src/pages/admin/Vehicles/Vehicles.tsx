// Vehicles.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Divider, Typography, Tabs, Tab, createTheme } from '@mui/material';
import VehicleList from './VehicleList';
import AddVehicle from './AddVehicle';
import VehicleCategories from './VehicleCategories';
import Producers from './Producers';
import { Vehicle, VehicleCategory, Producer, VehicleType } from './VehicleDataTypes';
import AddVehicleType from './AddVehicleType';
import VehicleTypeList from './VehicleTypeList';
import { ThemeProvider } from '@emotion/react';

const Vehicles: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
    const [categories, setCategories] = useState<VehicleCategory[]>([]);
    const [producers, setProducers] = useState<Producer[]>([]);
    const [tabIndex, setTabIndex] = useState<number>(0);

    useEffect(() => {
        axios.get('/api/vehicles')
            .then(response => setVehicles(response.data))
            .catch(error => console.error('Error fetching vehicles:', error));

        axios.get('/api/vehicleTypes')
            .then(response => setVehicleTypes(response.data))
            .catch(error => console.error('Error fetching vehicle types:', error));

        axios.get('/api/vehicleCategories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching vehicle categories:', error));

        axios.get('/api/producers')
            .then(response => setProducers(response.data))
            .catch(error => console.error('Error fetching producers:', error));
    }, []);

    const handleAddVehicle = (newVehicle: Omit<Vehicle, 'id'>): Promise<number> => {
        return axios.post('/api/vehicles', newVehicle)
            .then(response => {
                setVehicles([...vehicles, response.data]);
                return response.data.id;
            })
            .catch(error => {
                console.error('Error adding vehicle:', error);
                throw error;
            });
    };

    const handleAddVehicleType = (newVehicleType: Omit<VehicleType, 'id'>): Promise<number> => {
        return axios.post('/api/vehicleTypes', newVehicleType)
            .then(response => {
                setVehicleTypes([...vehicleTypes, response.data]);
                return response.data.id;
            })
            .catch(error => {
                console.error('Error adding vehicle type:', error);
                throw error;
            });
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

    const handleUpdateVehicleType = (updatedVehicleType: VehicleType) => {
        axios.put(`/api/vehicleTypes/id/${updatedVehicleType.id}`, updatedVehicleType)
            .then(response => {
                setVehicleTypes(vehicleTypes.map(vehicleType => 
                    vehicleType.id === updatedVehicleType.id ? response.data : vehicleType
                ));
            })
            .catch(error => console.error('Error updating vehicle type:', error));
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

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
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

    const handleFetchVehicleTypeImages = async (vehicleTypeId: number) => {
        try {
            const response = await axios.get(`/api/images/vehicleTypes/id/${vehicleTypeId}`);
            var urls = new Array<string>();
            urls.push(response.data.url);
            return urls;
        } catch (error) {
            return new Array<string>();
        }
    };

    const theme = createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: '#121212'
            },
            text: {
                primary: '#ffffff',
                secondary: '#ffffff'
            }
        }
    });

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{ p: 3, color: "#ffffff" }}>
            <Typography variant="h4" gutterBottom>
                Vehicles
            </Typography>
            <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab label="Fahrzeugliste" />
                <Tab label="Fahrzeug hinzufügen" />
                <Tab label="Fahrzeug Type hinzufügen" />
                <Tab label="Fahrzeug Typen Liste" />
                <Tab label="Fahrzeugkategorien" />
                <Tab label="Hersteller" />
            </Tabs>
            <Divider sx={{ mb: 2 }} />
            {tabIndex === 0 && (
                <VehicleList
                    vehicles={vehicles}
                    vehicleTypes={vehicleTypes}
                    producers={producers}
                    handleFetchImage={handleFetchImages}
                    handleUpdateVehicle={handleUpdateVehicle}
                />
            )}
            {tabIndex === 1 && (
                <AddVehicle
                    vehicleTypes={vehicleTypes}
                    producers={producers}
                    handleAddVehicle={handleAddVehicle}
                />
            )}
            {tabIndex === 2 && (
                <AddVehicleType
                    categories={categories}
                    handleAddVehicleType={handleAddVehicleType}
                />
            )}
            {tabIndex === 3 && (
                <VehicleTypeList
                    vehicleTypes={vehicleTypes}
                    categories={categories}
                    handleFetchImage={handleFetchVehicleTypeImages}
                    handleUpdateVehicleType={handleUpdateVehicleType}
                />
            )}
            {tabIndex === 4 && (
                <VehicleCategories
                    categories={categories}
                    handleAddCategory={handleAddCategory}
                    handleUpdateCategory={handleUpdateCategory}
                />
            )}
            {tabIndex === 5 && (
                <Producers
                    producers={producers}
                    handleAddProducer={handleAddProducer}
                    handleUpdateProducer={handleUpdateProducer}
                />
            )}
        </Box>
        </ThemeProvider>
    );
};

export default Vehicles;
