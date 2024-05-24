import React from 'react';
import './Content.css';

const Content: React.FC = () => {
  return (
    <main className="content">
      <section className="offers">Angebote</section>
      <section className="news">Neuigkeiten</section>
      <section className="ads">Werbung</section>
      <section className="example-cars">Beispiel Autos</section>
    </main>
  );
};

export default Content;
