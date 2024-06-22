import * as React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import { Link } from 'react-router-dom';
import withRoot from '../withRoot';



function ProductSmokingHero() {
  return (
    <Container
      component="section"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 9 }}
    >
      <Button
        sx={{
          border: '4px solid',
          borderColor: 'secondary.main',
          borderRadius: 0,
          height: 'auto',
          py: 2,
          px: 5,
        }}
        component={Link} to="/help"
      >
        <Typography variant="h4" component="span" color="secondary.light" >
          Haben Sie Fragen oder brauchen Sie hilfe?
        </Typography>
      </Button>
      {/* <Box
        component="img"
        src="/static/themes/onepirate/productBuoy.svg"
        alt="buoy"
        sx={{ width: 60 }}
      /> */}
    </Container>
  );
}

export default withRoot(ProductSmokingHero);
