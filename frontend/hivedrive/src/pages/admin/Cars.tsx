import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, List, ListItem, ListItemText, Typography, IconButton, Divider, Tabs, Tab, TextField, Chip, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import { styled } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import dayjs from 'dayjs';

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

const CustomTabs = styled(Tabs)({
    color: 'white',
    '& .MuiTab-root': {
        color: 'white',
    },
    '& .Mui-selected': {
        color: 'white',
    },
});

const CustomTab = styled(Tab)({
    color: 'white',
    '&.Mui-selected': {
        color: 'white',
    },
});

interface Vehicle {
    id: number;
    name: string;
    vehicleCategory: number;
    producer: number;
    status: string;
    receptionDate: string;
    completionDate: string;
    images: File[];
}

interface VehicleCategory {
    id: number;
    name: string;
}

interface Producer {
    id: number;
    name: string;
}

const Vehicles: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [categories, setCategories] = useState<VehicleCategory[]>([]);
    const [producers, setProducers] = useState<Producer[]>([]);
    const [name, setName] = useState<string>('');
    const [vehicleCategory, setVehicleCategory] = useState<number>(0);
    const [producer, setProducer] = useState<number>(0);
    const [status, setStatus] = useState<string>('');
    const [receptionDate, setReceptionDate] = useState<string>('');
    const [completionDate, setCompletionDate] = useState<string>('');
    const [images, setImages] = useState<File[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [producerName, setProducerName] = useState<string>('');
    const [tabIndex, setTabIndex] = useState<number>(0);

    useEffect(() => {
        axios.get('/api/vehicles')
            .then(response => setVehicles(response.data))
            .catch(error => console.error('Error fetching vehicles:', error));
        
        axios.get('/api/vehicleCategories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching vehicle categories:', error));
        
        axios.get('/api/producers')
            .then(response => setProducers(response.data))
            .catch(error => console.error('Error fetching producers:', error));
    }, []);

    const handleAddVehicle = () => {
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

            axios.post('/api/vehicles', newVehicle)
                .then(response => {
                    setVehicles([...vehicles, response.data]);
                    setName('');
                    setVehicleCategory(0);
                    setProducer(0);
                    setStatus('');
                    setReceptionDate('');
                    setCompletionDate('');
                    setImages([]);
                })
                .catch(error => console.error('Error adding vehicle:', error));
        }
    };

    const handleAddCategory = () => {
        if (categoryName.trim()) {
            const newCategory = { name: categoryName };

            axios.post('/api/vehicleCategories', newCategory)
                .then(response => {
                    setCategories([...categories, response.data]);
                    setCategoryName('');
                })
                .catch(error => console.error('Error adding vehicle category:', error));
        }
    };

    const handleAddProducer = () => {
        if (producerName.trim()) {
            const newProducer = { name: producerName };

            axios.post('/api/producers', newProducer)
                .then(response => {
                    setProducers([...producers, response.data]);
                    setProducerName('');
                })
                .catch(error => console.error('Error adding producer:', error));
        }
    };

    const handleDeleteVehicle = (id: number) => {
        axios.delete(`/api/vehicles/${id}`)
            .then(() => {
                setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
            })
            .catch(error => console.error('Error deleting vehicle:', error));
    };

    const handleDeleteCategory = (id: number) => {
        axios.delete(`/api/vehicleCategories/id/${id}`)
            .then(() => {
                setCategories(categories.filter(category => category.id !== id));
            })
            .catch(error => console.error('Error deleting vehicle category:', error));
    };

    const handleDeleteProducer = (id: number) => {
        axios.delete(`/api/producers/id/${id}`)
            .then(() => {
                setProducers(producers.filter(producer => producer.id !== id));
            })
            .catch(error => console.error('Error deleting producer:', error));
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

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

    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Unknown';
    };

    const getProducerName = (producerId: number) => {
        const producer = producers.find(prod => prod.id === producerId);
        return producer ? producer.name : 'Unknown';
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Vehicles
            </Typography>
            <CustomTabs value={tabIndex} onChange={handleTabChange}>
                <CustomTab label="Vehicle List" />
                <CustomTab label="Add Vehicle" />
                <CustomTab label="Vehicle Categories" />
                <CustomTab label="Producers" />
            </CustomTabs>
            <Divider sx={{ mb: 2 }} />
            {tabIndex === 0 && (
                <Box>
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
                </Box>
            )}
            {tabIndex === 1 && (
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
                    <Button variant="contained" color="primary" onClick={handleAddVehicle} sx={{ alignSelf: 'center' }}>
                        Add Vehicle
                    </Button>
                </Box>
            )}
            {tabIndex === 2 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Vehicle Categories
                    </Typography>
                    <CustomTextField
                        label="Category Name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        variant="outlined"
                        sx={{ minWidth: '200px' }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddCategory} sx={{ alignSelf: 'center' }}>
                        Add Category
                    </Button>
                    <List>
                        {categories.map((category) => (
                            <ListItem key={category.id} secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(category.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                                <ListItemText primary={category.name} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
            {tabIndex === 3 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Producers
                    </Typography>
                    <CustomTextField
                        label="Producer Name"
                        value={producerName}
                        onChange={(e) => setProducerName(e.target.value)}
                        variant="outlined"
                        sx={{ minWidth: '200px' }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddProducer} sx={{ alignSelf: 'center' }}>
                        Add Producer
                    </Button>
                    <List>
                        {producers.map((producer) => (
                            <ListItem key={producer.id} secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteProducer(producer.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                                <ListItemText primary={producer.name} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default Vehicles;
