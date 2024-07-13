import React, { useState, useEffect } from 'react';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { VehicleType, Transmission } from './VehicleDataTypes';

interface VehicleTypeListProps {
    vehicleTypes: VehicleType[];
    categories: { id: number; name: string }[];
    handleFetchImage: (id: number) => Promise<string[]>;
    handleUpdateVehicleType: (vehicle: VehicleType) => void;
}

interface VehicleTypeWithImage extends VehicleType {
    imageUrls: string[];
}

const VehicleTypeList: React.FC<VehicleTypeListProps> = ({
    vehicleTypes,
    categories,
    handleFetchImage,
    handleUpdateVehicleType
}) => {
    const [vehicleTypesWithImages, setVehicleTypesWithImages] = useState<VehicleTypeWithImage[]>([]);
    const [editingVehicleType, setEditingVehicleType] = useState<VehicleTypeWithImage | null>(null);

    useEffect(() => {
        const fetchAllImages = async () => {
            const updatedVehicleTypes = await Promise.all(vehicleTypes.map(async (vehicleType) => {
                const imageUrls = await handleFetchImage(vehicleType.id);
                return { ...vehicleType, imageUrls };
            }));

            setVehicleTypesWithImages(updatedVehicleTypes);
        };

        fetchAllImages();
    }, [vehicleTypes]);

    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Unknown';
    };

    const handleEditVehicleType = (vehicleType: VehicleTypeWithImage) => {
        setEditingVehicleType(vehicleType);
    };

    const handleSaveEdit = () => {
        if (editingVehicleType) {
            handleUpdateVehicleType(editingVehicleType);
            setEditingVehicleType(null);
        }
    };

    const handleChange = (field: keyof VehicleType, value: any) => {
        if (editingVehicleType) {
            setEditingVehicleType({ ...editingVehicleType, [field]: value });
        }
    };


    return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom color="textPrimary">
                    Fahrzeug Typen
                </Typography>
                <List>
                    {vehicleTypesWithImages.map((vehicleType) => (
                        <ListItem
                            key={vehicleType.id}
                            secondaryAction={
                                <>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditVehicleType(vehicleType)}>
                                        <EditIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText
                                primary={`${vehicleType.name}`}
                                secondary={
                                    <Typography variant="body2" color="textSecondary">
                                        Fahrzeug-Kategorie: {getCategoryName(vehicleType.vehicleCategory)}<br />
                                        Getriebe: {vehicleType.transmission}<br />
                                        Maximale Sitzplatzanzahl: {vehicleType.maxSeatCount}<br />
                                        Preis pro Stunde: {vehicleType.pricePerHour}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>

                <Dialog open={!!editingVehicleType} onClose={() => setEditingVehicleType(null)}>
                    <DialogTitle>Fahrzeugtyp bearbeiten</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        Bearbeiten Sie die Details des Fahrzeugtyps.
                        </DialogContentText>
                        <TextField
                            margin="dense"
                            label="Name"
                            fullWidth
                            value={editingVehicleType?.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>Fahrzeug-Kategorie</InputLabel>
                            <Select
                                value={editingVehicleType?.vehicleCategory || ''}
                                onChange={(e) => handleChange('vehicleCategory', e.target.value)}
                                label="Fahrzeug-Kategorie"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>Getriebe</InputLabel>
                            <Select
                                value={editingVehicleType?.transmission || ''}
                                onChange={(e) => handleChange('transmission', e.target.value)}
                                label="Getriebe"
                            >
                                <MenuItem value={Transmission.Automatik}>Automatik</MenuItem>
                                <MenuItem value={Transmission.Manuell}>Manuell</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense"
                            label="Maximale Sitzplatzanzahl"
                            type="number"
                            fullWidth
                            value={editingVehicleType?.maxSeatCount || ''}
                            onChange={(e) => handleChange('maxSeatCount', e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Preis pro Stunde"
                            type="number"
                            fullWidth
                            value={editingVehicleType?.pricePerHour || ''}
                            onChange={(e) => handleChange('pricePerHour', e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditingVehicleType(null)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
    );
};

export default VehicleTypeList;
