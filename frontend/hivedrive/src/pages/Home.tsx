import * as React from 'react';
import { useState } from 'react'; 
import ProductSmokingHero from '../views/ProductSmokingHero';
import AppFooter from '../views/AppFooter';
import ProductHero from '../views/ProductHero';
import ProductHowItWorks from '../views/ProductHowItWorks';
import ProductCTA from '../views/ProductCTA';
import AppAppBar from '../views/AppAppBar';
import withRoot from '../withRoot';
import CarSearchBar from '../components/CarSearchBar';
import CarPresentation from '../views/CarPresentation';

document.body.style.display = 'contents';

function Index() {
  const [location, setLocation] = useState<string>('Hamburg Flughafen'); // Define standard

  return (
    <React.Fragment>
      <AppAppBar />
      <CarSearchBar setLocation={setLocation} /> 
      <ProductHero />
      <CarPresentation location={location} /> 
      <ProductHowItWorks />
      <ProductCTA />
      <ProductSmokingHero />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Index);
