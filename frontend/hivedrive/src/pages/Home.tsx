import * as React from 'react';
import { useState } from 'react'; // Import useState hook
import ProductCategories from '../views/ProductCategories';
import ProductSmokingHero from '../views/ProductSmokingHero';
import AppFooter from '../views/AppFooter';
import ProductHero from '../views/ProductHero';
import ProductValues from '../views/ProductValues';
import ProductHowItWorks from '../views/ProductHowItWorks';
import ProductCTA from '../views/ProductCTA';
import AppAppBar from '../views/AppAppBar';
import withRoot from '../withRoot';
import CarSearchBar from '../components/carsearchbar';
import CarPresentation from '../views/CarPresentation';
import PromoAdvertisement from '../views/PromoAdvertisement';

document.body.style.display = 'contents';

function Index() {
  const [location, setLocation] = useState<string>('Hamburg Flughafen'); // Define location state

  return (
    <React.Fragment>
      <AppAppBar />
      <CarSearchBar setLocation={setLocation} /> {/* Pass setLocation to CarSearchBar */}
      <CarPresentation location={location} /> {/* Pass location to CarPresentation */}
      {/* <PromoAdvertisement/> */}
      <ProductCTA />
      {/* <ProductHero />
      <ProductValues />
      <ProductCategories /> */}
      <ProductHowItWorks />
      <ProductSmokingHero />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Index);
