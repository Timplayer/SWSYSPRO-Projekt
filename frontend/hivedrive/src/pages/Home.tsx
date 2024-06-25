import * as React from 'react';
import { useLocation } from 'react-router-dom';
import ProductSmokingHero from '../views/ProductSmokingHero';
import AppFooter from '../views/AppFooter';
import ProductHero from '../views/ProductHero';
import ProductHowItWorks from '../views/ProductHowItWorks';
import ProductCTA from '../views/ProductCTA';
import AppAppBar from '../views/AppAppBar';
import withRoot from '../withRoot';
import CarSearchBar from '../components/CarSearchBar';
import CarPresentation from '../views/CarPresentation';
import { LocationProvider } from '../Utils/LocationContext';

document.body.style.display = 'contents';

function Index() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <LocationProvider>
      <React.Fragment>
        <AppAppBar />
        <CarSearchBar />
        <ProductHero />
        {isHomePage && <CarPresentation />}
        <ProductHowItWorks />
        <ProductCTA />
        <ProductSmokingHero />
        <AppFooter />
      </React.Fragment>
    </LocationProvider>
  );
}

export default withRoot(Index);
