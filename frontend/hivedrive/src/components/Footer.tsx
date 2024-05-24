import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="help">Hilfe</div>
      <div className="imprint">Impressum</div>
      <div className="terms">AGB</div>
    </footer>
  );
};

export default Footer;
