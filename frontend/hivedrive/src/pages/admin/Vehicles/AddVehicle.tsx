import React, { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { Vehicle, VehicleType, Producer } from './VehicleDataTypes';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface AddVehicleProps {
    vehicleTypes: VehicleType[];
    producers: Producer[];
    handleAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<number>;
}

const AddVehicle: React.FC<AddVehicleProps> = ({ vehicleTypes, producers, handleAddVehicle }) => {
    const [name, setName] = useState<string>('');
    const [vehicleType, setVehicleType] = useState<number>(0);
    const [producer, setProducer] = useState<number>(0);
    const [status, setStatus] = useState<string>('');
    const [receptionDate, setReceptionDate] = useState<Date | null>(new Date());
    const [completionDate, setCompletionDate] = useState<Date | null>(new Date());

    const handleSubmit = async () => {
        if (name.trim() && vehicleType > 0 && producer > 0 && status.trim()) {
            const newVehicle = {
                name,
                vehicleType,
                producer,
                status,
                receptionDate: dayjs(receptionDate).toISOString(),
                completionDate: dayjs(completionDate).toISOString(),
            };

            handleAddVehicle(newVehicle).then(() => {
                setName('');
                setVehicleType(0);
                setProducer(0);
                setStatus('');
                setReceptionDate(new Date());
                setCompletionDate(new Date());
            });
        }
    };

    const now = new Date();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />

            <FormControl variant="outlined" sx={{ minWidth: '200px' }}>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as number)}
                    label="Fahrzeugtyp"
                >
                    {vehicleTypes.map((vehicleType) => (
                        <MenuItem key={vehicleType.id} value={vehicleType.id}>
                            {vehicleType.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ minWidth: '200px' }}>
                <InputLabel>Producer</InputLabel>
                <Select
                    value={producer}
                    onChange={(e) => setProducer(e.target.value as number)}
                    label="Produzent"
                >
                    {
                    producers.map((producer) => (
                        <MenuItem key={producer.id} value={producer.id}>
                            {producer.name}
                        </MenuItem>
                    ))
                    }
                </Select>
            </FormControl>

            <TextField
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDateTimePicker
                    ampm={false}
                    label="Datum des Empfangs"
                    value={receptionDate}
                    onChange={(date) => setReceptionDate(date)}
                    minDate={now}
                    minTime={now}
                />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDateTimePicker
                    ampm={false}
                    label="Datum des Auslaufens"
                    value={completionDate}
                    onChange={(date) => setCompletionDate(date)}
                    minDate={now}
                    minTime={now}
                />
            </LocalizationProvider>
            
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ alignSelf: 'center' }}>
                Fahrzeug hinzufügen
            </Button>
        </Box>
    );
};

export default AddVehicle;
