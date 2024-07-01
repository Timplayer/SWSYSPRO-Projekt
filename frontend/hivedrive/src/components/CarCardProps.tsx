import React, { useState } from 'react';
import { Card, CardContent, Typography, CardMedia, IconButton, Button } from '@mui/material';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface CarCardProps {
  name: string;
  images: string[]; // An array of image URLs
  price: string;
  transmission: string;
  passengers: number;
  luggage: number;
  kmIncluded: string;
  onBook: () => void; // New prop for handling book button click
}

const CarCard: React.FC<CarCardProps> = ({ name, images, price, transmission, passengers, luggage, kmIncluded, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <Card>
      <div style={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="140"
          image={images[currentImageIndex]}
          alt={name}
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
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2">{`Inkl. ${kmIncluded}`}</Typography>
        <Typography variant="body2">{`${price} /Tag`}</Typography>
        <div>
          <IconButton>
            <DriveEtaIcon />
          </IconButton>
          <Typography variant="body2">{`${passengers} Passengers`}</Typography>
          <Typography variant="body2">{`${luggage} Luggage`}</Typography>
          <Typography variant="body2">{transmission}</Typography>
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
