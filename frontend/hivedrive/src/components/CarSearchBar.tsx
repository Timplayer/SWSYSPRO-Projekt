import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box, Container, Grid, IconButton} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { useLocationContext } from '../Utils/LocationContext';

const CarSearchBar: React.FC = () => {
  const { setLocation } = useLocationContext();
  const [locations, setLocations] = useState<Array<{ label: string, value: string }>>([]);
  const [location, setLocationState] = useState<string>('');
  const [pickupDate, setPickupDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(new Date());
  const [splitLocation, setSplitLocation] = useState<boolean>(false);
  const [returnLocation, setReturnLocation] = useState<string>('');

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await axios.get('/api/stations');
      const locationsData = response.data.map((location: any) => ({
        label: location.name,
        value: location.name
      }));
      setLocations(locationsData);
    };

    fetchLocations();
  }, []);

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
                setLocation(e.target.value);
              }}
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
              <MobileDateTimePicker
                ampm={false}
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
              <MobileDateTimePicker
                ampm={false}
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
      <Grid item xs={12} justifyContent="right" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          component={RouterLink}
          to="/bookingpage"
          onClick={handleSubmit}
          sx={{ marginTop: 2 }}
        >
          Autos anzeigen
        </Button>
      </Grid>
    </Container>
  );
};

export default CarSearchBar;
