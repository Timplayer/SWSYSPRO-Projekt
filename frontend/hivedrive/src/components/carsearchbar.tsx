// CarSearchBar.tsx
import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Container, Grid, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

interface CarSearchBarProps {
  setLocation: (location: string) => void;
}

const locations = [
  { label: 'Hamburg Flughafen', value: 'Hamburg Flughafen' },
  { label: 'Berlin Hauptbahnhof', value: 'Berlin Hauptbahnhof' },
  // Add more locations as needed
];

const CarSearchBar: React.FC<CarSearchBarProps> = ({ setLocation }) => {
  const [location, setLocationState] = useState<string>('Hamburg Flughafen');
  const [pickupDate, setPickupDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(new Date());
  const [splitLocation, setSplitLocation] = useState<boolean>(false);
  const [returnLocation, setReturnLocation] = useState<string>('Hamburg Flughafen');

  const handleSubmit = () => {
    console.log({
      location,
      returnLocation: splitLocation ? returnLocation : location,
      pickupDate,
      returnDate,
    });
  };

  const now = new Date();

  return (
    <Container maxWidth={false} sx={{ backgroundColor: 'secondary.light', width: '100%', padding: '16px' }}>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2} alignItems="center" wrap="nowrap">
          <Grid item xs={12} sm={4} justifyContent="left" alignItems="center">
            <TextField
              select
              label={splitLocation ? "Abholung" : "Abholung und Rückgabe"}
              value={location}
              onChange={(e) => {
                setLocationState(e.target.value);
              }}
              onClick={setLocation(location)}
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
                onChange={(date) => {
                  setPickupDate(date);
                  if (date && returnDate && date > returnDate) {
                    setReturnDate(date);
                  }
                }}
                minDate={now}
                minTime={now}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Rückgabedatum"
                value={returnDate}
                onChange={(date) => setReturnDate(date)}
                minDate={pickupDate || now}
                minTime={pickupDate || now}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Box>
      <Grid item xs={12} justifyContent="right" alignItems="center" margin-top="5em">
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} margin="5">
          Autos anzeigen
        </Button>
      </Grid>
    </Container>
  );
};

export default CarSearchBar;
