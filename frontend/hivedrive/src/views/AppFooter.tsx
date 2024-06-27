import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import TextField from '../components/TextField';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

function Copyright() {
  return (
    <React.Fragment>
      {'© '}
      <CustomRouterLink to="/">
        HiveDrive
      </CustomRouterLink>{' '}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const CustomRouterLink = styled(RouterLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  fontFamily: "'Roboto Condensed', sans-serif",
  '&:hover': {
    color: theme.palette.secondary.main,
  },
}));

const LANGUAGES = [
  {
    code: 'de-DE',
    name: 'Deutsch',
  },
  {
    code: 'en-US',
    name: 'English',
  },
];

export default function AppFooter() {
  return (
    <Typography
      component="footer"
      sx={{ display: 'flex', bgcolor: 'secondary.light' }}
    >
      <Container sx={{ my: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid container spacing={5} justifyContent="center">
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" gutterBottom>
              Hilfreiches
            </Typography>
            <Box component="ul" sx={{ m: 0, listStyle: 'none', p: 0 }}>
              <Box component="li" sx={{ py: 0.5 }}>
                <CustomRouterLink to="/help">Hilfe</CustomRouterLink>
              </Box>
              <Grid item>
                <Copyright />
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" gutterBottom>
              Legal
            </Typography>
            <Box component="ul" sx={{ m: 0, listStyle: 'none', p: 0 }}>
              <Box component="li" sx={{ py: 0.5 }}>
                <CustomRouterLink to="/terms">AGB</CustomRouterLink>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <CustomRouterLink to="/privacy">Datenschutz</CustomRouterLink>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <CustomRouterLink to="/impressum">Impressum</CustomRouterLink>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <CustomRouterLink to="/licenses">Open-Source Lizenzen</CustomRouterLink>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" gutterBottom>
              Language
            </Typography>
            <TextField
              select
              size="medium"
              variant="standard"
              SelectProps={{
                native: true,
              }}
              sx={{ mt: 1, width: 150 }}
            >
              {LANGUAGES.map((language) => (
                <option value={language.code} key={language.code}>
                  {language.name}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}
