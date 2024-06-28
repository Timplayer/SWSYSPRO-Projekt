import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Vehicle, VehicleCategory, Producer } from './VehicleTypes';

interface VehicleListProps {
    vehicles: Vehicle[];
    categories: VehicleCategory[];
    producers: Producer[];
    handleDeleteVehicle: (id: number) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, categories, producers, handleDeleteVehicle }) => {
    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Unknown';
    };

    const getProducerName = (producerId: number) => {
        const producer = producers.find(prod => prod.id === producerId);
        return producer ? producer.name : 'Unknown';
    };

    return (
        <List>
            {vehicles.map((vehicle) => (
                <ListItem key={vehicle.id} secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteVehicle(vehicle.id)}>
                        <DeleteIcon />
                    </IconButton>
                }>
                    <ListItemText
                        primary={`${vehicle.name} (${vehicle.status})`}
                        secondary={
                            <>
                                Vehicle Category: {getCategoryName(vehicle.vehicleCategory)}<br />
                                Producer: {getProducerName(vehicle.producer)}<br />
                                Reception Date: {vehicle.receptionDate}<br />
                                Completion Date: {vehicle.completionDate}<br />
                            </>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default VehicleList;
