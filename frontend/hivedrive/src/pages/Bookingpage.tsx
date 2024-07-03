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
import { Car } from './Types.ts';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { location: searchLocation, returnLocation, pickupDate, returnDate } = location.state || {};
  const [cars, setCars] = useState<Car[]>([]);
  const [vehicleCategories, setVehicleCategories] = useState<{id: number, name: string}[]>([]);

  const [sortOption, setSortOption] = React.useState('lowestPrice');
  const [vehicleCategory, setVehicleCategory] = React.useState<string[]>([]);
  const [transmission, setTransmission] = React.useState(''); 
  const [driveType, setDriveType] = React.useState(''); 
  const [seatCount, setSeatCount] = React.useState('2+'); 
  const [driverAge, setDriverAge] = React.useState('25+'); 

  useEffect(() => {
    const fetchVehicleCategories = async () => {
      const response = await axios.get('/api/vehicleCategories');
      setVehicleCategories(response.data);
    };

    const fetchLocations = async () => {
      const response = await axios.get('/api/vehicleTypes');
      const carData = response.data;
  
      const fetchImages = async (carId: number) => {
        const imageResponse = await axios.get(`/api/images/vehicleCategories/id/${carId}`);
        return imageResponse.data.map((img: { url: string }) => img.url);
      };

      const carsWithImages = await Promise.all(
        carData.map(async (car: Car) => {
          const images = await fetchImages(car.id);
          return { ...car, images };
        })
      );
      
      setCars(carsWithImages);
    };
   
    fetchVehicleCategories();
    fetchLocations();
  }, []);

  const handleBook = (car: Car) => {
    if (!keycloak.authenticated) {
      navigate('/login');
  } else {
    navigate('/carbooking', {
      state: {
        car,
        searchLocation,
        returnLocation,
        pickupDate,
        returnDate,
      }, });
  }
  };

  const filterCars = (cars: Car[]) => {
    return cars.filter(car => {
      const selectedCategoryIds = vehicleCategories
      .filter(category => vehicleCategory.includes(category.name))
      .map(category => category.id);

      //const matchesVehicleCategory = vehicleCategory.length === 0 || selectedCategoryIds.includes(car.vehicleCategory);
      const matchesTransmission = !transmission || car.transmission === transmission;
      const matchesSeatCount = !seatCount || car.maxSeatCount >= parseInt(seatCount, 10);
      console.log(car.transmission, transmission, matchesTransmission);
      return  matchesTransmission && matchesSeatCount;
    });
  };

  const filteredCars = filterCars(cars);

  return (
    <React.Fragment>
      <AppAppBar />
      <CarSearchBar
        initialLocation={searchLocation}
        initialReturnLocation={returnLocation}
        initialPickupDate={pickupDate}
        initialReturnDate={returnDate}
      />
     <FilterBar
        sortOption={sortOption}
        setSortOption={setSortOption}
        vehicleCategory={vehicleCategory}
        setVehicleCategory={setVehicleCategory}
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
