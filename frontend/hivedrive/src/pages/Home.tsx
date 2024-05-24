import React from 'react';
import Header from '../components/Header';
import SearchBar from '../components/Searchbar';
import Content from '../components/Content';
import Footer from '../components/Footer';
import './Home.css';


const Home: React.FC = () => {
    return (
      <div className="app">
        <Header />
        <SearchBar />
        <Content />
        <Footer />
      </div>
    );
  };
  
  export default Home;