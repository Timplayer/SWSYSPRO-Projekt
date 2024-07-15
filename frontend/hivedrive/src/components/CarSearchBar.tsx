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

interface CarSearchBarProps {
  initialLocation?: number;
  initialReturnLocation?: number;
  initialPickupDate?: Date | null;
  initialReturnDate?: Date | null;
}

const CarSearchBar: React.FC<CarSearchBarProps> = ({
  initialLocation = undefined,
  initialReturnLocation = undefined,
  initialPickupDate = new Date(),
  initialReturnDate = new Date(),
}) => {
  const navigate = useNavigate();

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
      setLocations (locationsData);
    };

    fetchLocations();
  }, []);

  const handleSubmit = () => {

    if(startLocation) {

      axios.get<Availability[]>(`/api/stations/id/${startLocation}/availability`)
      .then((response) => {  
        let vehicleTypes = new Map<number, {date: Date, count: number}>();
        
        for (const availability of response.data) {
          if(returnDate && new Date(availability.time) > new Date(returnDate)){
              continue;
          }

          if (!vehicleTypes.has(availability.auto_klasse)) {
            vehicleTypes.set(availability.auto_klasse, { 
              date: new Date(availability.time),
              count: availability.availability,
            });
          }
          else 
          {
            const existingEntry = vehicleTypes.get(availability.auto_klasse);
    
            if (existingEntry && new Date(existingEntry.date) < new Date(availability.time)) {
              vehicleTypes.set(availability.auto_klasse, {
                date: new Date(availability.time),
                count: availability.availability,
              });
            }
          }
        }

        const availabilityVehicleTypes = Array.from(vehicleTypes.keys()).filter((id: number) => {
          const type = vehicleTypes.get(id);
          return type && type.count > 0;
        });

        navigate('/bookingpage', {
          state: {
            startLocation : startLocation,
            returnLocation: splitLocation ? returnLocation : undefined,
            pickupDate: pickupDate,
            returnDate : returnDate,
            availabilityVehicleTypes: availabilityVehicleTypes,
          },
        });
        
      });
    }
    else
    {
      
      navigate('/bookingpage', {
        state: {
          startLocation,
          returnLocation: splitLocation ? returnLocation : undefined,
          pickupDate,
          returnDate
        },
      });
    }
  };

  const now = new Date();

  return (
    <Container maxWidth={false} sx={{ backgroundColor: 'secondary.light', width: '100%', padding: '16px' }}>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2} alignItems="center" wrap="nowrap">
          <Grid item xs={12} sm={4} justifyContent="left" alignItems="center">
            <TextField
              select
              label={splitLocation ? 'Abholung' : 'Abholung und Rückgabe'}
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
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
                onAccept={(date) => {
                  setPickupDate(date);
                  if (date && returnDate && date > returnDate) {
                    setReturnDate(date);
                  }
                }}
                minDate={now}
                minTime={new Date(now.getTime() - 1 * 60 * 1000)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDateTimePicker
                ampm={false}
                label="Rückgabedatum"
                value={returnDate}
                onAccept={(date) => setReturnDate(date)}
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
