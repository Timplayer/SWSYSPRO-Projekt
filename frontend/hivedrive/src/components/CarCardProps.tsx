import React, { useState } from 'react';
import { Card, CardContent, Typography, CardMedia, IconButton, Button } from '@mui/material';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Car } from '../pages/Types';

interface CarCardProps {
  car: Car
  onBook: () => void; // New prop for handling book button click
}

const CarCard: React.FC<CarCardProps> = ({car, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + car.images.length) % car.images.length);
  };

  const handleNextImage = () => {
    console.log(car.images);
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
  };

  return (
    <Card>
      <div style={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="140"
          image={ car.images[currentImageIndex]}
          alt={car.name}
        />
        <IconButton
          onClick={handlePrevImage}
          style={{ position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)' }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={handleNextImage}
          style={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)' }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
      <CardContent>
        <Typography variant="h6">{car.name}</Typography>
        <Typography variant="body2">{`Inkl. ${0}`}</Typography>
        <Typography variant="body2">{`${car.pricePerHour} /Tag`}</Typography>
        <div>
          <IconButton>
            <DriveEtaIcon />
          </IconButton>
          <Typography variant="body2">{`${car.maxSeatCount} Passengers`}</Typography>
          <Typography variant="body2">{car.transmission}</Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="contained" color="primary" onClick={onBook}>
            Buchen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default CarCard;
