// src/HelpPage.tsx
import React from 'react';
import {Typography, List, ListItem, ListItemText, Container, Box} from '@mui/material';
import AppAppBar from '../views/AppAppBar';
import withRoot from '../withRoot';
import AppFooter from '../views/AppFooter';


const HelpPage: React.FC = () => {
  return (
    <React.Fragment>
    <AppAppBar />
      <Container sx={{ color: '#ffffff' }}>
      <Box sx={{ mt: 7, mb: 12, color: '#ffffff' }}>
        <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }} sx={{ color: '#ff9800' }}>
          Häufig gestellte Fragen
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Wie kann ich ein Auto mieten?"
              secondary="Um ein Auto zu mieten, besuchen Sie unsere Buchungsseite, wählen Sie das gewünschte Auto und die Mietdauer aus, und folgen Sie den Anweisungen zur Zahlung."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Welche Dokumente benötige ich?"
              secondary="Sie benötigen einen gültigen Führerschein und eine Kreditkarte auf Ihren Namen. Weitere Details finden Sie in unseren Mietbedingungen."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Wie kann ich eine Buchung stornieren?"
              secondary="Sie können Ihre Buchung über Ihr Kundenkonto auf unserer Website stornieren. Es können Stornierungsgebühren anfallen."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Was ist im Mietpreis enthalten?"
              secondary="Im Mietpreis sind die Fahrzeugmiete, Standardversicherung und Steuern enthalten. Zusätzliche Kosten können für Extras wie GPS oder Kindersitze anfallen."
            />
          </ListItem>
        </List>
        </Box>
      </Container>
      <AppFooter/>
     </React.Fragment>
  );
};

export default withRoot(HelpPage);