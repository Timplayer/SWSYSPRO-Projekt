import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const PromoContainer = styled(Container)(({ theme }) => ({
  height: '75vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  textAlign: 'center',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

const PromoBox = styled(Box)(({ theme }) => ({
  maxWidth: '800px',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const PromoButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const PromoAdvertisement: React.FC = () => {
  return (
    <PromoContainer maxWidth="lg">
      <PromoBox>
        <Typography variant="h3" component="h1" gutterBottom>
          Unser neues Bonusprogramm
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Fahren Sie oft mit uns? Dann profitieren Sie von unserem neuen Bonusprogramm!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Kunden, die häufig fahren, erhalten Freifahrten, Rabatte und Upgrades auf bessere Fahrzeuge. 
          Melden Sie sich jetzt an und sichern Sie sich Ihre Vorteile!
        </Typography>
        <PromoButton variant="contained" color="primary" size="large">
          Jetzt Anmelden
        </PromoButton>
      </PromoBox>
    </PromoContainer>
  );
};

export default PromoAdvertisement;
