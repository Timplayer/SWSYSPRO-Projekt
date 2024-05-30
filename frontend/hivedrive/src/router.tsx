import React from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import NotFound from './pages/NotFound';

import Home from './piratetest2/onepirate/Home.tsx'

const routes: RouteObject[] = [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
];
  
  const router = createBrowserRouter(routes);
  
  const AppRouter: React.FC = () => {
    return <RouterProvider router={router} />;
  };
  
  export default AppRouter;