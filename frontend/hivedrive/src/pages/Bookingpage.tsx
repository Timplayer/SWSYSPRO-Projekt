import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Grid, Typography } from '@mui/material';
import CarCard from '../components/CarCardProps';
import FilterBar from '../components/Filterbar';
import withRoot from '../withRoot';
import AppAppBar from '../views/AppAppBar';
import AppFooter from '../views/AppFooter';
import CarSearchBar from '../components/CarSearchBar';
import keycloak from '../keycloak';
import axios from 'axios';
import { Reservation, Transmission, VehicleCategory, VehicleType, DriverSystem } from '../Types.ts';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { location: startLocation, returnLocation, pickupDate, returnDate } = location.state || {};

  const [cars, setCars] = useState<VehicleType[]>([]);
  const [reservation, setReservation] = useState<Reservation>();

  const [vehicleCategories, setVehicleCategories] = useState<VehicleCategory[]>([]);
  const [filterCategories, setFilterCategories] = useState<VehicleCategory[]>([]);

  const [sortOption, setSortOption] = useState('lowestPrice');
  const [transmission, setTransmission] = useState<Transmission[]>([]);
  const [driveType, setDriveType] = useState<DriverSystem[]>([]);
  const [seatCount, setSeatCount] = useState('2+'); 
  const [driverAge, setDriverAge] = useState('25+'); 

  useEffect(() => {
    const fetchVehicleCategories = async () => {
      const response = await axios.get('/api/vehicleCategories');
      setVehicleCategories(response.data);
    };

    const fetchLocations = async () => {
      const response = await axios.get('/api/vehicleTypes');
      const carData = response.data;
      
      console.log(response);

      const fetchImages = async (carId: number) => {
        const imageResponse = await axios.get(`/api/images/vehicleCategories/id/${carId}`);
        return imageResponse.data.map((img: { url: string }) => img.url);
      };

      const carsWithImages = await Promise.all(
        carData.map(async (car: VehicleType) => {
          const images = {}; // await fetchImages(car.id);
          return { ...car, images };
        })
      );
      
      setCars(carsWithImages);
    };
   
    fetchVehicleCategories();
    fetchLocations();
  }, []);

  const handleBook = (car: VehicleType) => {
    if (!keycloak.authenticated) {
      navigate('/login');
    } else {
      navigate('/carbooking', {
        state: {
          car,
          startLocation,
          returnLocation,
          pickupDate,
          returnDate,
        },
      });
    }
  };

  const filterCars = (cars: VehicleType[]) => {
    return cars.filter(car => {
      const filterCategoryNames = filterCategories.map(category => category.name);
      console.log(cars);

      const selectedCategoryIds = vehicleCategories
        .filter(category => filterCategoryNames.includes(category.name))
        .map(category => category.id);

      const matchesVehicleCategory = filterCategories.length === 0 || selectedCategoryIds.includes(car.vehicleCategory);
      const matchesTransmission = transmission.length === 0 || transmission.includes(car.transmission);
      const matchesDriveType = driveType.length === 0 || driveType.includes(car.driverSystem);
      const matchesSeatCount = !seatCount || car.maxSeatCount >= parseInt(seatCount, 10);

      return matchesVehicleCategory && matchesTransmission && matchesDriveType && matchesSeatCount;
    });
  };

  const filteredCars = filterCars(cars);

  return (
    <React.Fragment>
      <AppAppBar />
      <CarSearchBar
        initialLocation={startLocation}
        initialReturnLocation={returnLocation}
        initialPickupDate={pickupDate}
        initialReturnDate={returnDate}
      />
      <FilterBar
        sortOption={sortOption}
        setSortOption={setSortOption}
        vehicleCategory={filterCategories}
        setVehicleCategory={setFilterCategories}
        transmission={transmission}
        setTransmission={setTransmission}
        driveType={driveType}
        setDriveType={setDriveType}
        seatCount={seatCount}
        setSeatCount={setSeatCount}
        driverAge={driverAge}
        setDriverAge={setDriverAge}
      />
      <Container sx={{ 
          marginTop: 7, 
          marginBottom: 7, 
        }}>
        {filteredCars.length > 0 ? (
          <Grid container spacing={3}>
            {filteredCars.map((car, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CarCard
                  car={car}
                  onBook={() => handleBook(car)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" gutterBottom>
            Keine Autos gefunden für die ausgewählten Kriterien.
          </Typography>
        )}
      </Container>
      <AppFooter />
    </React.Fragment>
  );
};

export default withRoot(BookingPage);
