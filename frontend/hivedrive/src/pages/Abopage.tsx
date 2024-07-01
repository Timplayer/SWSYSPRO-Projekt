import React from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppFooter from '../views/AppFooter';
import AppAppBar from '../views/AppAppBar';
import withRoot from '../withRoot';
import CheckIcon from '@mui/icons-material/Check';
import Step1Icon from '@mui/icons-material/LooksOne';
import Step2Icon from '@mui/icons-material/LooksTwo';
import Step3Icon from '@mui/icons-material/Looks3';
import keycloak from '../keycloak';

const subscriptionPlans = [
  { 
    title: 'Basic', 
    price: '99€/Monat', 
    features: ['+300 Freikilometer pro Tag', 'Grundversicherung', 'Monatliche Überraschunsfreifahrt'] 
  },
  { 
    title: 'Standard', 
    price: '199€/Monat', 
    features: ['+500 Freikilometer pro Tag', 'Vollkaskoversicherung mit geringer Selbstbeteiligung', 'Priorisierter Support', 'Kostenloser Zweitfahrer', 'Monatliche Überraschunsfreifahrt'] 
  },
  { 
    title: 'Premium', 
    price: '300€/Monat', 
    features: ['+1000 Freikilometer pro Tag', 'Vollkaskoversicherung ohne Selbstbeteiligung', '24/7 Premium Support', 'Kostenloser Zweitfahrer', 'Kostenlose Upgrades auf Premiumfahrzeuge', 'Monatliche Überraschunsfreifahrt'] 
  },
];

const steps = [
  { 
    icon: <Step1Icon />, 
    description: 'Registrieren Sie sich für unser Abo Programm.' 
  },
  { 
    icon: <Step2Icon />, 
    description: 'Wählen Sie das gewünschte Abonnement-Modell.' 
  },
  { 
    icon: <Step3Icon />, 
    description: 'Nutzen Sie die exklusiven Abo Vorteile.' 
  },
];

const Abopage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
      if (!keycloak.authenticated) {
        navigate('/login');
    } else {
        navigate('/subscriptionbooking');
    }
  };

  return (
    <React.Fragment>
      <AppAppBar/>
      <Container>
        <Typography variant="h2" gutterBottom style={{color:'#ff9800'}}>
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
                        <CheckIcon style={{ marginRight: 8 }} />
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

        <Typography variant="h4" gutterBottom style={{ marginTop: '2rem', color:'#ffcc80' }}>
          Schritt für Schritt Anleitung
        </Typography>
        <List >
          {steps.map((step, index) => (
            <ListItem key={index} style={{color:'#ffcc80'}}>
              {step.icon}
              <ListItemText primary={step.description} style={{ marginLeft: 16, color:'#ffffff' }} />
            </ListItem>
          ))}
        </List>
      </Container>
      <AppFooter/>
    </React.Fragment>
  );
};

export default withRoot(Abopage);
