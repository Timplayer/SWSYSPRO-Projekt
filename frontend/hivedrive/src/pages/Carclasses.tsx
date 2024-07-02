import React from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent } from '@mui/material';
import withRoot from '../withRoot';
import AppFooter from '../views/AppFooter';
import AppAppBar from '../views/AppAppBar';
import limousine from '../../images/limousine.png';
import coupe from '../../images/coupe.png';
import suv from '../../images/suv.png';

const autoKlassen = [
  {
    name: 'Limousine',
    description: 'Eine Limousine bietet Komfort und Stil. Sie ist ideal für lange Fahrten und Geschäftsreisen.',
    image: limousine,
  },
  {
    name: 'SUV',
    description: 'Ein SUV ist vielseitig und geländetauglich. Perfekt für Abenteuer und Familienausflüge.',
    image: suv,
  },
  {
    name: 'Coupé',
    description: 'Ein Coupé ist sportlich und elegant. Ideal für Fahrer, die ein dynamisches Fahrerlebnis suchen.',
    image: coupe,
  },
  {
    name: 'Cabriolet',
    description: 'Ein Cabriolet bietet ein offenes Fahrerlebnis. Perfekt für sonnige Tage und stilvolle Fahrten.',
    image: 'https://example.com/cabriolet.jpg',
  },
  {
    name: 'Kombi',
    description: 'Ein Kombi bietet zusätzlichen Stauraum. Perfekt für große Einkäufe und Familienreisen.',
    image: 'https://example.com/kombi.jpg',
  },
  {
    name: 'Elektrisches Fahrzeug',
    description: 'Ein elektrisches Fahrzeug ist umweltfreundlich und effizient. Perfekt für die Stadt und lange Fahrten.',
    image: 'https://example.com/elektrisches_fahrzeug.jpg',
  },
  {
    name: 'Luxus Fahrzeug',
    description: 'Ein Luxus Fahrzeug bietet höchsten Komfort und modernste Technik. Ideal für anspruchsvolle Fahrer.',
    image: 'https://example.com/luxus_fahrzeug.jpg',
  },
  {
    name: 'Spezial Fahrzeuge',
    description: 'Besondere Fahrzeuge, die spezielle Eigenschaften oder Besonderheiten aufweisen oder sehr selten sind',
    image: 'https://example.com/luxus_fahrzeug.jpg',
  },
];

const Carclasses: React.FC = () => {
  return (
    <React.Fragment>
    <AppAppBar/>
      <Container>
        <Grid container spacing={3} style={{ marginTop: '16px', marginBottom: '40px' }}>
          {autoKlassen.map((klasse) => (
            <Grid item xs={12} sm={6} md={4} key={klasse.name}>
              <Card>
                <CardMedia
                  component="img"
                  height="160"
                  image={klasse.image}
                  alt={klasse.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {klasse.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {klasse.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    <AppFooter/>
    </React.Fragment>
  );
};

export default withRoot(Carclasses);
