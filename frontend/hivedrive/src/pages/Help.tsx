import React from 'react';
import { Typography, Container, Box, Grid, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AppAppBar from '../views/AppAppBar';
import withRoot from '../withRoot';
import AppFooter from '../views/AppFooter';

const categories = [
  {
    title: "Vor der Miete",
    items: [
      { question: "Bezahlung", answer: "Die Bezahlung erfolgt per Kreditkarte, Debitkarte oder über PayPal. Wir akzeptieren Visa, MasterCard, American Express und Discover. Barzahlungen sind nicht möglich." },
      { question: "Extras", answer: "Sie können zusätzliche Extras wie GPS, Kindersitze, Zusatzfahrer und Versicherungsschutzoptionen während der Buchung hinzufügen. Diese werden zum Mietpreis hinzugerechnet." },
      { question: "Fragen vor der Reservierung", answer: "Für Fragen vor der Reservierung können Sie unsere FAQ-Seite besuchen oder unser Kundenservice-Team per E-Mail oder Telefon kontaktieren." },
      { question: "Reservierung und Änderung", answer: "Reservierungen können online über unsere Website vorgenommen werden. Änderungen und Stornierungen sind ebenfalls online möglich. Bitte beachten Sie, dass Stornierungsgebühren anfallen können." },
      { question: "Schutzoptionen", answer: "Wir bieten verschiedene Schutzoptionen wie Haftpflichtversicherung, Vollkaskoschutz ohne Selbstbeteiligung und Diebstahlschutz an. Diese können während der Buchung ausgewählt werden." },
    ],
  },
  {
    title: "Während der Miete",
    items: [
      { question: "Bestimmungen während der Miete", answer: "Während der Mietdauer sind Sie für das Fahrzeug verantwortlich. Es ist wichtig, die Straßenverkehrsregeln zu befolgen und das Fahrzeug in gutem Zustand zu halten. Jegliche Schäden oder Verluste müssen sofort gemeldet werden." },
      { question: "Fahrten über Grenzen", answer: "Fahrten über Landesgrenzen sind in vielen Fällen möglich, jedoch müssen Sie dies bei der Buchung angeben und die entsprechenden Dokumente mitführen. Zusätzliche Gebühren können anfallen." },
      { question: "Technischer Zustand des Mietwagens", answer: "Unsere Fahrzeuge werden regelmäßig gewartet und vor jeder Vermietung gründlich überprüft. Sollte während der Miete ein technisches Problem auftreten, kontaktieren Sie bitte sofort unseren Kundenservice." },
    ],
  },
  {
    title: "Nach der Miete",
    items: [
      { question: "Abrechnung", answer: "Nach der Rückgabe des Fahrzeugs wird die finale Abrechnung erstellt. Diese umfasst den Mietpreis, zusätzliche Kosten für Extras und eventuelle Schäden oder fehlenden Treibstoff. Sie erhalten eine detaillierte Rechnung per E-Mail." },
      { question: "Vergessene Gegenstände", answer: "Falls Sie persönliche Gegenstände im Fahrzeug vergessen haben, kontaktieren Sie bitte umgehend unseren Kundenservice. Wir werden unser Bestes tun, um die Gegenstände zu sichern und Ihnen zurückzugeben." },
    ],
  },
  {
    title: "Mietwagen abholen",
    items: [
      { question: "Bedingungen", answer: "Zur Abholung des Fahrzeugs benötigen Sie einen gültigen Führerschein und die Kreditkarte, die für die Buchung verwendet wurde. Bitte erscheinen Sie pünktlich zum vereinbarten Abholtermin." },
      { question: "Gut zu wissen", answer: "Bitte überprüfen Sie das Fahrzeug bei der Abholung auf eventuelle Schäden und melden Sie diese sofort. Machen Sie sich auch mit den wichtigsten Funktionen des Fahrzeugs vertraut." },
    ],
  },
  {
    title: "Mietwagen zurückgeben",
    items: [
      { question: "Hinweise zur Mietwagenrückgabe", answer: "Bitte bringen Sie das Fahrzeug zum vereinbarten Rückgabeort und -zeitpunkt zurück. Der Tank sollte auf dem gleichen Stand wie bei der Abholung sein. Vergessen Sie nicht, persönliche Gegenstände mitzunehmen." },
      { question: "Änderungen für die Mietwagenrückgabe", answer: "Falls Sie die Rückgabezeit oder den Rückgabeort ändern müssen, kontaktieren Sie bitte unseren Kundenservice im Voraus. Zusätzliche Gebühren können anfallen." },
    ],
  },
  {
    title: "Unfall und Panne",
    items: [
      { question: "Hilfe während der Miete", answer: "Bei einem Unfall oder einer Panne kontaktieren Sie bitte sofort unseren 24/7-Kundenservice. Wir bieten Pannenhilfe und sorgen für Ersatzfahrzeuge, falls notwendig." },
    ],
  },
  {
    title: "Fragen zu Elektroautos",
    items: [
      { question: "Allgemeine Informationen zur Miete von Elektroautos", answer: "Unsere Elektroautos sind umweltfreundlich und kosteneffizient. Sie können an vielen Ladestationen aufgeladen werden. Weitere Informationen finden Sie in der Fahrzeugbeschreibung." },
      { question: "Elektroauto laden", answer: "Elektroautos können an öffentlichen Ladestationen oder zu Hause geladen werden. Sie erhalten eine Ladekarte, die Zugang zu einem Netzwerk von Ladestationen bietet." },
      { question: "Einen Tesla bei HiveDrive mieten / Tesla Supercharger Netzwerk", answer: "Unsere Tesla-Fahrzeuge bieten Zugang zum Tesla Supercharger Netzwerk. Diese Schnellladestationen ermöglichen es Ihnen, in kurzer Zeit eine erhebliche Reichweite nachzuladen." },
    ],
  },
  {
    title: "HiveDrive Loyalty Programm",
    items: [
      { question: "Loyalty Bonus Programm", answer: "Unser Loyalty Bonus Programm bietet Ihnen exklusive Vorteile wie Rabatte, Upgrades und Prioritätsservice. Registrieren Sie sich auf unserer Website, um Mitglied zu werden." },
      { question: "Partner Programm", answer: "Unser Partner Programm bietet spezielle Angebote und Vorteile für Geschäftspartner. Kontaktieren Sie uns für weitere Informationen und wie Sie teilnehmen können." },
    ],
  },
  {
    title: "Unterstützung erhalten",
    items: [
      { question: "Service und Hilfe", answer: "Unser Kundenservice steht Ihnen rund um die Uhr zur Verfügung. Sie können uns per Telefon, E-Mail oder über unser Kontaktformular auf der Website erreichen." },
    ],
  },
  {
    title: "HiveDrive Charge",
    items: [
      { question: "HiveDrive Charge FAQs", answer: "HiveDrive Charge bietet spezielle Tarife und Zugang zu Ladestationen für Elektroautos. Weitere Informationen finden Sie in unseren HiveDrive Charge FAQs." },
    ],
  },
];


const HelpPage: React.FC = () => {
  return (
    <React.Fragment>
      <AppAppBar />
      <Container>
        <Box sx={{ mt: 7, mb: 12 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#ff9800', mt: 2 }}>
            Häufig gestellte Fragen
          </Typography>
          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    {category.title}
                  </Typography>
                  {category.items.map((item, idx) => (
                    <Accordion key={idx}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{item.question}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{item.answer}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ff9800' }}>
              Weitere Fragen?
            </Typography>
            <Typography variant="body1" sx={{color: '#FFFFFF'}}>
              Wenn Sie weitere Fragen haben, können Sie uns gerne per E-Mail unter &nbsp;
              <a href="mailto:support@hivedrive.de" style={{ color: '#ff9800', textDecoration: 'none' }}>
                  support@hivedrive.de
              </a> 
              &nbsp; kontaktieren.
            </Typography>
          </Box>
        </Box>
      </Container>
      <AppFooter />
    </React.Fragment>
  );
};

export default withRoot(HelpPage);
