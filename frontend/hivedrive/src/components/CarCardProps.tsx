import React from 'react';
import { Card, CardContent, Typography, CardMedia, IconButton } from '@mui/material';
import DriveEtaIcon from '@mui/icons-material/DriveEta';

interface CarCardProps {
  name: string;
  image: string;
  price: string;
  transmission: string;
  passengers: number;
  luggage: number;
  kmIncluded: string;
}

const CarCard: React.FC<CarCardProps> = ({ name, image, price, transmission, passengers, luggage, kmIncluded }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt={name}
      />
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
      </CardContent>
    </Card>
  );
}

export default CarCard;
