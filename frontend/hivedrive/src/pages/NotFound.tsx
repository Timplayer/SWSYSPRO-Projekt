import React from 'react';
import { useNavigate } from 'react-router-dom';
import withRoot from '../withRoot';

function NotFound() {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <>
      <h2>404 Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <button onClick={handleNavigateHome}>Go to Homepage</button>
    </>
  );
}

export default withRoot(NotFound);
