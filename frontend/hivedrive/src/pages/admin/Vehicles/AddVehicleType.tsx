import React, { useState } from 'react';
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { VehicleType, Transmission, DriverSystem, VehicleCategory } from '../../../Types';

interface AddVehicleTypeProps {
    categories: VehicleCategory[];
    handleAddVehicleType: (vehicle: Omit<VehicleType, 'id'>) => Promise<number>;
    handleUploadImage: (id: number, file: File) => Promise<void>;
}

const AddVehicleType: React.FC<AddVehicleTypeProps> = ({ categories, handleAddVehicleType, handleUploadImage }) => {
    const [name, setName] = useState<string>('');
    const [vehicleCategory, setVehicleCategory] = useState<number>(0);
    const [transmission, setTransmission] = useState<Transmission>(Transmission.Automatik);
    const [driverSystem, setDriverSystem] = useState<DriverSystem>(DriverSystem.FWD);
    const [maxSeatCount, setMaxSeatCount] = useState<number>(0);
    const [pricePerHour, setPricePerHour] = useState<number>(0.00);
    const [minAgeToDrive, setMinAgeToDrive] = useState<number>(0);
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


    const handleSubmit = async () => {
        if (name.trim() && vehicleCategory > 0 && maxSeatCount > 0 && pricePerHour > 0 && minAgeToDrive > 0 && driverSystem) {
            const newVehicleType: Omit<VehicleType,'id'> = {
                name,
                vehicleCategory,
                transmission,
                driverSystem,
                maxSeatCount,
                pricePerHour,
                minAgeToDrive,
            };

            handleAddVehicleType(newVehicleType).then((vehicleId : number) => {
                Promise.all(images.map((image : File) => handleUploadImage(vehicleId, image)));

                setName('');
                setVehicleCategory(0);
                setTransmission(Transmission.Automatik);
                setDriverSystem(DriverSystem.FWD);
                setMaxSeatCount(0);
                setPricePerHour(0.00);
                setMinAgeToDrive(0);
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
                <InputLabel>Getriebe</InputLabel>
                <Select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as Transmission)}
                    label="Getriebe"
                >
                    <MenuItem value={Transmission.Automatik}>Automatik</MenuItem>
                    <MenuItem value={Transmission.Manuell}>Manuell</MenuItem>
                </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ minWidth: '200px' }}>
                <InputLabel>Antrieb</InputLabel>
                <Select
                    value={driverSystem}
                    onChange={(e) => setDriverSystem(e.target.value as DriverSystem)}
                    label="Antrieb"
                >
                    <MenuItem value={DriverSystem.FWD}>FWD</MenuItem>
                    <MenuItem value={DriverSystem.RWD}>RWD</MenuItem>
                    <MenuItem value={DriverSystem.AWD}>AWD</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Maximale Sitzplatzanzahl"
                type="number"
                value={maxSeatCount}
                onChange={(e) => setMaxSeatCount(Number(e.target.value))}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <TextField
                label="Preis pro Stunde"
                type="number"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(Number(e.target.value))}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <TextField
                label="Mindestalter zum Fahren"
                type="number"
                value={minAgeToDrive}
                onChange={(e) => setMinAgeToDrive(Number(e.target.value))}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <Box {...getRootProps()} sx={{ border: '1px dashed gray', padding: 2, textAlign: 'center' }}>
                <input {...getInputProps()} />
                <Typography variant="body1" gutterBottom>
                    Ziehen Sie Bilder hierher, oder klicken Sie, um Bilder auszuwählen.
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
                Fahrzeug hinzufügen
            </Button>
        </Box>
    );
};

export default AddVehicleType;
