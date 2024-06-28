// Producers.tsx
import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Producer } from './VehicleTypes';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

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

interface ProducersProps {
    producers: Producer[];
    handleAddProducer: (name: string) => void;
    handleDeleteProducer: (id: number) => void;
}

const Producers: React.FC<ProducersProps> = ({ producers, handleAddProducer, handleDeleteProducer }) => {
    const [producerName, setProducerName] = useState<string>('');

    const handleSubmit = () => {
        if (producerName.trim()) {
            handleAddProducer(producerName);
            setProducerName('');
        }
    };

    return (
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
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ alignSelf: 'center' }}>
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
    );
};

export default Producers;
