import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import TextField from '../components/TextField';

function Copyright() {
  return (
    <React.Fragment>
      {'© '}
      <Link color="inherit" href="/"> 
       HiveDrive
      </Link>{' '}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

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
      <Container sx={{ my: 8, display: 'flex', justifyContent: 'center' }}>        
        <Grid container spacing={5} justifyContent="center">
          <Grid item xs={6} sm={4} md={2}> 
          <Typography variant="h6" marked="left" gutterBottom>
              Hilfreiches
            </Typography> 
            <Box component="ul" sx={{ m: 0, listStyle: 'none', p: 0 }}>
              <Box component="li" sx={{ py: 0.5 }}>   
                  <Link href="/Help">Hilfe</Link>  
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
                <Link href="/AGB">AGB</Link>
              </Box> 
              <Box component="li" sx={{ py: 0.5 }}>   
                <Link href="/Datenschutz">Datenschutz</Link>  
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link href="/Impressum">Impressum</Link>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={8} md={4}>
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
