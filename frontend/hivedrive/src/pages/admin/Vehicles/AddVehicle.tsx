import React, { useState } from 'react';
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { useDropzone } from 'react-dropzone';
import dayjs from 'dayjs';
import { Vehicle, VehicleCategory, Producer } from './VehicleTypes';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

interface AddVehicleProps {
    categories: VehicleCategory[];
    producers: Producer[];
    handleAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
}

const AddVehicle: React.FC<AddVehicleProps> = ({ categories, producers, handleAddVehicle }) => {
    const [name, setName] = useState<string>('');
    const [vehicleCategory, setVehicleCategory] = useState<number>(0);
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

    const uploadImage = async (image: File, vehicleId: number): Promise<string> => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('file_name', image.name);
        formData.append('display_order', '0'); // Adjust the display order as needed

        const response = await axios.post(`/api/images/vehicles/id/${vehicleId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });


        return response.data.url;
    };

    const handleSubmit = async () => {
        if (name.trim() && vehicleCategory > 0 && producer > 0 && status.trim()) {
            const newVehicle = {
                name,
                vehicleCategory,
                producer,
                status,
                receptionDate: dayjs(receptionDate).toISOString(),
                completionDate: dayjs(completionDate).toISOString(),
                imageUrls: [] as string[], // Initialize as an empty array
            };

            // Create the vehicle first
            const response = await axios.post('/api/vehicles', newVehicle);
            const vehicleId = response.data.id;

            // Upload images and associate them with the vehicle
            const uploadedImageUrls = await Promise.all(images.map(image => uploadImage(image, vehicleId)));
            newVehicle.imageUrls = uploadedImageUrls;

            handleAddVehicle(newVehicle);
            setName('');
            setVehicleCategory(0);
            setProducer(0);
            setStatus('');
            setReceptionDate(new Date());
            setCompletionDate(new Date());
            setImages([]);
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
