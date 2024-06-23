import React from 'react';
import { AppBar, Toolbar, Button, Drawer, IconButton, Typography, FormControl, FormControlLabel, Radio, RadioGroup, Checkbox, Box } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const FilterBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [sortOption, setSortOption] = React.useState('');
  const [transmission, setTransmission] = React.useState('');
  const [seatCount, setSeatCount] = React.useState<string[]>([]);
  const [driverAge, setDriverAge] = React.useState<string[]>([]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOption((event.target as HTMLInputElement).value);
  };

  const handleTransmissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransmission((event.target as HTMLInputElement).value);
  };

  const handleSeatCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setSeatCount((prev) => 
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleDriverAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setDriverAge((prev) => 
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit">Limousine</Button>
        <Button color="inherit">SUV</Button>
        <Button color="inherit">Coupé</Button>
        <Button color="inherit">Cabriolet</Button>
        <Button color="inherit">Familienauto</Button>
        <Button color="inherit">Kombi</Button>
        <Button color="inherit">Garantiertes Modell</Button>
        <Button color="inherit">Elektrisches Fahrzeug</Button>
        <Button color="inherit">Luxus Fahrzeug</Button>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="filter"
          onClick={handleDrawerOpen}
          style={{ marginLeft: 'auto' }}
        >
          <FilterListIcon />
        </IconButton>
      </Toolbar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: '33.33vw',
          }
        }}
      >
        <Box
          sx={{ width: '100%', padding: 2 }}
          role="presentation"
        >
          <Typography variant="h6">Filtern & Sortieren</Typography>
          <Typography variant="subtitle1">Sortieren nach</Typography>
          <RadioGroup value={sortOption} onChange={handleSortChange}>
            <FormControlLabel value="lowestPrice" control={<Radio />} label="Niedrigster Preis zuerst" />
            <FormControlLabel value="highestPrice" control={<Radio />} label="Höchster Preis zuerst" />
            <FormControlLabel value="electricFirst" control={<Radio />} label="Elektrische Fahrzeuge zuerst" />
          </RadioGroup>
          <Typography variant="subtitle1">Getriebe</Typography>
          <RadioGroup value={transmission} onChange={handleTransmissionChange}>
            <FormControlLabel value="automatic" control={<Radio />} label="Automatik" />
            <FormControlLabel value="manual" control={<Radio />} label="Manuell" />
          </RadioGroup>
          <Typography variant="subtitle1">Anzahl Sitze</Typography>
          <FormControl component="fieldset">
            <FormControlLabel
              control={<Checkbox checked={seatCount.includes("2+")} onChange={handleSeatCountChange} value="2+" />}
              label="2+"
            />
            <FormControlLabel
              control={<Checkbox checked={seatCount.includes("4+")} onChange={handleSeatCountChange} value="4+" />}
              label="4+"
            />
            <FormControlLabel
              control={<Checkbox checked={seatCount.includes("5+")} onChange={handleSeatCountChange} value="5+" />}
              label="5+"
            />
            <FormControlLabel
              control={<Checkbox checked={seatCount.includes("7+")} onChange={handleSeatCountChange} value="7+" />}
              label="7+"
            />
          </FormControl>
          <Typography variant="subtitle1">Alter des Fahrers</Typography>
          <FormControl component="fieldset">
            <FormControlLabel
              control={<Checkbox checked={driverAge.includes("18+")} onChange={handleDriverAgeChange} value="18+" />}
              label="18+"
            />
            <FormControlLabel
              control={<Checkbox checked={driverAge.includes("21+")} onChange={handleDriverAgeChange} value="21+" />}
              label="21+"
            />
            <FormControlLabel
              control={<Checkbox checked={driverAge.includes("23+")} onChange={handleDriverAgeChange} value="23+" />}
              label="23+"
            />
            <FormControlLabel
              control={<Checkbox checked={driverAge.includes("25+")} onChange={handleDriverAgeChange} value="25+" />}
              label="25+"
            />
            <FormControlLabel
              control={<Checkbox checked={driverAge.includes("30+")} onChange={handleDriverAgeChange} value="30+" />}
              label="30+"
            />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleDrawerClose}
            sx={{ marginTop: 2 }}
          >
            55 Autos anzeigen
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default FilterBar;
