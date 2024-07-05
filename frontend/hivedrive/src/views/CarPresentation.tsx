import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, Container, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useLocationContext } from '../Utils/LocationContext';
import { useNavigate } from 'react-router-dom';
import { Car } from '../pages/Types';
import axios from 'axios';
import keycloak from '../keycloak';

const CarPresentation: React.FC = () => {
  const { location } = useLocationContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);

  const nextCars = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 2) % Math.min(cars.length, 10));
  };

  const prevCars = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 2 + Math.min(cars.length, 10)) % Math.min(cars.length, 10));
  };

  const handleBookNow = (car: Car) => {
    if (!keycloak.authenticated) {
      navigate('/login');
    } else {
      navigate('/carbooking', { state: { car } });
    }
  };

  const displayedCars = cars.slice(0, 10).length > 0 ? [cars[currentIndex], cars[(currentIndex + 1) % Math.min(cars.length, 10)]] : [];

  const generateTestCars = (): Car[] => {
    return [
      {
        id: 1,
        name: 'Auto 1',
        vehicleCategory: 1,
        transmission: 'Automatik',
        maxSeatCount: 5,
        pricePerHour: 2000, // 20€/Stunde in Cent
        images: ['https://via.placeholder.com/200']
      },
      {
        id: 2,
        name: 'Auto 2',
        vehicleCategory: 2,
        transmission: 'Manuell',
        maxSeatCount: 4,
        pricePerHour: 1500, // 15€/Stunde in Cent
        images: ['https://via.placeholder.com/200']
      },
      {
        id: 3,
        name: 'Auto 3',
        vehicleCategory: 3,
        transmission: 'Automatik',
        maxSeatCount: 5,
        pricePerHour: 2500, // 25€/Stunde in Cent
        images: ['https://via.placeholder.com/200']
      },
      {
        id: 4,
        name: 'Auto 4',
        vehicleCategory: 4,
        transmission: 'Automatik',
        maxSeatCount: 2,
        pricePerHour: 3000, // 30€/Stunde in Cent
        images: ['https://via.placeholder.com/200']
      },
      {
        id: 5,
        name: 'Auto 5',
        vehicleCategory: 5,
        transmission: 'Manuell',
        maxSeatCount: 7,
        pricePerHour: 2200, // 22€/Stunde in Cent
        images: ['https://via.placeholder.com/200']
      }
    ];
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
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
        setCars(generateTestCars());
        //setCars(carsWithImages);
      } catch (error) {
        console.error("Error fetching cars: ", error);
        // Use generated test cars in case of error
        setCars(generateTestCars());
      }
    };

    fetchLocations();
  }, []);

  return (
    <Container maxWidth={false} sx={{ backgroundColor: '#1c1c1e', color: '#fff', padding: '2rem 0', textAlign: 'center', width: '100%' }}>
      <Typography color={'#ff9800'} variant="h4" gutterBottom>
        DAS PERFEKTE AUTO FÜR IHRE NÄCHSTE REISE VON {location.toUpperCase()}
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton onClick={prevCars} sx={{ color: '#fff' }} disabled={cars.length === 0}>
          <ArrowBack />
        </IconButton>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '80%' }}>
          {displayedCars.map((car, index) => (
            <Card key={index} sx={{ backgroundColor: '#2c2c2e', color: '#fff', width: '45%', margin: '0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardMedia
                component="img"
                height="200"
                image={car.images ? car.images[0] : ''}
                alt={car.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {car.name}
                </Typography>
                <Typography variant="body2" color='#ff9800'>
                  {car.vehicleCategory}
                </Typography>
                <Typography variant="body2" color='#ff9800'>
                  Ab {car.pricePerHour}
                </Typography>
                <Button variant="contained" onClick={() => handleBookNow(car)} sx={{ backgroundColor: '#ff5c00', color: '#fff', '&:hover': { backgroundColor: '#ff7c00' }, marginTop: '1rem' }}>
                  Jetzt buchen
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
        <IconButton onClick={nextCars} sx={{ color: '#fff' }} disabled={cars.length === 0}>
          <ArrowForward />
        </IconButton>
      </Box>
    </Container>
  );
};

export default CarPresentation;
