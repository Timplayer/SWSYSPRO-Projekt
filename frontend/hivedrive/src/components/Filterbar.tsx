import React from 'react';
import {
  AppBar, Toolbar, Button, Menu, FormControl, FormControlLabel, Radio, RadioGroup, Checkbox, Box, Typography
} from '@mui/material';

const FilterBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [sortOption, setSortOption] = React.useState('');
  const [vehicleCategory, setVehicleCategory] = React.useState('');
  const [transmission, setTransmission] = React.useState('');
  const [driveType, setDriveType] = React.useState('');
  const [seatCount, setSeatCount] = React.useState<string[]>([]);
  const [driverAge, setDriverAge] = React.useState<string[]>([]);

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

  const handleVehicleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setVehicleCategory(event.target.value as string);
  };

  const handleTransmissionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTransmission(event.target.value as string);
  };

  const handleDriveTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDriveType(event.target.value as string);
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
              <FormControlLabel control={<Checkbox checked={vehicleCategory.includes("family")} onChange={handleVehicleCategoryChange} value="family" />} label="Familienauto" />
              <FormControlLabel control={<Checkbox checked={vehicleCategory.includes("kombi")} onChange={handleVehicleCategoryChange} value="kombi" />} label="Kombi" />
              <FormControlLabel control={<Checkbox checked={vehicleCategory.includes("electricVehicle")} onChange={handleVehicleCategoryChange} value="electricVehicle" />} label="Elektrisches Fahrzeug" />
              <FormControlLabel control={<Checkbox checked={vehicleCategory.includes("luxuryVehicle")} onChange={handleVehicleCategoryChange} value="luxuryVehicle" />} label="Luxus Fahrzeug" />
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
          </Box>
        )}
        {activeMenu === 'driverAge' && (
          <Box sx={{ width: '300px', padding: 2 }}>
            <Typography variant="h6">Alter des Fahrers</Typography>
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
          </Box>
        )}
      </Menu>
    </AppBar>
  );
};

export default FilterBar;
