import React, { useState } from 'react';
import { Card, CardContent, Typography, CardMedia, IconButton, Button } from '@mui/material';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Transmission, Vehicle as Car } from '../Types';

interface CarCardProps {
  car: Car
  onBook: () => void; 
}

const CarCard: React.FC<CarCardProps> = ({car, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    if(car.images){
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + car.images.length) % car.images.length);
    }
  };

  const handleNextImage = () => {
    if(car.images){
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
    }
  };

  const getTransmissonName = (transmission: Transmission): string => {
    switch (transmission) {
        case Transmission.Automatik:
          return "Automatik"
          case Transmission.Manuell:
            return "Manuell";
        default:
            return "";
    }
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
        <Typography variant="body2">{`${car.pricePerHour}€/ProStunde`}</Typography>
        <div>
          <IconButton>
            <DriveEtaIcon />
          </IconButton>
          <Typography variant="body2">{`${car.maxSeatCount} Sitzplätze`}</Typography>
          <Typography variant="body2">{getTransmissonName(car.transmission)}</Typography>
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
