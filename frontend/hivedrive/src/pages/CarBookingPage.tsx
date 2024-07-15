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
import { VehicleType, Transmission, DriverSystem, VehicleCategory } from '../Types.ts';

const Reservation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const { car, searchLocation, returnLocation, pickupDate, returnDate } = location.state || {};

  const [vehicleCategories, setVehicleCategories] = useState<VehicleCategory[]>([]);

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

  const [locations, setLocations] = useState<Array<{ label: string, value: string }>>([]);

  useEffect(() => {
    if (!location.state || !car) {
      navigate('/');
    }
  }, [location.state, car]);


  useEffect(() => {
    const fetchLocations = async () => {
      const response = await axios.get('/api/stations');
      const locationsData = response.data.map((location: any) => ({
        label: location.name,
        value: location.id
      }));
      setLocations(locationsData);
    };

    const fetchVehicleCategories = async() => {
      const response = await axios.get('/api/vehicleCategories');
      setVehicleCategories(response.data);
    }

    const { given_name, family_name, email } = keycloak.tokenParsed;
    setCustomerName(`${given_name} ${family_name}`);
    setCustomerEmail(email);

    fetchVehicleCategories();
    fetchLocations();
  }, []);

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      const api_reservation_data = {
        start_zeit: pickupDateCopy,
        start_station: pickupLocationCopy,
        end_zeit: returnDateCopy,
        end_station:  differentReturnLocation ? returnLocationCopy : pickupLocationCopy,
        auto_klasse: car.id,
      }

      const response = await axios.post('/api/reservations', api_reservation_data, {
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
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

  const getDriverSystemName = (drive: DriverSystem): string => {
    switch (drive) {
        case DriverSystem.FWD:
            return "Vorderradantrieb";
        case DriverSystem.RWD:
            return "Hinterradantrieb";
        case DriverSystem.AWD:
            return "Allradantrieb";
        default:
            return "";
    }
  };

  const getTransmissonName = (transmission: Transmission): string => {
    switch (transmission) {
        case Transmission.Automatik:
          return "Automatik"
          case Transmission.Manuell:
            return "Manuell";
        default:
            return "";
    }
  };

  const getVehicaleCategorieNameById = (id: number): string => {
    const carClass = vehicleCategories.find((cls) => cls.id === id);
    return carClass ? carClass.name : "Unbekannt";
  };
  
  const StyledTextField = styled(TextField)({
    '& .Mui-disabled': {
      color: 'rgba(0, 0, 0, 0.87)', 
      '-webkit-text-fill-color': 'rgba(0, 0, 0, 0.87)', 
      backgroundColor: theme.palette.background.paper, 
    },
  });

  const now = new Date();

  if (!car) {
    return null;
  }

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
                  value={car.name}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Fahrzeugklasse"
                  value={getVehicaleCategorieNameById(car.vehicleCategory)}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Getriebe"
                  value={getTransmissonName(car.transmission)}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Antrieb"
                  value={getDriverSystemName(car.driverSystem)}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Anzahl der Sitzplätze"
                  value={car.maxSeatCount}
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
