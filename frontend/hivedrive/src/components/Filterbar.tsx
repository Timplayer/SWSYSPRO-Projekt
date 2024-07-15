import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Button, Menu, FormControl, FormControlLabel, Radio, RadioGroup, Checkbox, Box, Typography
} from '@mui/material';

import { VehicleCategory, Transmission, DriverSystem } from '../Types';

interface FilterContextType {
  sortOption: string;
  vehicleCategory: VehicleCategory[];
  transmission: Transmission[];
  driveType: DriverSystem[];
  seatCount: string;
  driverAge: string;
  
  setSortOption: (value: string) => void;
  setVehicleCategory: React.Dispatch<React.SetStateAction<VehicleCategory[]>>;
  setTransmission: React.Dispatch<React.SetStateAction<Transmission[]>>;
  setDriveType: React.Dispatch<React.SetStateAction<DriverSystem[]>>;
  setSeatCount: (value: string) => void;
  setDriverAge: (value: string) => void;
}

const FilterBar: React.FC<FilterContextType> = ({
  sortOption, setSortOption,
  vehicleCategory, setVehicleCategory,
  transmission, setTransmission,
  driveType, setDriveType,
  seatCount, setSeatCount,
  driverAge, setDriverAge
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [availableVehicleCategories, setAvailableVehicleCategories] = useState<VehicleCategory[]>([]);

  useEffect(() => {
    fetch('/api/vehicleCategories')
      .then(response => response.json())
      .then(data => setAvailableVehicleCategories(data))
      .catch(error => console.error('Error fetching vehicle categories:', error));
  }, []);

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
    const value = parseInt(event.target.value, 10);
    const selectedCategory = availableVehicleCategories.find(category => category.id === value);
    if (selectedCategory) {
      setVehicleCategory((prev) =>
        prev.some((item) => item.id === value) ? prev.filter((item) => item.id !== value) : [...prev, selectedCategory]
      );
    }
  };

  const handleTransmissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as Transmission;
    setTransmission((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleDriveTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as DriverSystem;
    setDriveType((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSeatCountChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSeatCount(event.target.value as string);
  };

  const handleDriverAgeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDriverAge(event.target.value as string);
  };

  const resetFilters = () => {
    setSortOption('lowestPrice');
    setVehicleCategory([]);
    setTransmission([]);
    setDriveType([]);
    setSeatCount('2+');
    setDriverAge('25+');
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
        <Button variant="contained" size='small' color="secondary" onClick={resetFilters}>
          Alle Filter zurücksetzen
        </Button>
      </Toolbar>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {activeMenu === 'sort' && (
          <Box sx={{ width: '300px', padding: 2 }}>
            <Typography variant="h6">Sortieren nach</Typography>
            <RadioGroup value={sortOption} onChange={handleSortChange}>
              <FormControlLabel value="lowestPrice" control={<Radio />} label="Niedrigster Preis zuerst" />
              <FormControlLabel value="highestPrice" control={<Radio />} label="Höchster Preis zuerst" />
            </RadioGroup>
          </Box>
        )}
        {activeMenu === 'vehicleCategory' && (
          <Box sx={{ width: '300px', padding: 2 }}>
            <Typography variant="h6">Fahrzeugkategorie</Typography>
            <FormControl component="fieldset">
              {availableVehicleCategories.map(category => (
                <FormControlLabel
                  key={category.id}
                  control={<Checkbox checked={vehicleCategory.some(item => item.id === category.id)} onChange={handleVehicleCategoryChange} value={category.id.toString()} />}
                  label={category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                />
              ))}
            </FormControl>
          </Box>
        )}
        {activeMenu === 'transmission' && (
          <Box sx={{ width: '300px', padding: 2 }}>
            <Typography variant="h6">Getriebe</Typography>
            <FormControl component="fieldset">
              <FormControlLabel control={<Checkbox checked={transmission.includes(Transmission.Automatik)} onChange={handleTransmissionChange} value={Transmission.Automatik} />} label="Automatik" />
              <FormControlLabel control={<Checkbox checked={transmission.includes(Transmission.Manuell)} onChange={handleTransmissionChange} value={Transmission.Manuell} />} label="Manuell" />
            </FormControl>
          </Box>
        )}
        {activeMenu === 'driveType' && (
          <Box sx={{ width: '300px', padding: 2 }}>
            <Typography variant="h6">Antrieb</Typography>
            <FormControl component="fieldset">
              <FormControlLabel control={<Checkbox checked={driveType.includes(DriverSystem.FWD)} onChange={handleDriveTypeChange} value={DriverSystem.FWD} />} label="Frontantrieb" />
              <FormControlLabel control={<Checkbox checked={driveType.includes(DriverSystem.RWD)} onChange={handleDriveTypeChange} value={DriverSystem.RWD} />} label="Heckantrieb" />
              <FormControlLabel control={<Checkbox checked={driveType.includes(DriverSystem.AWD)} onChange={handleDriveTypeChange} value={DriverSystem.AWD} />} label="Allradantrieb" />
            </FormControl>
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
      </Menu>
    </AppBar>
  );
};

export default FilterBar;
