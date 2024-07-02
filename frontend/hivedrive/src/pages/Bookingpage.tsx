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

//const carData = [
//  {
//    name: 'VW Polo',
//    images: [
//      'https://example.com/images/vw_polo_1.jpg',
//      'https://example.com/images/vw_polo_2.jpg',
//    ],
//    price: '84,74 €',
//    transmission: 'Manuell',
//    passengers: 5,
//    luggage: 1,
//    kmIncluded: '1.200 km',
//  },
//  {
//    name: 'Opel Mokka',
//    images: [
//      'https://example.com/images/opel_mokka_1.jpg',
//      'https://example.com/images/opel_mokka_2.jpg',
//    ],
//    price: '96,25 €',
//    transmission: 'Manuell',
//    passengers: 5,
//    luggage: 1,
//    kmIncluded: '1.200 km',
//  },
//  
//];

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { location: searchLocation, returnLocation, pickupDate, returnDate } = location.state || {};
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
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

  return (
    <React.Fragment>
      <AppAppBar />
      <CarSearchBar
        initialLocation={searchLocation}
        initialReturnLocation={returnLocation}
        initialPickupDate={pickupDate}
        initialReturnDate={returnDate}
      />
      <FilterBar />
      <Container sx={{ 
          marginTop: 7, 
          marginBottom: 7, 
        }}>
        {cars.length > 0 ? (
          <Grid container spacing={3}>
            {cars.map((car, index) => (
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
