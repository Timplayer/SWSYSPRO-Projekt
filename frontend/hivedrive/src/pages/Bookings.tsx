import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material';
import AppAppBar from '../views/AppAppBar';
import AppFooter from '../views/AppFooter';
import withRoot from '../withRoot';
import axios from 'axios';
import { Reservation, VehicleType } from '../Types';
import keycloak from '../keycloak';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const Bookings: React.FC = () => {
  const [openInfo, setOpenInfo] = useState(false);
  const [openReturnDetails, setOpenReturnDetails] = useState(false);
  const [openMoreInfo, setOpenMoreInfo] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [removeId, setRemoveId] = useState<number | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentEditBooking, setCurrentEditBooking] = useState<Reservation | null>(null);
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Array<{ label: string, value: number }>>([]);
  const [vehicleTypes, setVehicleCategories] = useState<VehicleType[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await axios.get('/api/stations');
      const locationsData = response.data.map((location: any) => ({
        label: location.name,
        value: location.id,
      }));
      setLocations(locationsData);
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/reservations', {
          headers: {
            'Authorization': `Bearer ${keycloak.token}`,
            'Content-Type': 'application/json'
          }
        });

        setBookings(response.data);
        setLoading(false);

      } catch (error) {
        setError(error.message);
        fetchBookings();
      }
    };

    const fetchVehicleType = async () => {
      const response = await axios.get('/api/vehicleTypes');
      setVehicleCategories(response.data);
    };

    fetchVehicleType();
    fetchBookings();
  }, []);

  const currentDate = new Date();

  const currentBookings = bookings.filter(booking => new Date(booking.start_zeit) > currentDate);
  const pastBookings = bookings.filter(booking => new Date(booking.start_zeit) <= currentDate);

  const calculateRentalDays = (startDate: string, endDate: string) => {
    const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60));
  };

  const getVehicleNameById = (id: number): string | undefined => {
    const vehicle = vehicleTypes.find(v => v.id === id);
    return vehicle ? vehicle.name : undefined;
  };

  const getStationNameById = (id: number): string | undefined => {
    const station = locations.find(v => v.value === id);
    return station ? station.label : undefined;
  };

  const handleClickOpenInfo = () => {
    setOpenInfo(true);
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
  };

  const handleClickOpenReturnDetails = () => {
    setOpenReturnDetails(true);
  };

  const handleCloseReturnDetails = () => {
    setOpenReturnDetails(false);
  };

  const handleClickOpenMoreInfo = () => {
    setOpenMoreInfo(true);
  };

  const handleCloseMoreInfo = () => {
    setOpenMoreInfo(false);
  };

  const handleClickOpenCancel = (id: number) => {
    setRemoveId(id);
    setOpenCancel(true);
  };

  const handleCloseCancel = () => {
    setOpenCancel(false);
    setRemoveId(null);
  };

  const handleConfirmCancel = async () => {
    if (removeId !== null) {
      try {
        await axios.delete(`/api/reservations/id/${removeId}`, {
          headers: {
            'Authorization': `Bearer ${keycloak.token}`,
            'Content-Type': 'application/json'
          }
        });
        setBookings(bookings.filter((booking) => booking.id !== removeId));
        setOpenCancel(false);
        setRemoveId(null);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleClickOpenEdit = (booking: Reservation) => {
    setCurrentEditBooking({
      ...booking,
      start_zeit: new Date(booking.start_zeit),
      end_zeit: new Date(booking.end_zeit),
    });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setCurrentEditBooking(null);
  };

  const handleSaveEdit = async () => {
    if (currentEditBooking) {
      const updatedBooking = {
        auto_klasse: currentEditBooking.auto_klasse,
        start_station: currentEditBooking.start_station,
        end_station: currentEditBooking.end_station,
        start_zeit: currentEditBooking.start_zeit,
        end_zeit: currentEditBooking.end_zeit,
      };

      try {
        await axios.delete(`/api/reservations/id/${currentEditBooking.id}`, {
          headers: {
            'Authorization': `Bearer ${keycloak.token}`,
            'Content-Type': 'application/json'
          }
        });

        const response = await axios.post('/api/reservations', updatedBooking, {
          headers: {
            'Authorization': `Bearer ${keycloak.token}`,
            'Content-Type': 'application/json'
          }
        });

        setBookings(bookings.map(booking => (booking.id === currentEditBooking.id ? response.data : booking)));
        setOpenEdit(false);
        setCurrentEditBooking(null);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleEditChange = (field: keyof Reservation, value: any) => {
    if (currentEditBooking) {
      setCurrentEditBooking({ ...currentEditBooking, [field]: value });
    }
  };

  const renderBooking = (booking: Reservation, isPast: boolean) => {
    const rentalDays = calculateRentalDays(booking.start_zeit, booking.end_zeit);
    return (
      <Card variant="outlined" key={booking.id} sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Auto Klasse: {getVehicleNameById(booking.auto_klasse)}</Typography>
              <Typography>Mietdauer: {rentalDays} Stunden</Typography>
              <Typography>Buchungs-ID: {booking.id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Start: {getStationNameById(booking.start_station)}</Typography>
              <Typography>Ende: {getStationNameById(booking.end_station)}</Typography>
              <Typography>{new Date(booking.start_zeit).toLocaleString()}</Typography>
              <Typography>{new Date(booking.end_zeit).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleClickOpenInfo}>Fahrzeuginfo</Button>
              <Button variant="contained" onClick={handleClickOpenReturnDetails}>Rückgabedetails</Button>
              <Button variant="contained" onClick={handleClickOpenMoreInfo}>Mehr anzeigen</Button>
              {isPast ? (
                <React.Fragment>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDialogOpen}
                    sx={{ ml: 2 }}
                  >
                    Rechnung herunterladen
                  </Button>
                  <Dialog open={openDialog} onClose={handleDialogClose}>
                    <DialogTitle>Coming Soon</DialogTitle>
                    <DialogContent>
                      <Typography variant="body1">
                        Diese Funktion ist noch nicht verfügbar, wird aber bald hinzugefügt.
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleDialogClose} color="primary">
                        Schließen
                      </Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Button variant="contained" color="secondary" onClick={() => handleClickOpenCancel(booking.id)} sx={{ ml: 2 }}>Buchung stornieren</Button>
                  <Button variant="contained" color="secondary" onClick={() => handleClickOpenEdit(booking)} sx={{ ml: 2 }}>Bearbeiten</Button>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <React.Fragment>
      <AppAppBar />
      <Box p={3}>
        <Typography variant="h4" gutterBottom sx={{ color: '#f57c00' }}>Meine Buchungen</Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 4, color: '#f57c00' }}>Aktuelle Buchungen</Typography>
        {currentBookings.length > 0 ? (
          currentBookings.map(booking => renderBooking(booking, false))
        ) : (
          <Typography variant="body1" sx={{ color: '#ffffff' }}>Keine aktuellen Buchungen</Typography>
        )}

        <Typography variant="h5" gutterBottom sx={{ mt: 4, color: '#ffffff' }}>Vergangene Buchungen</Typography>
        {pastBookings.length > 0 ? (
          pastBookings.map(booking => renderBooking(booking, true))
        ) : (
          <Typography variant="body1" sx={{ color: '#ffffff' }}>Keine vergangenen Buchungen</Typography>
        )}

        <Dialog open={openInfo} onClose={handleCloseInfo}>
          <DialogTitle>Fahrzeuginformationen</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Hier sind die Details zum Fahrzeug...
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInfo} color="primary">Schließen</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openReturnDetails} onClose={handleCloseReturnDetails}>
          <DialogTitle>Rückgabedetails</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Hier sind die Rückgabedetails...
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReturnDetails} color="primary">Schließen</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openMoreInfo} onClose={handleCloseMoreInfo}>
          <DialogTitle>Zusätzliche Informationen</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Hier sind weitere Informationen zur Buchung...
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMoreInfo} color="primary">Schließen</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openCancel} onClose={handleCloseCancel}>
          <DialogTitle>Buchung stornieren</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Möchten Sie diese Buchung wirklich stornieren? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCancel} color="primary">Abbrechen</Button>
            <Button onClick={handleConfirmCancel} color="secondary">Stornieren</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEdit} onClose={handleCloseEdit}>
          <DialogTitle>Buchung bearbeiten</DialogTitle>
          <DialogContent>
            <Box mb={2}>
              <TextField
                select
                margin="dense"
                label={'Abholung'}
                value={currentEditBooking?.start_station || ''}
                onChange={(e) => handleEditChange('start_station', e.target.value)}
                fullWidth
              >
                {locations.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box mb={2}>
              <TextField
                select
                margin="dense"
                label={'Rückgabe'}
                value={currentEditBooking?.end_station || ''}
                onChange={(e) => handleEditChange('end_station', e.target.value)}
                fullWidth
              >
                {locations.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box mb={2}>
                <MobileDateTimePicker
                  ampm={false}
                  label="Abholdatum"
                  value={currentEditBooking?.start_zeit}
                  onChange={(date) => {
                    if (date) handleEditChange('start_zeit', date);
                  }}
                  minDate={currentDate}
                />
              </Box>
              <Box mb={2}>
                <MobileDateTimePicker
                  ampm={false}
                  label="Rückgabedatum"
                  value={currentEditBooking?.end_zeit}
                  onChange={(date) => {
                    if (date) handleEditChange('end_zeit', date);
                  }}
                  minDate={currentEditBooking?.start_zeit || currentDate}
                />
              </Box>
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit} color="primary">Abbrechen</Button>
            <Button onClick={handleSaveEdit} color="secondary">Speichern</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Bookings);
