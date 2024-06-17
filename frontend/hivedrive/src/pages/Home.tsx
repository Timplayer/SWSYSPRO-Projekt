import * as React from 'react';
import { useState } from 'react'; 
import ProductCategories from '../views/ProductCategories';
import ProductSmokingHero from '../views/ProductSmokingHero';
import AppFooter from '../views/AppFooter';
import ProductHero from '../views/ProductHero';
import ProductValues from '../views/ProductValues';
import ProductHowItWorks from '../views/ProductHowItWorks';
import ProductCTA from '../views/ProductCTA';
import AppAppBar from '../views/AppAppBar';
import withRoot from '../withRoot';
import CarSearchBar from '../components/CarSearchBar';
import CarPresentation from '../views/CarPresentation';
import PromoAdvertisement from '../views/PromoAdvertisement';

document.body.style.display = 'contents';

function Index() {
  const [location, setLocation] = useState<string>('Hamburg Flughafen'); // Define standard

  return (
    <React.Fragment>
      <AppAppBar />
      <CarSearchBar setLocation={setLocation} /> {/* Pass setLocation to CarSearchBar */}
      <ProductHero />
      <CarPresentation location={location} /> {/* Pass location to CarPresentation */}
      {/* <PromoAdvertisement/> */}
      <ProductHowItWorks />
      <ProductCTA />
      {/* <ProductValues />
      <ProductCategories /> */}
      <ProductSmokingHero />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Index);
