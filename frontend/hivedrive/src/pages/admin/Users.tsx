import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Button, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import keycloak from '../../keycloak';

const CustomButton = styled(Button)({
    margin: '10px',
    backgroundColor: '#3f51b5',
    color: 'white',
    '&:hover': {
        backgroundColor: '#303f9f',
    },
});

const Users: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('/auth/admin/realms/hivedrive/users', {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        }).then(response => {
                const users = response.data;
                const usersWithRoles = users.map((user: any) => ({
                    ...user,
                    role: '',
                }));
                setUsers(usersWithRoles);
                fetchRoles(usersWithRoles);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setLoading(false);
            });
    };

    const fetchRoles = (users: any[]) => {
        const roleRequests = users.map(user =>
            axios.get(`/auth/admin/realms/hivedrive/users/${user.id}/role-mappings/realm`, {
                headers: {
                    'Authorization': 'Bearer ' + keycloak.token
                }
            })
                .then(response =>{ console.log(response); return { id: user.id, role: response.data[0].name }})
                .catch(error => {
                    console.error(`Error fetching roles for user ${user.id}:`, error);
                    return { id: user.id, role: 'Error fetching role' };
                })
        );

        Promise.all(roleRequests)
            .then(roleResponses => {
                const updatedUsers = users.map(user => {
                    const roleResponse = roleResponses.find(role => role.id === user.id);
                    return { ...user, role: roleResponse?.role || 'No role' };
                });
                setUsers(updatedUsers);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
                setLoading(false);
            });
    };

    const handleSetRole = (userId: number, role: string) => {
        axios.post(`/api/users/${userId}/setRole`, { role })
            .then(() => {
                setMessage('Role updated successfully');
                setOpen(true);
                fetchUsers();
            })
            .catch(error => {
                console.error('Error setting role:', error);
                setMessage('Error setting role');
                setOpen(true);
            });
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Users
            </Typography>
            <List>
                {users.map(user => (
                    <ListItem key={user.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <ListItemText primary={user.name} secondary={`Role: ${user.role}`} />
                        {user.role !== 'special' && (
                            <CustomButton
                                startIcon={<AddIcon />}
                                onClick={() => handleSetRole(user.id, 'special')}
                            >
                                Set Special Role
                            </CustomButton>
                        )}
                    </ListItem>
                ))}
            </List>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
                action={
                    <IconButton size="small" color="inherit" onClick={handleClose}>
                        <AddIcon fontSize="small" />
                    </IconButton>
                }
            />
        </Box>
    );
};

export default Users;
