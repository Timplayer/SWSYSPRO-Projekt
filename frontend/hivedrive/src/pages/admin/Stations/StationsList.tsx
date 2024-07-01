// StationList.tsx
import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Delete';
import { Station } from './StationTypes';

interface StationListProps {
    stations: Station[];
    handleEditStation: (id: number) => void;
}

const StationList: React.FC<StationListProps> = ({ stations, handleEditStation }) => {
    return (
        <List>
            {stations.map((station) => (
                <ListItem key={station.id} secondaryAction={
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditStation(station.id)}>
                        <EditIcon />
                    </IconButton>
                }>
                    <ListItemText
                        primary={station.name}
                        secondary={
                            <>
                                Standort: ({station.latitude}, {station.longitude})         <br />
                                Land: {station.country}, Bundesland: {station.state}        <br/>
                                Stadt: {station.city}, Postleitzahl: {station.zip}          <br />
                                Straße: {station.street}, Hausnummer: {station.house_number}<br />
                                Kapazität: {station.capacity}
                            </>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default StationList;
