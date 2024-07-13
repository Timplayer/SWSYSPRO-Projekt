import React, { useState, useEffect } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Box,
    Typography,
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import { Vehicle, VehicleCategory, Producer } from './VehicleDataTypes';

interface VehicleListProps {
    vehicles: Vehicle[];
    categories: VehicleCategory[];
    producers: Producer[];
    handleFetchImage: (id: number) => Promise<string[]>;
    handleUpdateVehicle: (vehicle: Vehicle) => void;
}

interface VehicleWithImage extends Vehicle {
    imageUrls: string[];
}

const VehicleList: React.FC<VehicleListProps> = ({
    vehicles,
    categories,
    producers,
    handleFetchImage,
    handleUpdateVehicle
}) => {
    const [vehiclesWithImages, setVehiclesWithImages] = useState<VehicleWithImage[]>([]);
    const [editingVehicle, setEditingVehicle] = useState<VehicleWithImage | null>(null);

    useEffect(() => {
        const fetchAllImages = async () => {
            const updatedVehicles = await Promise.all(vehicles.map(async (vehicle) => {
                const imageUrls = await handleFetchImage(vehicle.id);
                return { ...vehicle, imageUrls };
            }));

            setVehiclesWithImages(updatedVehicles);
        };

        fetchAllImages();
    }, [vehicles]);

    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Unknown';
    };

    const getProducerName = (producerId: number) => {
        const producer = producers.find(prod => prod.id === producerId);
        return producer ? producer.name : 'Unknown';
    };

    const handleEditVehicle = (vehicle: VehicleWithImage) => {
        setEditingVehicle(vehicle);
    };

    const handleSaveEdit = () => {
        if (editingVehicle) {
            handleUpdateVehicle(editingVehicle);
            setEditingVehicle(null);
        }
    };

    const handleChange = (field: keyof Vehicle, value: any) => {
        if (editingVehicle) {
            setEditingVehicle({ ...editingVehicle, [field]: value });
        }
    };

    return (
        <>
            <List>
                {vehiclesWithImages.map((vehicle) => (
                    <ListItem
                        key={vehicle.id}
                        secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="edit" onClick={() => handleEditVehicle(vehicle)}>
                                    <EditIcon />
                                </IconButton>
                            </>
                        }
                    >
                    <ListItemText
                        primary={`${vehicle.name} (${vehicle.status})`}
                        secondary={
                            <>
                                Vehicle Category: {getCategoryName(vehicle.vehicleCategory)}<br />
                                Producer: {getProducerName(vehicle.producer)}<br />
                                Reception Date: {vehicle.receptionDate}<br />
                                Completion Date: {vehicle.completionDate}
                            </>
                        }
                    />
                    </ListItem>
                ))}
            </List>

            <Dialog open={!!editingVehicle} onClose={() => setEditingVehicle(null)}>
                <DialogTitle>Edit Vehicle</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Edit the details of the vehicle.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={editingVehicle?.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Status"
                        fullWidth
                        value={editingVehicle?.status || ''}
                        onChange={(e) => handleChange('status', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Reception Date"
                        fullWidth
                        value={editingVehicle?.receptionDate || ''}
                        onChange={(e) => handleChange('receptionDate', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Completion Date"
                        fullWidth
                        value={editingVehicle?.completionDate || ''}
                        onChange={(e) => handleChange('completionDate', e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingVehicle(null)}>Cancel</Button>
                    <Button onClick={handleSaveEdit}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default  VehicleList;
