import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import AppAppBar from '../views/AppAppBar';
import AppFooter from '../views/AppFooter';
import withRoot from '../withRoot';
import opensourcedata from '../data/OpenSource.json';
import { Box } from '@mui/material';

function OpenSourcethings() {
  return (
    <React.Fragment>
      <AppAppBar />
      <Container>
        <Box sx={{ mt: 7, mb: 12, color: '#ffffff' }}>
          <Typography variant="h3" gutterBottom marked="center" align="center" sx={{ color: '#ff9800' }}>
            {opensourcedata.title}
          </Typography>
          {opensourcedata.sections.map((section, index) => (
            <Box key={index} sx={{ mt: 5 }}>
              <Typography variant="h5" gutterBottom>
                {section.heading}
              </Typography>
              <Typography variant="body1">
                {section.content}
                {section.contentHeader}
                <br/>
                <br/>
                {section.body}
                <br/>
                <br/>
                {section.notice}
                <br/>
                <br/>
                {section.conditions}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(OpenSourcethings);
