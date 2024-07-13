import React, { useState } from 'react';
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import dayjs from 'dayjs';

export enum Transmission {
    Automatik = "Automatik",
    Manuell = "Manuell",
}

export interface VehicleType {
    id: number;
    name: string;
    vehicleCategory: number;
    transmission: Transmission;
    maxSeatCount: number;
    pricePerHour: number;
}

interface AddVehicleTypeProps {
    categories: { id: number; name: string }[];
    producers: { id: number; name: string }[];
    handleAddVehicleType: (vehicle: VehicleType) => Promise<number>;
}

const AddVehicleType: React.FC<AddVehicleTypeProps> = ({ categories, producers, handleAddVehicleType }) => {
    const [name, setName] = useState<string>('');
    const [vehicleCategory, setVehicleCategory] = useState<number>(0);
    const [transmission, setTransmission] = useState<Transmission>(Transmission.Automatik);
    const [maxSeatCount, setMaxSeatCount] = useState<number>(0);
    const [pricePerHour, setPricePerHour] = useState<number>(0.00);
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

        await axios.post(`/api/images/vehicleTypes/id/${vehicleId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    };

    const handleSubmit = async () => {
        if (name.trim() && vehicleCategory > 0 && maxSeatCount > 0 && pricePerHour > 0) {
            const newVehicleType = {
                name,
                vehicleCategory,
                transmission,
                maxSeatCount,
                pricePerHour,
            };

            handleAddVehicleType(newVehicleType).then(vehicleId => {
                Promise.all(images.map(image => uploadImage(image, vehicleId)));

                setName('');
                setVehicleCategory(0);
                setTransmission(Transmission.Automatik);
                setMaxSeatCount(0);
                setPricePerHour(0.00);
                setImages([]);
            });
        }
    };

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
                <InputLabel>Vehicle Category</InputLabel>
                <Select
                    value={vehicleCategory}
                    onChange={(e) => setVehicleCategory(e.target.value as number)}
                    label="Vehicle Category"
                >
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ minWidth: '200px' }}>
                <InputLabel>Transmission</InputLabel>
                <Select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as Transmission)}
                    label="Transmission"
                >
                    <MenuItem value={Transmission.Automatik}>Automatik</MenuItem>
                    <MenuItem value={Transmission.Manuell}>Manuell</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Max Seat Count"
                type="number"
                value={maxSeatCount}
                onChange={(e) => setMaxSeatCount(Number(e.target.value))}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <TextField
                label="Price Per Hour"
                type="number"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(Number(e.target.value))}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <Box {...getRootProps()} sx={{ border: '1px dashed gray', padding: 2, textAlign: 'center' }}>
                <input {...getInputProps()} />
                <Typography variant="body1" gutterBottom>
                    Drag 'n' drop some images here, or click to select images
                </Typography>
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

export default AddVehicleType;
