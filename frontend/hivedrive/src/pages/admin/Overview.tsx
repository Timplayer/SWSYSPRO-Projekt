import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Grid, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CustomPaper = styled(Paper)({
    padding: '20px',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#3f51b5',
});

// Fix for default icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Overview: React.FC = () => {
    const [stationsCount, setStationsCount] = useState<number>(0);
    const [vehiclesCount, setVehiclesCount] = useState<number>(0);
    const [categoriesCount, setCategoriesCount] = useState<number>(0);
    const [producersCount, setProducersCount] = useState<number>(0);
    const [vehicleTypes, setVehicleTypes] = useState<number>(0);

    const [stations, setStations] = useState<any[]>([]);
    const [availabilities, setAvailabilities] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        axios.get('/api/stations')
            .then(response => {
                setStationsCount(response.data.length);
                setStations(response.data);

                response.data.forEach((station: any) => {
                    axios.get(`/api/stations/id/${station.id}/availability`)
                        .then(res => {
                            const totalAvailability = res.data.reduce((sum: number, current: any) => sum + current.availability, 0);
                            setAvailabilities(prev => ({ ...prev, [station.id]: totalAvailability }));
                        })
                        .catch(error => console.error(`Error fetching availability for station ${station.id}:`, error));
                });
            })
            .catch(error => console.error('Error fetching stations:', error));

        axios.get('/api/vehicles')
            .then(response => setVehiclesCount(response.data.length))
            .catch(error => console.error('Error fetching vehicles:', error));

        axios.get('/api/vehicleCategories')
            .then(response => setCategoriesCount(response.data.length))
            .catch(error => console.error('Error fetching vehicle categories:', error));

        axios.get('/api/producers')
            .then(response => setProducersCount(response.data.length))
            .catch(error => console.error('Error fetching producers:', error));

        axios.get('/api/vehicleTypes')
            .then(response => setVehicleTypes(response.data.length))
            .catch(error => console.error('Error fetching producers:', error));
    }, []);

    const getStationCarsCount = (stationId: number) => {
        return availabilities[stationId] || 0;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Overview
            </Typography>
            <Link href="/auth/admin/hivedrive/console/" target="_blank" rel="noopener" sx={{ display: 'block', mb: 3 }}>
                Zum Keycloak Back Office gehen
            </Link>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <CustomPaper>
                        <Typography variant="h5">Stations</Typography>
                        <Typography variant="h2">{stationsCount}</Typography>
                    </CustomPaper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <CustomPaper>
                        <Typography variant="h5">VehiclesTypes</Typography>
                        <Typography variant="h2">{vehicleTypes}</Typography>
                    </CustomPaper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <CustomPaper>
                        <Typography variant="h5">Categories</Typography>
                        <Typography variant="h2">{categoriesCount}</Typography>
                    </CustomPaper>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ height: '500px', mt: 3 }}>
                        <MapContainer center={[51.1657, 10.4515]} zoom={6} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {stations.map((station) => (
                                <Marker
                                    key={station.id}
                                    position={[station.latitude, station.longitude]}
                                    icon={L.divIcon({
                                        className: 'custom-icon',
                                        html: `<div style="background-color:blue;color:white;border-radius:50%;width:1rem;height:1rem;text-align:center;line-height:1rem;">${getStationCarsCount(station.id)}</div>`,
                                    })}
                                >
                                    <Popup>
                                        {station.name}<br />
                                        {getStationCarsCount(station.id)} cars available
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Overview;
