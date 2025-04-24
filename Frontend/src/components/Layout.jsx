// Layout.jsx
import React from 'react';
import Header from './custom/Header';
import Footer from './custom/Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
