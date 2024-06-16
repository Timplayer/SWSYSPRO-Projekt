import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemText, Typography, IconButton, Divider, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Reservation {
    id: number;
    userName: string;
    car: string;
    startTime: string;
    endTime: string;
    station: string;
}

const Reservations: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [userName, setUserName] = useState<string>('');
    const [car, setCar] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [station, setStation] = useState<string>('');
    const [nextId, setNextId] = useState<number>(1);

    const handleAddReservation = () => {
        if (userName.trim() && car.trim() && startTime && endTime && station.trim()) {
            setReservations([...reservations, { id: nextId, userName, car, startTime, endTime, station }]);
            setUserName('');
            setCar('');
            setStartTime('');
            setEndTime('');
            setStation('');
            setNextId(nextId + 1);
        }
    };

    const handleDeleteReservation = (id: number) => {
        setReservations(reservations.filter(reservation => reservation.id !== id));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Reservations
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                    label="User Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    variant="outlined"
                    sx={{ minWidth: '200px' }}
                />
                <TextField
                    label="Car"
                    value={car}
                    onChange={(e) => setCar(e.target.value)}
                    variant="outlined"
                    sx={{ minWidth: '150px' }}
                />
                <TextField
                    label="Start Time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: '250px' }}
                />
                <TextField
                    label="End Time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: '250px' }}
                />
                <TextField
                    label="Station"
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                    variant="outlined"
                    sx={{ minWidth: '200px' }}
                />
                <Button variant="contained" color="primary" onClick={handleAddReservation} sx={{ alignSelf: 'center' }}>
                    Add Reservation
                </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
                {reservations.map((reservation) => (
                    <ListItem key={reservation.id} secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteReservation(reservation.id)}>
                            <DeleteIcon />
                        </IconButton>
                    }>
                        <ListItemText
                            primary={`Reservation for ${reservation.userName}`}
                            secondary={
                                <>
                                    Car: {reservation.car}<br />
                                    Start: {new Date(reservation.startTime).toLocaleString()}<br />
                                    End: {new Date(reservation.endTime).toLocaleString()}<br />
                                    Station: {reservation.station}
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Reservations;
