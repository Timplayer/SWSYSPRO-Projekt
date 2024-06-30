import React from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppFooter from '../views/AppFooter';
import AppAppBar from '../views/AppAppBar';
import withRoot from '../withRoot';

const subscriptionPlans = [
  { title: 'Basic', price: '29€/Monat', features: ['Feature 1', 'Feature 2', 'Feature 3'] },
  { title: 'Standard', price: '49€/Monat', features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'] },
  { title: 'Premium', price: '79€/Monat', features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'] },
];

const Abopage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate('/subscriptionbooking');
  };

  return (
    <React.Fragment>
    <AppAppBar/>
    <Container>
      <Typography variant="h2" gutterBottom>
        Abonnement Modelle
      </Typography>
      <Grid container spacing={3}>
        {subscriptionPlans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.title}>
            <Card>
              <CardContent>
                <Typography variant="h5">{plan.title}</Typography>
                <Typography variant="h6">{plan.price}</Typography>
                <List>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" onClick={handleSubscribe}>
                  Abo buchen
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" gutterBottom>
        Vorteile
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Vorteil 1" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Vorteil 2" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Vorteil 3" />
        </ListItem>
      </List>

      <Typography variant="h4" gutterBottom>
        Schritt für Schritt Anleitung
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Schritt 1: ..." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Schritt 2: ..." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Schritt 3: ..." />
        </ListItem>
      </List>
    </Container>
    <AppFooter/>
    </React.Fragment>
  );
};

export default withRoot(Abopage);