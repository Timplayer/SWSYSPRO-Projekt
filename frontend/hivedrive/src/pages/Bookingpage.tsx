import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import CarCard from '../components/CarCardProps';
import FilterBar from '../components/Filterbar';
import withRoot from '../withRoot';
import AppAppBar from '../views/AppAppBar';
import AppFooter from '../views/AppFooter';
import CarSearchBar from '../components/CarSearchBar';
import { useLocation } from 'react-router-dom';

interface CarCard {
  name: string;
  images: string[];  // An array of image URLs
  price: string;
  transmission: string;
  passengers: number;
  luggage: number;
  kmIncluded: string;
}

const carData = {
  name: 'Tesla Model S',
  images: [
    'https://example.com/images/tesla_model_s_1.jpg',
    'https://example.com/images/tesla_model_s_2.jpg',
    'https://example.com/images/tesla_model_s_3.jpg',
  ],
  price: '100€',
  transmission: 'Automatik',
  passengers: 5,
  luggage: 2,
  kmIncluded: '200 km'
};



const Bookingpage: React.FC = () => {
  const location = useLocation();
  const { car } = location.state || {};
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    // Fetch car data from the API or database
    // Here we use static data for example purposes
    setCars([
      { name: 'VW Polo', image: 'link-to-image', price: '84,74 €', transmission: 'Manuell', passengers: 5, luggage: 1, kmIncluded: '1.200 km' },
      { name: 'Opel Mokka', image: 'link-to-image', price: '96,25 €', transmission: 'Manuell', passengers: 5, luggage: 1, kmIncluded: '1.200 km' },
      // Add more car objects as needed
    ]);
  }, []);

  return (
    <React.Fragment>
      <AppAppBar />
      <CarSearchBar />
      <FilterBar />
      <Container>
        {car ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                Details for {car.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CarCard {...carData} />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {cars.map((car, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CarCard {...carData} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Bookingpage);
