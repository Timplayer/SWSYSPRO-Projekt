import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Button, Snackbar, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import keycloak from '../../keycloak';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        setFilteredUsers(
            users.filter(user =>
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, users]);

    const fetchUsers = () => {
        axios.get('/auth/admin/realms/hivedrive/users', {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        }).then(response => {
                const users: User[] = response.data.map((user: any) => ({
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    roles: [],
                }));
                setUsers(users);
                fetchRoles(users);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setLoading(false);
            });
    };

    const fetchRoles = (users: User[]) => {
        const roleRequests = users.map(user =>
            axios.get(`/auth/admin/realms/hivedrive/users/${user.id}/role-mappings/realm`, {
                headers: {
                    'Authorization': 'Bearer ' + keycloak.token
                }
            })
                .then(response => {
                    const roles = response.data.map((role: any) => role.name);
                    return { id: user.id, roles };
                })
                .catch(error => {
                    console.error(`Error fetching roles for user ${user.id}:`, error);
                    return { id: user.id, roles: ['Error fetching role'] };
                })
        );

        Promise.all(roleRequests)
            .then(roleResponses => {
                const updatedUsers = users.map(user => {
                    const roleResponse = roleResponses.find(role => role.id === user.id);
                    return { ...user, roles: roleResponse?.roles || ['No role'] };
                });
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
                setLoading(false);
            });
    };

    const handleSetRole = (userId: string) => {

        const payload = [
            {
                id: '4f7409c7-92d8-4560-9f29-d4c3e48cacb8', 
                name: "member"
            }
        ];

        axios.post(`/auth/admin/realms/hivedrive/users/${userId}/role-mappings/realm`, payload, {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        }).then(() => {
            setMessage('Role updated successfully');
            setOpen(true);
            fetchUsers();
        }).catch(error => {
            console.error('Error setting role:', error);
            setMessage('Error setting role');
            setOpen(true);
        });
    };

    const handleRemoveRole = (userId: string) => {
        const payload = [
            {
                id: '4f7409c7-92d8-4560-9f29-d4c3e48cacb8', 
                name: "member"
            }
        ];

        axios.delete(`/auth/admin/realms/hivedrive/users/${userId}/role-mappings/realm`, {
            data: payload,
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        }).then(() => {
            setMessage('Role removed successfully');
            setOpen(true);
            fetchUsers();
        }).catch(error => {
            console.error('Error removing role:', error);
            setMessage('Error removing role');
            setOpen(true);
        });
    };

    const handleOpenConfirm = (user: User) => {
        setSelectedUser(user);
        setConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        setConfirmOpen(false);
        setSelectedUser(null);
    };

    const handleConfirmRemove = () => {
        if (selectedUser) {
            handleRemoveRole(selectedUser.id);
        }
        handleConfirmClose();
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Benutzer
            </Typography>
            <TextField
                label="Suche nach Namen"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <List>
                {filteredUsers.map(user => (
                    <ListItem key={user.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <ListItemText primary={`${user.firstName} ${user.lastName}`} secondary={`Email: ${user.email}`} />
                        {user.roles.includes('member') ? (
                            <Button
                                startIcon={<RemoveIcon />}
                                onClick={() => handleOpenConfirm(user)}
                            >
                                Mitglied entfernen
                            </Button>
                        ) : (
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleSetRole(user.id)}
                            >
                                Benutzer validieren
                            </Button>
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
            <Dialog
                open={confirmOpen}
                onClose={handleConfirmClose}
            >
                <DialogTitle>Bestätigen Sie die Entfernung der Rolle</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                     Sind Sie sicher, dass Sie die Rolle "member" aus {selectedUser?.firstName} {selectedUser?.lastName} entfernen wollen?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color="primary">
                        Abbrechen
                    </Button>
                    <Button onClick={handleConfirmRemove} color="primary">
                        Entfernen
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Users;
