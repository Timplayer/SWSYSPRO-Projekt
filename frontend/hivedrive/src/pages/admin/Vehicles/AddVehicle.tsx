import React, { useState } from 'react';
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { useDropzone } from 'react-dropzone';
import dayjs from 'dayjs';
import { Vehicle, VehicleType, Producer } from './VehicleDataTypes';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

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
    const [images, setImages] = useState<File[]>([]);

    const onDrop = (acceptedFiles: File[]) => {
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
        setImages([...images, ...imageFiles]);
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop
    });

    const uploadImage = async (image: File, vehicleId: number) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('file_name', image.name);
        formData.append('display_order', '0');

        await axios.post(`/api/images/vehicles/id/${vehicleId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    };

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

            handleAddVehicle(newVehicle).then(vehicleId => {
                Promise.all(images.map(image => uploadImage(image, vehicleId)));

                setName('');
                setVehicleType(0);
                setProducer(0);
                setStatus('');
                setReceptionDate(new Date());
                setCompletionDate(new Date());
                setImages([]);
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
                    label="Vehicle Type"
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
                    label="Producer"
                >
                    {producers.map((producer) => (
                        <MenuItem key={producer.id} value={producer.id}>
                            {producer.name}
                        </MenuItem>
                    ))}
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
                    label="Reception Date"
                    value={receptionDate}
                    onChange={(date) => setReceptionDate(date)}
                    minDate={now}
                    minTime={now}
                />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDateTimePicker
                    ampm={false}
                    label="Completion Date"
                    value={completionDate}
                    onChange={(date) => setCompletionDate(date)}
                    minDate={now}
                    minTime={now}
                />
            </LocalizationProvider>

            <Box {...getRootProps()} sx={{ border: '1px dashed gray', padding: 2, textAlign: 'center' }}>
                <input {...getInputProps()} />
                <Typography variant="body1" gutterBottom>
                    Drag 'n' drop some images here, or click to select images
                </Typography>
                <ImageIcon />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {images.map((file, index) => (
                    <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => removeImage(index)}
                    />
                ))}
            </Box>
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ alignSelf: 'center' }}>
                Add Vehicle
            </Button>
        </Box>
    );
};

export default AddVehicle;
