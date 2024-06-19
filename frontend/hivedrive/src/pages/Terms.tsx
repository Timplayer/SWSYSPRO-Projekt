import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '../components/Typography';
import AppAppBar from '../views/AppAppBar';
import AppFooter from '../views/AppFooter';
import withRoot from '../withRoot';
import termsData from '../data/terms.json'; 

function Terms() {
  return (
    <React.Fragment>
      <AppAppBar />
      <Container>
        <Box sx={{ mt: 7, mb: 12 }}>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            {termsData.title}
          </Typography>
          {termsData.sections.map((section, index) => (
            <Box key={index} sx={{ mt: 5 }}>
              <Typography variant="h5" gutterBottom>
                {section.heading}
              </Typography>
              <Typography variant="body1">
                {section.content}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Terms);
