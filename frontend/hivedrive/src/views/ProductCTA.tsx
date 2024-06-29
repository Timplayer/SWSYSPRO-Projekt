import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import Button from '../components/Button';
import bild from '../../images/bonusimage.png'
import { Link} from 'react-router-dom';

function ProductCTA() {

  return (
    <Container component="section" sx={{ mt: 10, display: 'flex' }}>
      <Grid container>
        <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              bgcolor: 'warning.main',
              py: 8,
              px: 3,
            }}
          >
            <Box>
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
              <Button variant="contained" color="primary" size="large"  component={Link}  to="/bonus">
                {'Jetzt anmelden'}
              </Button>
            </Box>

          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: { md: 'block', xs: 'none' }, position: 'relative' }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -67,
              left: -67,
              right: 0,
              bottom: 0,
              width: '100%',
              
            }}
          />
          <Box
            component="img"
            src={bild}
            sx={{
              position: 'absolute',
              top: -28,
              left: -28,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: 600,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductCTA;