// VehicleCategories.tsx
import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { VehicleCategory } from './VehicleTypes';
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

interface VehicleCategoriesProps {
    categories: VehicleCategory[];
    handleAddCategory: (name: string) => void;
    handleDeleteCategory: (id: number) => void;
}

const VehicleCategories: React.FC<VehicleCategoriesProps> = ({ categories, handleAddCategory, handleDeleteCategory }) => {
    const [categoryName, setCategoryName] = useState<string>('');

    const handleSubmit = () => {
        if (categoryName.trim()) {
            handleAddCategory(categoryName);
            setCategoryName('');
        }
    };

    return (
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
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ alignSelf: 'center' }}>
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
    );
};

export default VehicleCategories;
