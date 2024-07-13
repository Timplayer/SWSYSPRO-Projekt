// VehicleCategories.tsx
import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemText, IconButton, Typography, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { VehicleCategory } from './VehicleDataTypes';

interface VehicleCategoriesProps {
    categories: VehicleCategory[];
    handleAddCategory: (name: string) => void;
    handleUpdateCategory: (id: number, name: string) => void;
}

const VehicleCategories: React.FC<VehicleCategoriesProps> = ({ categories, handleAddCategory, handleUpdateCategory }) => {
    const [categoryName, setCategoryName] = useState<string>('');
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState<string>('');

    const handleSubmit = () => {
        if (categoryName.trim()) {
            handleAddCategory(categoryName);
            setCategoryName('');
        }
    };

    const handleEditSubmit = (id: number) => {
        if (editingCategoryName.trim()) {
            handleUpdateCategory(id, editingCategoryName);
            setEditingCategoryId(null);
            setEditingCategoryName('');
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" gutterBottom>
                Vehicle Categories
            </Typography>
            <TextField
                label="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                variant="outlined"
                sx={{ minWidth: '200px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ alignSelf: 'center' }}>
                Add Category
            </Button>
            <List>
                {categories.map((category) => (
                    <ListItem key={category.id} secondaryAction={
                        <>
                            {editingCategoryId === category.id ? (
                                <>
                                    <IconButton edge="end" aria-label="confirm" onClick={() => handleEditSubmit(category.id)}>
                                        <CheckIcon />
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <IconButton edge="end" aria-label="edit" onClick={() => { setEditingCategoryId(category.id); setEditingCategoryName(category.name); }}>
                                        <EditIcon />
                                    </IconButton>
                                </>
                            )}
                        </>
                    }>
                        {editingCategoryId === category.id ? (
                            <TextField
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                variant="outlined"
                                sx={{ minWidth: '200px' }}
                            />
                        ) : (
                            <ListItemText primary={category.name} />
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default VehicleCategories;
