import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Hero from './components/custom/Hero';
import Header from './components/custom/Header';
import Footer from './components/custom/Footer';
import BookingPage from './booking/index';
import HotelsPage from './components/hotels/HotelsPage';
import TrainsPage from './components/trains/TrainsPage';

function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/trains" element={<TrainsPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
