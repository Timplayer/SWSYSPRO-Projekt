import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Container, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const locations = [
  { label: 'Hamburg Flughafen', value: 'hamburg-airport' },
  // Add more locations as needed
];

const CarSearchBar: React.FC = () => {
  const [location, setLocation] = useState<string>('hamburg-airport');
  const [pickupDate, setPickupDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(new Date());

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      location,
      pickupDate,
      returnDate,
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              label="Abholung & Rückgabe"
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
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Abholdatum"
                value={pickupDate}
                onChange={(date) => setPickupDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Rückgabedatum"
                value={returnDate}
                onChange={(date) => setReturnDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
              Autos anzeigen
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CarSearchBar;
