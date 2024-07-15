import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import AppAppBar from '../views/AppAppBar';
import AppFooter from '../views/AppFooter';
import withRoot from '../withRoot';

const AboBookingPage: React.FC = () => {
  return (
    <React.Fragment>
    <AppAppBar/>
    <Container>
    <Box 
        sx={{ 
          marginTop: 7, 
          marginBottom: 12, 
          backgroundColor: 'white', 
          padding: 2, 
          borderRadius: 4, 
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
        }}
      > 
      <Typography variant="h2" gutterBottom>
        Buchungsseite
      </Typography>
      <Typography variant="body1">
        Hier können Sie bald Ihr Abonnement buchen.
      </Typography>
      </Box>  
    </Container>
    <AppFooter/>
    </React.Fragment>
  );
};

export default withRoot(AboBookingPage);
