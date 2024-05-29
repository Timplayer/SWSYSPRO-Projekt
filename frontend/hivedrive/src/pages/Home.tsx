import React from 'react';
import MenuAppBar from '../components/MenuAppBar';
import Content from '../components/Content';
import Footer from '../components/Footer';
import './Home.css';


const Home: React.FC = () => {
    return (
      <div className="app">
        <MenuAppBar />
        <Content />
        <Footer />
      </div>
    );
  };
  
  export default Home;