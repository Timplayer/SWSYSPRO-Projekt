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
import keycloak from '../../../keycloak';
import AddAvailability from './AddAvailability';
import { Station } from '../Stations/StationTypes';

const Vehicles: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [stations, setStation] = useState<Station[]>([]);

    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
    const [categories, setCategories] = useState<VehicleCategory[]>([]);
    const [producers, setProducers] = useState<Producer[]>([]);
    const [tabIndex, setTabIndex] = useState<number>(0);

    useEffect(() => {
        axios.get('/api/vehicles', 
            { 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => setVehicles(response.data))
            .catch(error => console.error('Error fetching vehicles:', error));

        axios.get('/api/vehicleTypes',
            { 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => setVehicleTypes(response.data))
            .catch(error => console.error('Error fetching vehicle types:', error));

        axios.get('/api/vehicleCategories',
            { 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching vehicle categories:', error));

        axios.get('/api/producers',{ 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => setProducers(response.data))
            .catch(error => console.error('Error fetching producers:', error));

        axios.get('/api/stations',{ 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => setStation(response.data))
            .catch(error => console.error('Error fetching producers:', error));
    }, []);

    const handleAddVehicle = (newVehicle: Omit<Vehicle, 'id'>): Promise<number> => {
        return axios.post('/api/vehicles', newVehicle, 
          { 
             headers: {
              Authorization: `Bearer ${keycloak.token}`,
              'Content-Type': 'application/json'
            }
          })
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
        return axios.post('/api/vehicleTypes', newVehicleType, 
            { 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log(response);
                setVehicleTypes([...vehicleTypes, response.data]);
                return response.data.id;
            })
            .catch(error => {
                console.error('Error adding vehicle type:', error);
                throw error;
            });
    };

    const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
        axios.put(`/api/vehicles`, updatedVehicle, { 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setVehicles(vehicles.map(vehicle => 
                    vehicle.id === updatedVehicle.id ? response.data : vehicle
                ));
            })
            .catch(error => console.error('Error updating vehicle:', error));
    };

    const handleUpdateVehicleType = (updatedVehicleType: VehicleType) => {
        axios.put(`/api/vehicleTypes`, updatedVehicleType, 
            { 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setVehicleTypes(vehicleTypes.map(vehicleType => 
                    vehicleType.id === updatedVehicleType.id ? response.data : vehicleType
                ));
            })
            .catch(error => console.error('Error updating vehicle type:', error));
    };

    const handleAddCategory = (name: string) => {
        const newCategory = { name };

        axios.post('/api/vehicleCategories', newCategory, 
            { 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setCategories([...categories, response.data]);
            })
            .catch(error => console.error('Error adding vehicle category:', error));
    };

    const handleUpdateCategory = (id: number, name: string) => {
        const updatedCategory = { id: id, name: name };

        axios.put(`/api/vehicleCategories`, updatedCategory,
            { 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setCategories(categories.map(category =>
                    category.id === id ? response.data : category
                ));
            })
            .catch(error => console.error('Error updating vehicle category:', error));
    };

    const handleAddProducer = (name: string) => {
        const newProducer = { name };

        axios.post('/api/producers', newProducer, { 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setProducers([...producers, response.data]);
            })
            .catch(error => console.error('Error adding producer:', error));
    };

    const handleUpdateProducer = (id: number, name: string) => {
        const updatedProducer = { name };

        axios.put(`/api/producers`, updatedProducer,
            { 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            })
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
            const response = await axios.get(`/api/images/vehicleTypes/id/${vehicleId}`, { 
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response);
            return response.data.map((img: { url: string }) => img.url);
        } catch (error) {
            console.log(error);
            return new Array<string>();
        }
    };

    const handleAddAvailability = async (data: { station: number; time: Date; auto_klasse: number }) => {
        try {
            const response = await axios.post('/api/stations/availability', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`
                }
            });
            if (response.status === 201) {
                console.log('Availability added successfully:', response.data);
            } else {
                console.error('Failed to add availability:', response.status, response.data);
            }
        } catch (error) {
            console.error('Error adding availability:', error);
        }
    };

    const uploadImage = async (vehicleId: number, image: File) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('file_name', image.name);
        formData.append('display_order', '0');

        await axios.post(`/api/images/vehicleTypes/id/${vehicleId}`, formData, {
            headers: { 
                Authorization: `Bearer ${keycloak.token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
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
                Fahrzeuge
            </Typography>
            <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab label="Fahrzeug Typen Liste" />
                <Tab label="Fahrzeug Type hinzufügen" />
                <Tab label="Fahrzeugkategorien" />
                <Tab label="Verfügbarkeit hinzufügen"/>
                <Tab label="Fahrzeugliste" />
                <Tab label="Fahrzeug hinzufügen" />
                <Tab label="Hersteller" />
            </Tabs>
            <Divider sx={{ mb: 2 }} />
            {tabIndex === 0 && (
                <VehicleTypeList
                    vehicleTypes={vehicleTypes}
                    categories={categories}
                    handleFetchImage={handleFetchImages}
                    handleUpdateVehicleType={handleUpdateVehicleType}
                    handleUploadImage={uploadImage}
                />
            )}
            {tabIndex === 1 && (
                <AddVehicleType
                    categories={categories}
                    handleAddVehicleType={handleAddVehicleType}
                    handleUploadImage={uploadImage}
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
                <AddAvailability
                    vehicleTypes={vehicleTypes}
                    stations={stations}
                    handleAddAvailability={handleAddAvailability}
                />
            )}
            {tabIndex === 4 && (
                <VehicleList
                    vehicles={vehicles}
                    vehicleTypes={vehicleTypes}
                    producers={producers}
                    handleFetchImage={handleFetchImages}
                    handleUpdateVehicle={handleUpdateVehicle}
                />
            )}
            {tabIndex === 5 && (
                <AddVehicle
                    vehicleTypes={vehicleTypes}
                    producers={producers}
                    handleAddVehicle={handleAddVehicle}
                />
            )}
            {tabIndex === 6 && (
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
