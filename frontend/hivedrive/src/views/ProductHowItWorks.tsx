import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '../components/Button';
import Typography from '../components/Typography';
import bild1 from '../../images/standortchoose.png'; 
import bild2 from '../../images/autowaehlen.png'; 
import bild3 from '../../images/losfahren.png'; 
import { Link as RouterLink } from 'react-router-dom';

const item: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

const number = {
  fontSize: 24,
  fontFamily: 'default',
  color: 'secondary.main',
  fontWeight: 'medium',
};

const image = {
  height: 90,
  my: 4,
};

function ProductHowItWorks() {
  return (
    <Box
      component="section"
      sx={{ display: 'flex', bgcolor: 'secondary.light', overflow: 'hidden' }}
    >
      <Container
        sx={{
          mt: 10,
          mb: 15,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src=""
          alt="curvy lines"
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            top: -180,
            opacity: 0.7,
          }}
        />
        <Typography variant="h4" marked="center" component="h2" sx={{ mb: 14 }}>
          So einfach geht's:
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}><Box sx={{color: 'black'}}>1.</Box></Box>
                <Box
                  component="img"
                  sx={image}  
                  src={bild1}  
                  alt="choose start location"
                />
                <Typography variant="h5" align="center">
                  Startort wählen
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}><Box sx={{color: 'black'}}>2.</Box></Box>
                <Box
                  component="img"
                  sx={image}  
                  src={bild2}  
                  alt="car choose"
                />
                <Typography variant="h5" align="center">
                  Auto aussuchen
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}> <Box sx={{color: 'black'}}>3.</Box></Box>
                <Box
                  component="img"
                  sx={image}  
                  src={bild3}  
                  alt="start driving"
                />
                <Typography variant="h5" align="center">
                  Losfahren
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </div>
        <Button
          color="secondary"
          size="large"
          variant="contained"
          component={RouterLink}
          to="/bookingpage"
          sx={{ mt: 8 }}
        >
          Get started
        </Button>
      </Container>
    </Box>
  );
}

export default ProductHowItWorks;
