import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getColumns = () => {
    if (width > 992) return "repeat(4, 1fr)";
    if (width > 600) return "repeat(2, 1fr)";
    return "1fr";
  };

  return (
    <footer style={styles.footer}>
      <div
        style={{
          ...styles.container,
          gridTemplateColumns: getColumns(),
          padding: width < 250 ? "0 10px" : "0 20px",
        }}
      >
        <div style={styles.column}>
          <h3
            style={{
              ...styles.logo,
              fontSize: width < 250 ? "16px" : "22px",
            }}
          >
            Shri Gurupad Hospital
          </h3>

          <p style={styles.text}>
            <FaMapMarkerAlt style={styles.icon} />
            Aashagram Road, Barwani
          </p>

          <p style={styles.text}>
            <FaPhoneAlt style={styles.icon} />
            +91 9XXXXXXXXX
          </p>

          <p style={styles.text}>
            <FaEnvelope style={styles.icon} />
            info@shrigurupad.com
          </p>

          <a
            href="https://maps.app.goo.gl/dd2RSVH87v4Mr4jQ6"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.mapLink}
          >
            View on Google Maps →
          </a>
        </div>

        <div style={styles.column}>
          <h4 style={styles.heading}>Quick Links</h4>
          <ul style={styles.list}>
            <li><Link to="/" style={styles.link}>Home</Link></li>
            <li><Link to="/features" style={styles.link}>Features</Link></li>
            <li><Link to="/pricing" style={styles.link}>Pricing</Link></li>
            <li><Link to="/faq" style={styles.link}>FAQs</Link></li>
            <li><Link to="/about" style={styles.link}>About</Link></li>
          </ul>
        </div>

        <div style={styles.column}>
          <h4 style={styles.heading}>Our Services</h4>
          <ul style={styles.list}>
            <li style={styles.text}>General Medicine</li>
            <li style={styles.text}>ICU & Emergency</li>
            <li style={styles.text}>Pathology Lab</li>
            <li style={styles.text}>24/7 Ambulance</li>
          </ul>
        </div>

        <div style={styles.column}>
          <h4 style={styles.heading}>Connect With Us</h4>
          <div style={styles.socialContainer}>
            <a href="#" style={styles.social}><FaFacebookF /></a>
            <a href="#" style={styles.social}><FaInstagram /></a>
            <a href="#" style={styles.social}><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div style={styles.bottomBar}>
        © {new Date().getFullYear()} Shri Gurupad Hospital. All Rights Reserved.
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#fff",
    paddingTop: "60px",
  },
  container: {
    maxWidth: "1200px",
    margin: "auto",
    display: "grid",
    gap: "40px",
  },
  column: {
    minWidth: 0,
  },
  logo: {
    marginBottom: "15px",
    wordBreak: "break-word",
    lineHeight: "1.3",
  },
  heading: {
    fontSize: "18px",
    marginBottom: "15px",
    borderBottom: "2px solid #4dd0e1",
    display: "inline-block",
    paddingBottom: "5px",
  },
  text: {
    fontSize: "14px",
    marginBottom: "10px",
    opacity: 0.9,
    wordBreak: "break-word",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  link: {
    color: "#ddd",
    textDecoration: "none",
    display: "block",
    marginBottom: "8px",
  },
  socialContainer: {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  social: {
    background: "#ffffff20",
    padding: "10px",
    borderRadius: "50%",
    color: "#fff",
    fontSize: "14px",
  },
  bottomBar: {
    textAlign: "center",
    padding: "20px",
    marginTop: "50px",
    borderTop: "1px solid #ffffff30",
    fontSize: "14px",
    opacity: 0.8,
  },
  icon: {
    marginRight: "8px",
  },
  mapLink: {
    color: "#4dd0e1",
    textDecoration: "none",
    fontSize: "14px",
    display: "inline-block",
    marginTop: "5px",
  },
};

export default Footer;