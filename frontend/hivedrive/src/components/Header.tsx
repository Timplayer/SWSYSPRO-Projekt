import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="menu">Menü Ausklapp Dings</div>
      <div className="logo">LOGO + Firmenname</div>
      <div className="bookings">Buchungen Verwalten (nur sichtbar falls eingeloggt)</div>
      <div className="auth">Anmelden/Registrieren</div>
    </header>
  );
};

export default Header;
