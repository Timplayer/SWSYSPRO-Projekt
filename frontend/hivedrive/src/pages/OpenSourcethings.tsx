import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import AppAppBar from '../views/AppAppBar';
import AppFooter from '../views/AppFooter';
import withRoot from '../withRoot';

function OpenSourcethings() {
  return (
    <React.Fragment>
      <AppAppBar />
      <Container>
        <Typography color={'#FFFFFF'}>
            coming soon
        </Typography>
      </Container>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(OpenSourcethings);