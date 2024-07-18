import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Star, CheckCircle } from '@mui/icons-material';
import withRoot from '../withRoot';
import AppAppBar from '../views/AppAppBar';
import AppFooter from '../views/AppFooter';

const Bonusprogramm: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <Container>
        <Paper style={{ padding: '32px', marginTop: '32px', marginBottom: '32px' }}>
          <Typography variant="h4" style={{ marginBottom: '16px' }}>
            Unser Bonusprogramm
          </Typography>
          <Typography variant="body1">
            Treten Sie unserem exklusiven Bonusprogramm bei und profitieren Sie von zahlreichen Vorteilen und Belohnungen. 
            Sammeln Sie Punkte bei jeder Anmietung und lösen Sie diese für tolle Prämien ein.
          </Typography>

          <section style={{ marginTop: '32px', marginBottom: '32px' }}>
            <Typography variant="h5">Vorteile</Typography>
            <List style={{ backgroundColor: '#f0f0f0' }}>
              <ListItem>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary="Exklusive Rabatte auf zukünftige Anmietungen" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary="Kostenlose Upgrades zu höheren Fahrzeugklassen" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary="Spezielle Angebote und Promotionen" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary="Priorisierte Kundenbetreuung" />
              </ListItem>
            </List>
          </section>

          <section style={{ marginTop: '32px', marginBottom: '32px' }}>
            <Typography variant="h5">So funktioniert es</Typography>
            <List style={{ backgroundColor: '#f0f0f0' }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle />
                </ListItemIcon>
                <ListItemText primary="Melden Sie sich kostenlos an" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <CheckCircle />
                </ListItemIcon>
                <ListItemText primary="Sammeln Sie Punkte bei jeder Anmietung" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <CheckCircle />
                </ListItemIcon>
                <ListItemText primary="Lösen Sie Ihre Punkte für Prämien ein" />
              </ListItem>
            </List>
          </section>

          <Button variant="contained" style={{ marginTop: '16px' }} onClick={handleDialogOpen}>
            Jetzt anmelden
          </Button>

          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Coming Soon</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Diese Funktion ist noch nicht verfügbar, wird aber bald hinzugefügt.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Schließen
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
      <AppFooter />
    </React.Fragment>
  );
};

export default withRoot(Bonusprogramm);
