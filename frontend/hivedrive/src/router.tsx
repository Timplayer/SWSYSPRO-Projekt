import React, { useState, useEffect, useRef } from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import NotFound from './pages/NotFound';
import keycloak from './keycloak';
import Logout from './pages/Logout';
import Login from './pages/Login';
import Home from './pages/Home';
import Account from './pages/Account';
import ProtectedRoute from './ProtectedRoute';
import { ErrorMessageProvider } from './Utils/ErrorMessageContext';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Impressum from './pages/Impressum';
import Help from './pages/Help';
import Bookingpage from './pages/Bookingpage';
import Bookings from './pages/Bookings';
import AboBookingPage from './pages/AboBookingpage';
import Abopage from './pages/Abopage';
import Carclasses from './pages/Carclasses';
import { LocationProvider } from './Utils/LocationContext';
import Bonusprogramm from './pages/Bonusprogramm';
import OpenSourcethings from './pages/OpenSourcethings';
import Reservation from './pages/CarBookingPage';


const routes: RouteObject[] = [
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/logout',
		element: <Logout />,
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/account',
		element: <ProtectedRoute element={<Account />} requiredRoles={['admin']} />,
	},
	{
		path: '/privacy',
		element: <Privacy />,
	},
	{
		path: '/terms',
		element: <Terms />,
	},
	{
		path: '/impressum',
		element: <Impressum />,
	},
	{
		path: '/help',
		element: <Help />,
	},
	{
		path: '*',
		element: <NotFound />,
	},
	{
		path: '/bookingpage',
		element: (<LocationProvider> <Bookingpage /> </LocationProvider>),
	},
	{
		path: '/mybookings',
		element: <ProtectedRoute element={<Bookings />} requiredRoles={['member,employee,admin']} />,
	},
	{
		path: '/subscription',
		element: <Abopage />,
	},
	{
		path: '/subscriptionbooking',
		element: <ProtectedRoute element={<AboBookingPage />} requiredRoles={['member,employee,admin']} />,
	},
	{
		path: '/carclass',
		element: <Carclasses />,
	},
	{
		path: '/bonus',
		element: <Bonusprogramm />,
	},
	{
		path: '/licenses',
		element: <OpenSourcethings />,
	},
	{
		path: '/reservation',
		element: <Reservation />,
	},
];

const router = createBrowserRouter(routes);

const AppRouter: React.FC = () => {

	const [init, setInit] = useState(false);
	const init_done = useRef(false);

	useEffect(() => {
		if (init || init_done.current) return;
		init_done.current = true;

		keycloak.init({ onLoad: 'check-sso' }).then(() => { 
			setInit(true); 
		});
	}, []);

	if (!init) {
		return <>Initializing Keycloak...</>;
	}

	return <ErrorMessageProvider> <RouterProvider router={router} /> </ErrorMessageProvider>;
};

export default AppRouter;