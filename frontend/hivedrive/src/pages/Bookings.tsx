import React, { useState } from 'react';
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
} from '@mui/material';
import AppAppBar from '../views/AppAppBar';
import AppFooter from '../views/AppFooter';
import withRoot from '../withRoot';

const Bookings: React.FC = () => {
  const [openInfo, setOpenInfo] = useState(false);
  const [openReturnDetails, setOpenReturnDetails] = useState(false);
  const [openMoreInfo, setOpenMoreInfo] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentEditBooking, setCurrentEditBooking] = useState(null);

  const currentDate = new Date();
  const bookings = [
    {
      id: 1,
      car: 'KIA STONIC',
      price: '97,30 €',
      startLocation: 'Gran Canaria Meloneras',
      endLocation: 'Gran Canaria Meloneras',
      startDate: new Date('2024-07-08T09:22:00'),
      endDate: new Date('2024-07-08T23:00:00')
    },
    {
      id: 2,
      car: 'FORD FOCUS',
      price: '150,00 €',
      startLocation: 'Berlin Tegel',
      endLocation: 'Berlin Tegel',
      startDate: new Date('2024-06-15T09:00:00'),
      endDate: new Date('2024-06-17T18:00:00')
    }
  ];

  const currentBookings = bookings.filter(booking => booking.startDate > currentDate);
  const pastBookings = bookings.filter(booking => booking.startDate <= currentDate);

  const calculateRentalDays = (startDate: Date, endDate: Date) => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
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

  const handleClickOpenCancel = () => {
    setOpenCancel(true);
  };

  const handleCloseCancel = () => {
    setOpenCancel(false);
  };

  const handleConfirmCancel = () => {
    // Add your cancellation logic here
    setOpenCancel(false);
  };

  const handleDownloadInvoice = (bookingId: number) => {
    // Add your invoice download logic here
    console.log(`Download invoice for booking ${bookingId}`);
  };

  const handleClickOpenEdit = (booking) => {
    setCurrentEditBooking(booking);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setCurrentEditBooking(null);
  };

  const handleSaveEdit = () => {
    // Add your save logic here
    setOpenEdit(false);
    setCurrentEditBooking(null);
  };

  const handleEditChange = (field, value) => {
    setCurrentEditBooking({ ...currentEditBooking, [field]: value });
  };

  const renderBooking = (booking: any, isPast: boolean) => {
    const rentalDays = calculateRentalDays(booking.startDate, booking.endDate);
    return (
      <Card variant="outlined" key={booking.id} sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">{booking.car}</Typography>
              <Typography>{rentalDays} Miettag{rentalDays > 1 ? 'e' : ''}</Typography>
              <Typography>{booking.price}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Start: {booking.startLocation}</Typography>
              <Typography>Ende: {booking.endLocation}</Typography>
              <Typography>{booking.startDate.toLocaleString()}</Typography>
              <Typography>{booking.endDate.toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleClickOpenInfo}>Fahrzeuginfo</Button>
              <Button variant="contained" onClick={handleClickOpenReturnDetails}>Rückgabedetails</Button>
              <Button variant="contained" onClick={handleClickOpenMoreInfo}>Mehr anzeigen</Button>
              {isPast ? (
                <Button variant="contained" color="primary" onClick={() => handleDownloadInvoice(booking.id)} sx={{ ml: 2 }}>Rechnung herunterladen</Button>
              ) : (
                <React.Fragment>
                  <Button variant="contained" color="secondary" onClick={handleClickOpenCancel} sx={{ ml: 2 }}>Buchung stornieren</Button>
                  <Button variant="contained" color="secondary" onClick={() => handleClickOpenEdit(booking)} sx={{ ml: 2 }}>Bearbeiten</Button>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

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
            <TextField
              margin="dense"
              label="Auto"
              type="text"
              fullWidth
              value={currentEditBooking?.car || ''}
              onChange={(e) => handleEditChange('car', e.target.value)}
            />
            <TextField
              margin="dense"
              label="Preis"
              type="text"
              fullWidth
              value={currentEditBooking?.price || ''}
              onChange={(e) => handleEditChange('price', e.target.value)}
            />
            <TextField
              margin="dense"
              label="Startort"
              type="text"
              fullWidth
              value={currentEditBooking?.startLocation || ''}
              onChange={(e) => handleEditChange('startLocation', e.target.value)}
            />
            <TextField
              margin="dense"
              label="Endort"
              type="text"
              fullWidth
              value={currentEditBooking?.endLocation || ''}
              onChange={(e) => handleEditChange('endLocation', e.target.value)}
            />
            <TextField
              margin="dense"
              label="Startdatum"
              type="datetime-local"
              fullWidth
              value={currentEditBooking?.startDate.toISOString().slice(0, 16) || ''}
              onChange={(e) => handleEditChange('startDate', new Date(e.target.value))}
            />
            <TextField
              margin="dense"
              label="Enddatum"
              type="datetime-local"
              fullWidth
              value={currentEditBooking?.endDate.toISOString().slice(0, 16) || ''}
              onChange={(e) => handleEditChange('endDate', new Date(e.target.value))}
            />
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
