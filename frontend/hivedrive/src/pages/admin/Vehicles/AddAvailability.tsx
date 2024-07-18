import React, { useState } from 'react';
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { VehicleType } from '../../../Types';
import { Station } from '../Stations/StationTypes';
import { LocalizationProvider, MobileDatePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface AddAvailabilityProps {
    stations: Station[];
    vehicleTypes: VehicleType[];
    handleAddAvailability: (data: { station: number; time: Date; auto_klasse: number }) => Promise<void>;
}

const AddAvailability: React.FC<AddAvailabilityProps> = ({ stations, vehicleTypes, handleAddAvailability }) => {
    const [station, setStation] = useState<number>(0);
    const [time, setTime] = useState<Date>(new Date());
    const [vehicleType, setVehicleType] = useState<number>(0);

    const handleSubmit = async () => {
        if (station > 0 && time && vehicleType > 0) {
            const data = {
                station,
                time,
                auto_klasse: vehicleType
            };

            handleAddAvailability(data).then(() => {
                setStation(0);
                setTime(new Date());
                setVehicleType(0);
            });
        }
    };

    const now = new Date();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl variant="outlined" sx={{ minWidth: '200px' }}>
                <InputLabel>Station</InputLabel>
                <Select
                    value={station}
                    onChange={(e) => setStation(e.target.value as number)}
                    label="Station"
                >
                    {stations.map((station) => (
                        <MenuItem key={station.id} value={station.id}>
                            {station.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDateTimePicker
                    ampm={false}
                    label="Datum des Empfangs"
                    value={time}
                    onChange={(date) => setTime(date)}
                    minDate={now}
                    minTime={now}
                />
            </LocalizationProvider>

            <FormControl variant="outlined" sx={{ minWidth: '200px' }}>
                <InputLabel>Fahrzeugtyp</InputLabel>
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
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ alignSelf: 'center' }}>
                Verfügbarkeit hinzufügen
            </Button>
        </Box>
    );
};

export default AddAvailability;
