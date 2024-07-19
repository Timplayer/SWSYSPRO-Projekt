import { useNavigate } from 'react-router-dom';
import withRoot from '../withRoot';

function NotFound() {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <>
      <h2 style={{color: 'white'}}>404 Not Found</h2>
      <p style={{color: 'white'}}>The page you are looking for does not exist.</p>
      <button onClick={handleNavigateHome} style={{color: 'white'}}>Go to Homepage</button>
    </>
  );
}

export default withRoot(NotFound);
