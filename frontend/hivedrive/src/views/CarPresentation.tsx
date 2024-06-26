import React, { useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, Container, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useLocationContext } from '../Utils/LocationContext';
import { useNavigate } from 'react-router-dom';

const cars = [
  {
    name: "FORD MUSTANG MACH 1",
    type: "COUPE",
    price: "600,29 € / Tag",
    image: '/images/2021-ford-mustang-mach-1.png',
    electric: false,
  },
  {
    name: "VW T-Roc",
    type: "SUV",
    price: "126,98 € / Tag",
    image: '/images/vw-troc.png',
    electric: false,
  },
  {
    name: "Tesla Model 3",
    type: "Limousine",
    price: "150,00 € / Tag",
    image: '/images/tesla-model-3.png',
    electric: true,
  },
  {
    name: "BMW X5",
    type: "SUV",
    price: "200,00 € / Tag",
    image: '/images/bmw-x5.png',
    electric: false,
  },
];

const CarPresentation: React.FC = () => {
  const { location } = useLocationContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextCars = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 2) % cars.length);
  };

  const prevCars = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 2 + cars.length) % cars.length);
  };

  const handleBookNow = (car: any) => {
    navigate('/bookingpage', { state: { car } });
  };

  const displayedCars = [cars[currentIndex], cars[(currentIndex + 1) % cars.length]];

  return (
    <Container maxWidth={false} sx={{ backgroundColor: '#1c1c1e', color: '#fff', padding: '2rem 0', textAlign: 'center', width: '100%' }}>
      <Typography color={'#ff9800'} variant="h4" gutterBottom>
        DAS PERFEKTE AUTO FÜR IHRE NÄCHSTE REISE VON {location.toUpperCase()}
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton onClick={prevCars} sx={{ color: '#fff' }}>
          <ArrowBack />
        </IconButton>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '80%' }}>
          {displayedCars.map((car, index) => (
            <Card key={index} sx={{ backgroundColor: '#2c2c2e', color: '#fff', width: '45%', margin: '0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardMedia
                component="img"
                height="200"
                image={car.image}
                alt={car.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {car.name}
                </Typography>
                <Typography variant="body2" color='#ff9800'>
                  {car.type}
                </Typography>
                <Typography variant="body2" color='#ff9800'>
                  Ab {car.price}
                </Typography>
                {car.electric && (
                  <Typography variant="body2" color='#ff9800'>
                    Elektro
                  </Typography>
                )}
                <Button variant="contained" onClick={() => handleBookNow(car)} sx={{ backgroundColor: '#ff5c00', color: '#fff', '&:hover': { backgroundColor: '#ff7c00' }, marginTop: '1rem' }}>
                  Jetzt buchen
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
        <IconButton onClick={nextCars} sx={{ color: '#fff' }}>
          <ArrowForward />
        </IconButton>
      </Box>
    </Container>
  );
};

export default CarPresentation;
