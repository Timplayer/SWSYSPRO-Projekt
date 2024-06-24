import React from 'react';
import { Container, Typography } from '@mui/material';

const AboBookingPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Buchungsseite
      </Typography>
      <Typography variant="body1">
        Hier können Sie Ihr Abonnement buchen.
      </Typography>
      {/* Fügen Sie hier Ihr Buchungsformular oder weitere Buchungsinformationen hinzu */}
    </Container>
  );
};

export default AboBookingPage;
