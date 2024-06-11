import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Container, Grid, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

const locations = [
  { label: 'Hamburg Flughafen', value: 'hamburg-airport' },
  // Add more locations as needed
];

const CarSearchBar: React.FC = () => {
  const [location, setLocation] = useState<string>('hamburg-airport');
  const [pickupDate, setPickupDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(new Date());
  const [splitLocation, setSplitLocation] = useState<boolean>(false);
  const [returnLocation, setReturnLocation] = useState<string>('hamburg-airport');

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      location,
      returnLocation: splitLocation ? returnLocation : location,
      pickupDate,
      returnDate,
    });
  };

  return (
    <Container maxWidth={false} sx={{ backgroundColor: '#FFFF', width: '100%', padding: '16px' }}>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2} alignItems="center" wrap="nowrap">
          <Grid item xs={12} sm={4} justifyContent="left" alignItems="center">
            <TextField
              select
              label={splitLocation ? "Abholung" : "Abholung und Rückgabe"}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
            >
              {locations.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {!splitLocation && (
            <Grid item xs={12} sm={4}>
            </Grid>
          )}
          {splitLocation && (
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Rückgabe"
                value={returnLocation}
                onChange={(e) => setReturnLocation(e.target.value)}
                fullWidth
              >
                {locations.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          <Grid item>
            <IconButton onClick={() => setSplitLocation(!splitLocation)}>
              {splitLocation ? <CloseIcon /> : <AddIcon />}
            </IconButton>
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Abholdatum"
                value={pickupDate}
                onChange={(date) => setPickupDate(date)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Rückgabedatum"
                value={returnDate}
                onChange={(date) => setReturnDate(date)}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Box>
      <Grid item xs={12} justifyContent="right" alignItems="center">
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
              Autos anzeigen
            </Button>
          </Grid>
    </Container>
  );
};

export default CarSearchBar;
