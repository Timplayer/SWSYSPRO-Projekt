import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import withRoot from '../withRoot';
import AppAppBar from '../views/AppAppBar';
import AppFooter from '../views/AppFooter';
import { Container, Box, Typography, TextField, MenuItem, Checkbox, FormControlLabel, Button, Grid, Radio, RadioGroup, FormControl, FormLabel, useTheme, styled } from '@mui/material';
import keycloak from '../keycloak';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDateTimePicker } from '@mui/x-date-pickers';

const Reservation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { car, searchLocation, returnLocation, pickupDate, returnDate } = location.state || {};

  const theme = useTheme();

  const [carName, setCarName] = useState(car.name);
  const [carClass, setCarClass] = useState(car.vehicleCategory);
  const [carTransmission, setCarTransmission] = useState(car.transmission);
  const [carDrive, setCarDrive] = useState(car.transmission);
  const [carSeatings, setCarSeatings] = useState(car.maxSeatCount);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [pickupDateCopy, setPickupDate] = useState<Date | null>(pickupDate ? new Date(pickupDate) : new Date());
  const [returnDateCopy, setReturnDate] = useState<Date | null>(returnDate ? new Date(returnDate) : new Date());
  const [pickupLocationCopy, setPickupLocation] = useState(searchLocation);
  const [returnLocationCopy, setReturnLocation] = useState(returnLocation);
  const [differentReturnLocation, setDifferentReturnLocation] = useState(false);

  const [driverAge, setDriverAge] = useState('');

  const [additionalDriver, setAdditionalDriver] = useState(false);
  const [additionalDriverName, setAdditionalDriverName] = useState('');
  const [additionalDriverAge, setAdditionalDriverAge] = useState('25');

  useEffect(() => {
    const { given_name, family_name, email } = keycloak.tokenParsed;
    setCustomerName(`${given_name} ${family_name}`);
    setCustomerEmail(email);
  }, []);

  const [locations, setLocations] = useState<Array<{ label: string, value: string }>>([]);

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

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const reservationData = {
      carName,
      carClass,
      carDrive,
      carTransmission,
      carSeatings,
      additionalDriver,
      pickupDate: pickupDateCopy,
      returnDate: returnDateCopy,
      pickupLocation: pickupLocationCopy,
      returnLocation: differentReturnLocation ? returnLocationCopy : pickupLocationCopy, 
      customerName,
      customerEmail,
      driverAge,
      additionalDriverName,
      additionalDriverAge,
    };

    try {
      const response = await axios.post('https://localhost:8080/api/reservations', reservationData, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        console.log('Reservation successful:', response.data);
        navigate('/mybookings');
      } else {
        console.error('Reservation failed:', response);
      }
    } catch (error) {
      console.error('Error making reservation:', error);
    }
  };

  const StyledTextField = styled(TextField)({
    '& .Mui-disabled': {
      color: 'rgba(0, 0, 0, 0.87)', 
      '-webkit-text-fill-color': 'rgba(0, 0, 0, 0.87)', 
      backgroundColor: theme.palette.background.paper, 
    },
  });

  const now = new Date();

  return (
    <React.Fragment>
      <AppAppBar />

      <Container>
        <Box 
          sx={{ 
            marginTop: 7, 
            marginBottom: 12, 
            backgroundColor: 'white', 
            padding: 2, 
            borderRadius: 4, 
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="h4" gutterBottom>HiveDrive Reservierung</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Name"
                  value={customerName}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={customerEmail}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Fahrzeug Bezeichnung"
                  value={carName}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Fahrzeugklasse"
                  value={carClass}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Getriebe"
                  value={carTransmission}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Antrieb"
                  value={carDrive}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Anzahl der Sitzplätze"
                  value={carSeatings}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  required
                  fullWidth
                  label="Abholort"
                  value={pickupLocationCopy}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                >
                  {locations.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {differentReturnLocation && (
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    select
                    fullWidth
                    label="Rückgabeort"
                    value={returnLocationCopy}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    sx={{ backgroundColor: theme.palette.background.paper }}
                  >
                    {locations.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={differentReturnLocation}
                      onChange={(e) => setDifferentReturnLocation(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Anderen Rückgabeort auswählen"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDateTimePicker
                    ampm={false}
                    label="Abholdatum"
                    value={pickupDateCopy}
                    onChange={(date) => {
                      setPickupDate(date);
                      if (date && returnDateCopy && date > returnDateCopy) {
                        setReturnDate(date);
                      }
                    }}
                    minDate={now}
                    minTime={new Date(now.getTime() - 1 * 60 * 1000)}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDateTimePicker
                    ampm={false}
                    label="Rückgabedatum"
                    value={returnDateCopy}
                    onChange={(date) => setReturnDate(date)}
                    minDate={pickupDateCopy || now}
                    minTime={pickupDateCopy || now}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" sx={{ backgroundColor: theme.palette.background.paper, p: 2, borderRadius: 1 }}>
                  <FormLabel component="legend">Alter des Fahrers</FormLabel>
                  <RadioGroup
                    row
                    aria-label="driverAge"
                    name="driverAge"
                    value={driverAge}
                    onChange={(e) => setDriverAge(e.target.value)}
                  >
                    <FormControlLabel value="18" control={<Radio />} label="18+" />
                    <FormControlLabel value="21" control={<Radio />} label="21+" />
                    <FormControlLabel value="23" control={<Radio />} label="23+" />
                    <FormControlLabel value="25" control={<Radio />} label="25+" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={additionalDriver}
                      onChange={(e) => setAdditionalDriver(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Zusatzfahrer hinzufügen"
                />
              </Grid>
              {additionalDriver && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Zusatzfahrer Name"
                      value={additionalDriverName}
                      onChange={(e) => setAdditionalDriverName(e.target.value)}
                      sx={{ backgroundColor: theme.palette.background.paper }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset" sx={{ backgroundColor: theme.palette.background.paper, p: 2, borderRadius: 1 }}>
                      <FormLabel component="legend">Alter des Zusatzfahrers</FormLabel>
                      <RadioGroup
                        row
                        aria-label="additionalDriverAge"
                        name="additionalDriverAge"
                        value={additionalDriverAge}
                        onChange={(e) => setAdditionalDriverAge(e.target.value)}
                      >
                        <FormControlLabel value="18" control={<Radio />} label="18+" />
                        <FormControlLabel value="21" control={<Radio />} label="21+" />
                        <FormControlLabel value="23" control={<Radio />} label="23+" />
                        <FormControlLabel value="25" control={<Radio />} label="25+" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Reservierung abschicken
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>

      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Reservation);
