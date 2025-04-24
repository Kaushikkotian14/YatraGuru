import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={footerContainer}>
        <div style={footerSection}>
          <h3 style={footerTitle}>About Us</h3>
          <p style={footerText}>
            Explore the world with our travel planner and booking services. We
            offer the best deals and seamless experiences to make your journey
            memorable.
          </p>
        </div>
        <div style={footerSection}>
          <h3 style={footerTitle}>Quick Links</h3>
          <ul style={footerLinks}>
            <li><a href="/" style={linkStyle}>Home</a></li>
            <li><a href="#services" style={linkStyle}>Services</a></li>
            <li><a href="#contact" style={linkStyle}>Contact Us</a></li>
            <li><a href="#faq" style={linkStyle}>FAQ</a></li>
          </ul>
        </div>
        <div style={footerSection}>
          <h3 style={footerTitle}>Contact Us</h3>
          <p style={footerText}>Email: support@yatraguru.com</p>
          <p style={footerText}>Phone: +123 456 7890</p>
          <div style={socialIcons}>
            <a href="https://facebook.com" style={iconStyle}><FaFacebook /></a>
            <a href="https://twitter.com" style={iconStyle}><FaTwitter /></a>
            <a href="https://instagram.com" style={iconStyle}><FaInstagram /></a>
            <a href="https://linkedin.com" style={iconStyle}><FaLinkedin /></a>
          </div>
        </div>
      </div>
      <div style={footerBottom}>
        <p style={footerText}>&copy; 2024 YatraGuru. All rights reserved.</p>
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: "#333",
  color: "#fff",
  padding: "20px 0",
};

const footerContainer = {
  display: "flex",
  justifyContent: "space-around",
  flexWrap: "wrap",
  maxWidth: "1200px",
  margin: "0 auto",
};

const footerSection = {
  flex: "1",
  margin: "10px",
};

const footerTitle = {
  fontSize: "18px",
  marginBottom: "15px",
  textTransform: "uppercase",
  letterSpacing: "1.2px",
};

const footerText = {
  fontSize: "14px",
  lineHeight: "1.6",
};

const footerLinks = {
  listStyleType: "none",
  padding: 0,
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  display: "block",
  marginBottom: "10px",
};

const socialIcons = {
  display: "flex",
  gap: "10px",
  marginTop: "15px",
};

const iconStyle = {
  color: "#fff",
  fontSize: "18px",
  transition: "color 0.3s",
};

const footerBottom = {
  textAlign: "center",
  marginTop: "20px",
};

export default Footer;
