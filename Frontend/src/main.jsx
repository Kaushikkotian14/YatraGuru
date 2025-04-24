// main.jsx (index.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CreateTrip from './create-trip/index.jsx';
import Header from './components/custom/Header.jsx';
import { Toaster } from './components/ui/sonner.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ViewTrip from './view-trip/[tripId]/index.jsx';
import MyTrips from './my-trips/index.jsx';
import YatraSahayak from './yatra-sahayak/index.jsx';
import YatraNetra from './yatra-netra/index.jsx';
import Footer from './components/custom/Footer.jsx';
import YatraVaani from './yatra-vaani/index.jsx';
import BookingPage from './booking/index.jsx';
import TrainsPage from './components/trains/TrainsPage.jsx';
import HotelsPage from './components/hotels/HotelsPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/yatra-sahayak',
    element: <YatraSahayak />,
  },
  {
    path: '/booking',
    element: <BookingPage />,
  },
  {
    path: '/create-trip',
    element: <CreateTrip />,
  },
  {
    path: '/view-trip/:tripId',
    element: <ViewTrip />,
  },
  {
    path: '/my-trips',
    element: <MyTrips />,
  },
  {
    path: '/yatra-netra',
    element: <YatraNetra />,
  },
  {
    path: '/yatra-vaani',
    element: <YatraVaani />,
  },
  {
    path: '/trains',
    element: <TrainsPage />,
  },
  {
    path: '/hotels',
    element: <HotelsPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header />
      <Toaster />
      <RouterProvider router={router} />
      <Footer />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
