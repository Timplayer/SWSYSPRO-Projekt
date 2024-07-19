import React from 'react';
import { Box,Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/system';

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
    <Container maxWidth={false} sx={{ backgroundColor: '#FFFF', width: '100%', padding: '16px' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
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
      </Box>
    </Container>
  );
};

export default PromoAdvertisement;
