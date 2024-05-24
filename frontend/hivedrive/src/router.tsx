import React from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import NotFound from './pages/NotFound';
import App from './App'

const routes: RouteObject[] = [
    {
      path: '/',
      element: <App />,
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