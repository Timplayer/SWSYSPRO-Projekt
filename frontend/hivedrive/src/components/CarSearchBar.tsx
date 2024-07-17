import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box, Container, Grid, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Availability } from '../Types';
import { checkAvilableVehicaleTypes } from '../Utils/Utils';
import { useLocationContext } from '../Utils/LocationContext';

interface CarSearchBarProps {
  initialLocation?: number;
  initialReturnLocation?: number;
  initialPickupDate?: Date | null;
  initialReturnDate?: Date | null;
  onLocationChange?: (value: number | undefined) => void;
  onReturnLocationChange?: (value: number | undefined) => void;
  onPickupDateChange?: (value: Date | null) => void;
  onReturnDateChange?: (value: Date | null) => void;
}

const CarSearchBar: React.FC<CarSearchBarProps> = ({
  initialLocation = undefined,
  initialReturnLocation = undefined,
  initialPickupDate = new Date(),
  initialReturnDate = new Date(),
  onLocationChange,
  onReturnLocationChange,
  onPickupDateChange,
  onReturnDateChange,
}) => {
  const navigate = useNavigate();
  const now = new Date();
  const { location, setLocation } = useLocationContext();

  const [locations, setLocations] = useState<Array<{ label: string, value: number }>>([]);

  const [startLocation, setStartLocation] = useState<number | undefined>(initialLocation);
  const [returnLocation, setReturnLocation] = useState<number | undefined>(initialReturnLocation);

  const [pickupDate, setPickupDate] = useState<Date | null>(initialPickupDate);
  const [returnDate, setReturnDate] = useState<Date | null>(initialReturnDate);

  const [splitLocation, setSplitLocation] = useState<boolean>(initialReturnLocation !== undefined);

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await axios.get('/api/stations');
      const locationsData = response.data.map((location: any) => ({
        label: location.name,
        value: location.id,
      }));
      setLocations(locationsData);
    };

    fetchLocations();
  }, []);

  const handleSubmit = () => {

    if (startLocation) {
      axios.get<Availability[]>(`/api/stations/id/${startLocation}/availability`)
      .then((response) => {  
            
        navigate('/bookingpage', {
          state: {
            startLocation : startLocation,
            returnLocation: splitLocation ? returnLocation : undefined,
            pickupDate: pickupDate,
            returnDate : returnDate,
            availabilityVehicleTypes: checkAvilableVehicaleTypes(response.data, pickupDate !== null ? pickupDate : undefined),
          },
        });
      });
    } 
    else 
    {
      navigate('/bookingpage', {
        state: {
          startLocation: startLocation,
          returnLocation: splitLocation ? returnLocation : undefined,
          pickupDate: pickupDate,
          returnDate: returnDate,
          availabilityVehicleTypes: [],
        },
      });
    }
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <Container maxWidth={false} sx={{ backgroundColor: 'secondary.light', width: '100%', padding: '16px' }}>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2} alignItems="center" wrap="nowrap">
          <Grid item xs={12} sm={4} justifyContent="left" alignItems="center">
            <TextField
              select
              label={splitLocation ? 'Abholung' : 'Abholung und Rückgabe'}
              value={startLocation}
              onChange={(e) => {
                setLocation(e.target.value);
                const value = e.target.value;
                setStartLocation(value);
                onLocationChange && onLocationChange(value);
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
              {/* Empty Grid to keep alignment */}
            </Grid>
          )}
          {splitLocation && (
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Rückgabe"
                value={returnLocation}
                onChange={(e) => {
                  const value = e.target.value;
                  setReturnLocation(value);
                  onReturnLocationChange && onReturnLocationChange(value);
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
                onAccept={(date) => {
                  setPickupDate(date);
                  onPickupDateChange && onPickupDateChange(date);
                  if (date && returnDate && date > returnDate) {
                    setReturnDate(date);
                    onReturnDateChange && onReturnDateChange(date);
                  }
                }}
                onChange={(date) => {
                  setPickupDate(date);
                  onPickupDateChange && onPickupDateChange(date);
                }} 
                minDate={now}
                minTime={pickupDate && isSameDay(pickupDate, now) ? new Date(now.getTime() - 1 * 60 * 1000) : undefined}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDateTimePicker
                ampm={false}
                label="Rückgabedatum"
                value={returnDate}
                onAccept={(date) => {
                  setReturnDate(date);
                  onReturnDateChange && onReturnDateChange(date);
                }}
                onChange={(date) => {
                  setReturnDate(date);
                  onReturnDateChange && onReturnDateChange(date);
                }}
                minDate={pickupDate || now}
                minTime={returnDate && pickupDate && isSameDay(returnDate, pickupDate) ? new Date(pickupDate.getTime() - 1 * 60 * 1000) : undefined}
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