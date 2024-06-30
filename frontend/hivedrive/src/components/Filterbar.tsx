import React from 'react';
import {
  AppBar, Toolbar, Button, Menu, FormControl, FormControlLabel, Radio, RadioGroup, Checkbox, Box, Typography
} from '@mui/material';

const FilterBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [sortOption, setSortOption] = React.useState('lowestPrice'); // Default value
  const [vehicleCategory, setVehicleCategory] = React.useState<string[]>([]);
  const [transmission, setTransmission] = React.useState('automatic'); // Default value
  const [driveType, setDriveType] = React.useState('frontWheel'); // Default value
  const [seatCount, setSeatCount] = React.useState('7+'); // Default value
  const [driverAge, setDriverAge] = React.useState('25+'); // Default value

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, menuType: string) => {
    setAnchorEl(event.currentTarget);
    setActiveMenu(menuType);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenu(null);
  };

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortOption(event.target.value as string);
  };

  const handleVehicleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setVehicleCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleTransmissionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setTransmission(value);
  };

  const handleDriveTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setDriveType(value);
  };

  const handleSeatCountChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSeatCount(event.target.value as string);
  };

  const handleDriverAgeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDriverAge(event.target.value as string);
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'center' }}>
        <Button
          color="inherit"
          aria-label="filter"
          onClick={(event) => handleMenuOpen(event, 'sort')}
        >
          Sortieren nach
        </Button>
        <Button
          color="inherit"
          aria-label="filter"
          onClick={(event) => handleMenuOpen(event, 'vehicleCategory')}
        >
          Fahrzeugkategorie
        </Button>
        <Button
          color="inherit"
          aria-label="filter"
          onClick={(event) => handleMenuOpen(event, 'transmission')}
        >
          Getriebe
        </Button>
        <Button
          color="inherit"
          aria-label="filter"
          onClick={(event) => handleMenuOpen(event, 'driveType')}
        >
          Antrieb
        </Button>
        <Button
          color="inherit"
          aria-label="filter"
          onClick={(event) => handleMenuOpen(event, 'seatCount')}
        >
          Anzahl Sitze
        </Button>
        <Button
          color="inherit"
          aria-label="filter"
          onClick={(event) => handleMenuOpen(event, 'driverAge')}
        >
          Alter des Fahrers
        </Button>
      </Toolbar>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {activeMenu === 'sort' && (
          <Box sx={{ width: '300px', padding: 2 }}>
            <Typography variant="h6">Sortieren nach</Typography>
            <RadioGroup value={sortOption} onChange={handleSortChange}>
              <FormControlLabel value="lowestPrice" control={<Radio />} label="Niedrigster Preis zuerst" />
              <FormControlLabel value="highestPrice" control={<Radio />} label="Höchster Preis zuerst" />
              <FormControlLabel value="electricFirst" control={<Radio />} label="Elektrische Fahrzeuge zuerst" />
            </RadioGroup>
          </Box>
        )}
        {activeMenu === 'vehicleCategory' && (
          <Box sx={{ width: '300px', padding: 2 }}>
            <Typography variant="h6">Fahrzeugkategorie</Typography>
            <FormControl component="fieldset">
              <FormControlLabel control={<Checkbox checked={vehicleCategory.includes("limousine")} onChange={handleVehicleCategoryChange} value="limousine" />} label="Limousine" />
              <FormControlLabel control={<Checkbox checked={vehicleCategory.includes("suv")} onChange={handleVehicleCategoryChange} value="suv" />} label="SUV" />
              <FormControlLabel control={<Checkbox checked={vehicleCategory.includes("coupe")} onChange={handleVehicleCategoryChange} value="coupe" />} label="Coupé" />
              <FormControlLabel control={<Checkbox checked={vehicleCategory.includes("cabriolet")} onChange={handleVehicleCategoryChange} value="cabriolet" />} label="Cabriolet" />
              <FormControlLabel control={<Checkbox checked={vehicleCategory.includes("kombi")} onChange={handleVehicleCategoryChange} value="kombi" />} label="Kombi" />
              <FormControlLabel control={<Checkbox checked={vehicleCategory.includes("electricVehicle")} onChange={handleVehicleCategoryChange} value="electricVehicle" />} label="Elektrisches Fahrzeug" />
              <FormControlLabel control={<Checkbox checked={vehicleCategory.includes("luxuryVehicle")} onChange={handleVehicleCategoryChange} value="luxuryVehicle" />} label="Luxus Fahrzeug" />
              <FormControlLabel control={<Checkbox checked={vehicleCategory.includes("specialVehicle")} onChange={handleVehicleCategoryChange} value="specialVehicle" />} label="Spezial Fahrzeug" />
            </FormControl>
          </Box>
        )}
        {activeMenu === 'transmission' && (
          <Box sx={{ width: '300px', padding: 2 }}>
            <Typography variant="h6">Getriebe</Typography>
            <RadioGroup value={transmission} onChange={handleTransmissionChange}>
              <FormControlLabel value="automatic" control={<Radio />} label="Automatik" />
              <FormControlLabel value="manual" control={<Radio />} label="Manuell" />
            </RadioGroup>
          </Box>
        )}
        {activeMenu === 'driveType' && (
          <Box sx={{ width: '300px', padding: 2 }}>
            <Typography variant="h6">Antrieb</Typography>
            <RadioGroup value={driveType} onChange={handleDriveTypeChange}>
              <FormControlLabel value="frontWheel" control={<Radio />} label="Frontantrieb" />
              <FormControlLabel value="rearWheel" control={<Radio />} label="Heckantrieb" />
              <FormControlLabel value="allWheel" control={<Radio />} label="Allradantrieb" />
            </RadioGroup>
          </Box>
        )}
        {activeMenu === 'seatCount' && (
          <Box sx={{ width: '300px', padding: 2 }}>
            <Typography variant="h6">Anzahl Sitze</Typography>
            <RadioGroup value={seatCount} onChange={handleSeatCountChange}>
              <FormControlLabel value="2+" control={<Radio />} label="2+" />
              <FormControlLabel value="4+" control={<Radio />} label="4+" />
              <FormControlLabel value="5+" control={<Radio />} label="5+" />
              <FormControlLabel value="7+" control={<Radio />} label="7+" />
            </RadioGroup>
          </Box>
        )}
        {activeMenu === 'driverAge' && (
          <Box sx={{ width: '300px', padding: 2 }}>
            <Typography variant="h6">Alter des Fahrers</Typography>
            <RadioGroup value={driverAge} onChange={handleDriverAgeChange}>
              <FormControlLabel value="18+" control={<Radio />} label="18+" />
              <FormControlLabel value="21+" control={<Radio />} label="21+" />
              <FormControlLabel value="23+" control={<Radio />} label="23+" />
              <FormControlLabel value="25+" control={<Radio />} label="25+" />
            </RadioGroup>
          </Box>
        )}
      </Menu>
    </AppBar>
  );
};

export default FilterBar;
