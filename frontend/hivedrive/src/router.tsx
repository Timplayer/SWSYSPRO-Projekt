import React from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Terms from './pages/Terms.tsx';
import Home from './pages/Home.tsx';

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