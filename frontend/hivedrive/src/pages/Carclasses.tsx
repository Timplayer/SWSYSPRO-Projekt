import React from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent } from '@mui/material';
import withRoot from '../withRoot';
import AppFooter from '../views/AppFooter';
import AppAppBar from '../views/AppAppBar';

const autoKlassen = [
  {
    name: 'Limousine',
    description: 'Eine Limousine bietet Komfort und Stil. Sie ist ideal für lange Fahrten und Geschäftsreisen.',
    image: 'https://example.com/limousine.jpg',
  },
  {
    name: 'SUV',
    description: 'Ein SUV ist vielseitig und geländetauglich. Perfekt für Abenteuer und Familienausflüge.',
    image: 'https://example.com/suv.jpg',
  },
  {
    name: 'Coupé',
    description: 'Ein Coupé ist sportlich und elegant. Ideal für Fahrer, die ein dynamisches Fahrerlebnis suchen.',
    image: 'https://example.com/coupe.jpg',
  },
  {
    name: 'Cabriolet',
    description: 'Ein Cabriolet bietet ein offenes Fahrerlebnis. Perfekt für sonnige Tage und stilvolle Fahrten.',
    image: 'https://example.com/cabriolet.jpg',
  },
  {
    name: 'Familienauto',
    description: 'Ein Familienauto bietet viel Platz und Komfort. Ideal für Familienausflüge und lange Reisen.',
    image: 'https://example.com/familienauto.jpg',
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
];

const Carclasses: React.FC = () => {
  return (
    <React.Fragment>
    <AppAppBar/>
      <Container>
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          {autoKlassen.map((klasse) => (
            <Grid item xs={12} sm={6} md={4} key={klasse.name}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
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
