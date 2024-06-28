// AddVehicle.tsx
import React, { useState } from 'react';
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { styled } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import dayjs from 'dayjs';
import { VehicleCategory, Producer } from './VehicleTypes';

const CustomTextField = styled(TextField)({
    '& .MuiInputBase-input': {
        color: 'white',
    },
    '& .MuiInputLabel-root': {
        color: 'white',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
    '& .MuiInputBase-input::placeholder': {
        color: 'white',
    },
});

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
    const [receptionDate, setReceptionDate] = useState<string>('');
    const [completionDate, setCompletionDate] = useState<string>('');
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
        onDrop,
        accept: 'image/*'
    });

    const handleSubmit = () => {
        if (name.trim() && vehicleCategory > 0 && producer > 0 && status.trim() && receptionDate.trim() && completionDate.trim()) {
            const newVehicle = {
                name,
                vehicleCategory,
                producer,
                status,
                receptionDate: dayjs(receptionDate).toISOString(),
                completionDate: dayjs(completionDate).toISOString(),
                images,
            };
            handleAddVehicle(newVehicle);
            setName('');
            setVehicleCategory(0);
            setProducer(0);
            setStatus('');
            setReceptionDate('');
            setCompletionDate('');
            setImages([]);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <CustomTextField
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
            <CustomTextField
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <CustomTextField
                label="Reception Date"
                type="datetime-local"
                value={receptionDate}
                onChange={(e) => setReceptionDate(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <CustomTextField
                label="Completion Date"
                type="datetime-local"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
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
