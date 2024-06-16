import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import TextField from '../components/TextField';
import Snackbar from '../components/Snackbar';
import Button from '../components/Button';

function ProductCTA() {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            {/* <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
              <Typography variant="h2" component="h2" gutterBottom>
                Receive offers
              </Typography>
              <Typography variant="h5">
                Taste the holidays of the everyday close to home.
              </Typography>
              <TextField
                noBorder
                placeholder="Your email"
                variant="standard"
                sx={{ width: '100%', mt: 3, mb: 2 }}
              />
              <Button
                type="submit"
                color="primary"
                variant="contained"
                sx={{ width: '100%' }}
              >
                Keep me updated
              </Button>
            </Box> */}

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
              <Button variant="contained" color="primary" size="large">
                Jetzt Anmelden
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
              // background: 'url(/static/themes/onepirate/productCTAImageDots.png)',
            }}
          />
          <Box
            component="img"
            // src="https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&w=750"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Silver_Ferrari_Luxury_Sports_Car.jpg/640px-Silver_Ferrari_Luxury_Sports_Car.jpg"
            alt="call to action"
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
      {/* <Snackbar
        open={open}
        closeFunc={handleClose}
        message="We will send you our best offers, once a week."
      /> */}
    </Container>
  );
}

export default ProductCTA;
