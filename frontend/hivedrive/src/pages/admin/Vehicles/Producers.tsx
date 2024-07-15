import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemText, IconButton, Typography, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { Producer } from '../../../Types';

interface ProducersProps {
    producers: Producer[];
    handleAddProducer: (name: string) => void;
    handleUpdateProducer: (id: number, name: string) => void;
}

const Producers: React.FC<ProducersProps> = ({ producers, handleAddProducer, handleUpdateProducer }) => {
    const [producerName, setProducerName] = useState<string>('');
    const [editingProducerId, setEditingProducerId] = useState<number | null>(null);
    const [editingProducerName, setEditingProducerName] = useState<string>('');

    const handleSubmit = () => {
        if (producerName.trim()) {
            handleAddProducer(producerName);
            setProducerName('');
        }
    };

    const handleEditSubmit = (id: number) => {
        if (editingProducerName.trim()) {
            handleUpdateProducer(id, editingProducerName);
            setEditingProducerId(null);
            setEditingProducerName('');
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" gutterBottom>
                Hersteller
            </Typography>
            <TextField
                label="Hersteller Name"
                value={producerName}
                onChange={(e) => setProducerName(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ alignSelf: 'center' }}>
                Hersteller hinzufügen
            </Button>
            <List>
                {producers.map((producer) => (
                    <ListItem key={producer.id} secondaryAction={
                        <>
                            {editingProducerId === producer.id ? (
                                <>
                                    <IconButton edge="end" aria-label="confirm" onClick={() => handleEditSubmit(producer.id)}>
                                        <CheckIcon />
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <IconButton edge="end" aria-label="edit" onClick={() => { setEditingProducerId(producer.id); setEditingProducerName(producer.name); }}>
                                        <EditIcon />
                                    </IconButton>
                                </>
                            )}
                        </>
                    }>
                        {editingProducerId === producer.id ? (
                            <TextField
                                value={editingProducerName}
                                onChange={(e) => setEditingProducerName(e.target.value)}
                                variant="outlined"
                                sx={{ minWidth: '200px' }}
                            />
                        ) : (
                            <ListItemText primary={producer.name} />
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Producers;
