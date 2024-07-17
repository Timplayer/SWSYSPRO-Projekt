// StationList.tsx
import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Box,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Station } from './StationTypes';

interface StationListProps {
    stations: Station[];
    handleEditStation: (station: Station) => void;
}

const StationList: React.FC<StationListProps> = ({ stations, handleEditStation }) => {
    const [editingStation, setEditingStation] = useState<Station | null>(null);
    const [isMapOpen, setIsMapOpen] = useState<boolean>(false);

    const handleEdit = (station: Station) => {
        setEditingStation(station);
        setIsMapOpen(false);
    };

    const handleSaveEdit = () => {
        if (editingStation) {
            handleEditStation(editingStation);
            setEditingStation(null);
        }
    };

    const handleChange = (field: keyof Station, value: any) => {
        if (editingStation) {
            setEditingStation({ ...editingStation, [field]: value });
        }
    };

    function LocationMarker() {
        useMapEvents({
            click(e) {
                if (editingStation) {
                    setEditingStation({ ...editingStation, latitude: e.latlng.lat, longitude: e.latlng.lng });
                }
            },
        });

        return editingStation ? (
            <Marker position={[editingStation.latitude, editingStation.longitude]}></Marker>
        ) : null;
    }

    // Fix for the default marker icon
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom color="textPrimary">
                Station List
            </Typography>
            <List>
                {stations.map((station) => (
                    <ListItem
                        key={station.id}
                        secondaryAction={
                            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(station)}>
                                <EditIcon />
                            </IconButton>
                        }
                    >
                        <ListItemText
                            primary={station.name}
                            secondary={
                                <>
                                    Standort: ({station.latitude}, {station.longitude})<br />
                                    Land: {station.country}, Bundesland: {station.state}<br/>
                                    Stadt: {station.city}, Postleitzahl: {station.zip}<br />
                                    Straße: {station.street}, Hausnummer: {station.house_number}<br />
                                    Kapazität: {station.capacity}
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>

            <Dialog open={!!editingStation} onClose={() => setEditingStation(null)}>
                <DialogTitle>Station bearbeiten</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bearbeiten Sie die Details der Station.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        label="Name der Station"
                        fullWidth
                        value={editingStation?.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', marginTop: 2 }}>
                        <TextField
                            label="Breitengrad"
                            type="number"
                            value={editingStation?.latitude || ''}
                            onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                            variant="outlined"
                            sx={{ minWidth: '150px' }}
                        />
                        <TextField
                            label="Längengrad"
                            type="number"
                            value={editingStation?.longitude || ''}
                            onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                            variant="outlined"
                            sx={{ minWidth: '150px' }}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setIsMapOpen(!isMapOpen)}
                            sx={{ height: 'fit-content' }}
                        >
                            {isMapOpen ? 'Karte schließen' : 'Karte öffnen'}
                        </Button>
                    </Box>
                    {isMapOpen && (
                        <Box sx={{ height: '400px', width: '100%', marginBottom: '16px' }}>
                            <MapContainer
                                center={[editingStation?.latitude || 51.1657, editingStation?.longitude || 10.4515]}
                                zoom={6}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationMarker />
                            </MapContainer>
                        </Box>
                    )}
                    <TextField
                        margin="dense"
                        label="Land"
                        fullWidth
                        value={editingStation?.country || ''}
                        onChange={(e) => handleChange('country', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Bundesland"
                        fullWidth
                        value={editingStation?.state || ''}
                        onChange={(e) => handleChange('state', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Stadt"
                        fullWidth
                        value={editingStation?.city || ''}
                        onChange={(e) => handleChange('city', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Postleitzahl"
                        fullWidth
                        value={editingStation?.zip || ''}
                        onChange={(e) => handleChange('zip', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Straße"
                        fullWidth
                        value={editingStation?.street || ''}
                        onChange={(e) => handleChange('street', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Hausnummer"
                        fullWidth
                        value={editingStation?.house_number || ''}
                        onChange={(e) => handleChange('house_number', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Kapazität"
                        fullWidth
                        type="number"
                        value={editingStation?.capacity || ''}
                        onChange={(e) => handleChange('capacity', parseInt(e.target.value, 10))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingStation(null)} color="primary">
                        Abbrechen
                    </Button>
                    <Button onClick={handleSaveEdit} color="primary">
                        Speichern 
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StationList;
