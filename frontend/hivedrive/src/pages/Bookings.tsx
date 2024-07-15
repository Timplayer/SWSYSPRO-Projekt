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
  MenuItem
} from '@mui/material';
import AppAppBar from '../views/AppAppBar';
import AppFooter from '../views/AppFooter';
import withRoot from '../withRoot';
import axios from 'axios';
import { Reservation } from '../Types';
import keycloak from '../keycloak';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const Bookings: React.FC = () => {
  const [openInfo, setOpenInfo] = useState(false);
  const [openReturnDetails, setOpenReturnDetails] = useState(false);
  const [openMoreInfo, setOpenMoreInfo] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [removeid, setRemoveid] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentEditBooking, setCurrentEditBooking] = useState<Reservation | null>(null);
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Array<{ label: string, value: number }>>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await axios.get('/api/stations');
      const locationsData = response.data.map((location: any) => ({
        label: location.name,
        value: location.id,
      }));
      setLocations (locationsData);
    };
    fetchLocations();
  }, []);

  const now = new Date();

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
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const currentDate = new Date();

  const currentBookings = bookings.filter(booking => new Date(booking.start_zeit) > currentDate);
  const pastBookings = bookings.filter(booking => new Date(booking.start_zeit) <= currentDate);

  const calculateRentalDays = (startDate: string, endDate: string) => {
    const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
    setRemoveid(id);
    setOpenCancel(true);
  };

  const handleCloseCancel = () => {
    setOpenCancel(false);
  };

  const handleConfirmCancel = async () => {
    try {
      await axios.delete(`/api/reservations/id/${removeid}`, {
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json'
        }
      });
      setBookings(bookings.filter((booking) => booking.id !== removeid));
      setOpenCancel(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDownloadInvoice = (bookingId: number) => {
    // Add your invoice download logic here
    console.log(`Download invoice for booking ${bookingId}`);
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
        // Delete the old booking
        await axios.delete(`/api/reservations/id/${currentEditBooking.id}`, {
          headers: {
            'Authorization': `Bearer ${keycloak.token}`,
            'Content-Type': 'application/json'
          }
        });

        // Create the new booking
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
      if (field === 'start_zeit' || field === 'end_zeit') {
        setCurrentEditBooking({ ...currentEditBooking, [field]: new Date(value) });
      } else {
        setCurrentEditBooking({ ...currentEditBooking, [field]: value });
      }
    }
  };

  const renderBooking = (booking: Reservation, isPast: boolean) => {
    const rentalDays = calculateRentalDays(booking.start_zeit, booking.end_zeit);
    return (
      <Card variant="outlined" key={booking.id} sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Auto Klasse: {booking.auto_klasse}</Typography>
              <Typography>{rentalDays} Miettag{rentalDays > 1 ? 'e' : ''}</Typography>
              <Typography>ID: {booking.id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Start: Station {booking.start_station}</Typography>
              <Typography>Ende: Station {booking.end_station}</Typography>
              <Typography>{new Date(booking.start_zeit).toLocaleString()}</Typography>
              <Typography>{new Date(booking.end_zeit).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleClickOpenInfo}>Fahrzeuginfo</Button>
              <Button variant="contained" onClick={handleClickOpenReturnDetails}>Rückgabedetails</Button>
              <Button variant="contained" onClick={handleClickOpenMoreInfo}>Mehr anzeigen</Button>
              {isPast ? (
                <Button variant="contained" color="primary" onClick={() => handleDownloadInvoice(booking.id)} sx={{ ml: 2 }}>Rechnung herunterladen</Button>
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
    return <Typography>Loading...</Typography>;
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
              onAccept={(date) => {
                if (date) {
                  currentEditBooking?.start_zeit.setDate(date.getDate());
                  currentEditBooking?.start_zeit.setMinutes(date.getMinutes());
                  currentEditBooking?.start_zeit.setHours(date.getHours());
                  if (currentEditBooking?.end_zeit && date > currentEditBooking.end_zeit) {
                    currentEditBooking.end_zeit.setDate(date.getDate());
                    currentEditBooking.end_zeit.setMinutes(date.getMinutes());
                    currentEditBooking.end_zeit.setHours(date.getHours());
                  }
                }
              }}
              minDate={now}
            />
          </Box>
          <Box mb={2}>
            <MobileDateTimePicker
              ampm={false}
              label="Rückgabedatum"
              value={currentEditBooking?.end_zeit}
              onAccept={(date) => {
                if (date) {
                  currentEditBooking?.end_zeit.setDate(date.getDate());
                  currentEditBooking?.end_zeit.setMinutes(date.getMinutes());
                  currentEditBooking?.end_zeit.setHours(date.getHours());
                }
              }}
              minDate={currentEditBooking?.start_zeit || now}
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
