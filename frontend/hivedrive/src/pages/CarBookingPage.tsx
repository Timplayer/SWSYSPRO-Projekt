import React, { useState, useEffect } from 'react';
import withRoot from '../withRoot';
import AppAppBar from '../views/AppAppBar';
import AppFooter from '../views/AppFooter';
import { Container, Box, Typography, TextField, MenuItem, Checkbox, FormControlLabel, Button, Grid, Radio, RadioGroup, FormControl, FormLabel, useTheme } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';

const carOptions = [
  { value: 'economy', label: 'Economy' },
  { value: 'compact', label: 'Compact' },
  { value: 'midsize', label: 'Midsize' },
  { value: 'suv', label: 'SUV' },
  { value: 'luxury', label: 'Luxury' },
];

const locationOptions = [
  { value: 'Airport Bremen', label: 'Airport Bremen' },
  { value: 'Airport Munich', label: 'Airport Munich' },
  { value: 'Innenstadt Bremen', label: 'City Bremen' },
  { value: 'Hauptbahnhof Bremen', label: 'HBF Bremen' },
  { value: 'Hauptbahnhof Hamburg', label: 'HBF Hamburg' },
  { value: 'Hauptbahnhof Berlin', label: 'HBF Berlin' },
];

function Reservation() {
  const { keycloak } = useKeycloak();
  const theme = useTheme();

  const [carType, setCarType] = useState('');
  const [additionalDriver, setAdditionalDriver] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [differentReturnLocation, setDifferentReturnLocation] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [driverAge, setDriverAge] = useState('');
  const [rentalType, setRentalType] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [additionalDriverName, setAdditionalDriverName] = useState('');
  const [additionalDriverAge, setAdditionalDriverAge] = useState('');

  useEffect(() => {
    if (keycloak?.authenticated) {
      const { given_name, family_name, email, phone_number } = keycloak.tokenParsed;
      setCustomerName(`${given_name} ${family_name}`);
      setCustomerEmail(email);
      setCustomerPhone(phone_number || '');
    }
  }, [keycloak]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      carType,
      additionalDriver,
      pickupDate,
      returnDate,
      pickupLocation,
      returnLocation: differentReturnLocation ? returnLocation : pickupLocation,
      customerName,
      customerEmail,
      customerPhone,
      driverAge,
      rentalType,
      discountCode,
      additionalDriverName,
      additionalDriverAge,
    });
  };

  return (
    <React.Fragment>
      <AppAppBar />

      <Container>
        <Box sx={{ mt: 7, mb: 12 }}>
          <Typography variant="h4" gutterBottom>Autovermietung Reservation</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Telefonnummer"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  required
                  fullWidth
                  label="Autotyp"
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                >
                  {carOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  required
                  fullWidth
                  label="Abholort"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                >
                  {locationOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
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
              {differentReturnLocation && (
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Rückgabeort"
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    sx={{ backgroundColor: theme.palette.background.paper }}
                  >
                    {locationOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Abholdatum"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Rückgabedatum"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                />
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
                    <FormControlLabel value="18-21" control={<Radio />} label="18-21" />
                    <FormControlLabel value="21-25" control={<Radio />} label="21-25" />
                    <FormControlLabel value="25-60" control={<Radio />} label="25-60" />
                    <FormControlLabel value="over60" control={<Radio />} label="Über 60" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rabattcode"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  sx={{ backgroundColor: theme.palette.background.paper }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" sx={{ backgroundColor: theme.palette.background.paper, p: 2, borderRadius: 1 }}>
                  <FormLabel component="legend">Art der Anmietung</FormLabel>
                  <RadioGroup
                    row
                    aria-label="rentalType"
                    name="rentalType"
                    value={rentalType}
                    onChange={(e) => setRentalType(e.target.value)}
                  >
                    <FormControlLabel value="personal" control={<Radio />} label="Privatreise" />
                    <FormControlLabel value="business" control={<Radio />} label="Geschäftsreise" />
                    <FormControlLabel value="other" control={<Radio />} label="Andere" />
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
                        <FormControlLabel value="18-21" control={<Radio />} label="18-21" />
                        <FormControlLabel value="21-25" control={<Radio />} label="21-25" />
                        <FormControlLabel value="25-60" control={<Radio />} label="25-60" />
                        <FormControlLabel value="over60" control={<Radio />} label="Über 60" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Reservation abschicken
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
