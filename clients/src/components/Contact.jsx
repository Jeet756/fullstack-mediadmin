import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isUltraSmall = width <= 245;

  const dynamicPadding =
    width <= 200
      ? "15px"
      : width <= 350
      ? "25px"
      : "40px";

  return (
    <div style={styles.wrapper}>

      {/* HERO */}
      <section
        style={{
          ...styles.hero,
          padding: isUltraSmall ? "70px 10px" : "100px 20px",
        }}
      >
        <h1
          style={{
            ...styles.heroTitle,
            fontSize: isUltraSmall ? "20px" : "2.8rem",
          }}
        >
          Contact Us
        </h1>

        <p
          style={{
            ...styles.heroSubtitle,
            fontSize: isUltraSmall ? "12px" : "1.1rem",
          }}
        >
          We're here to assist you 24/7. Reach out anytime.
        </p>
      </section>

      <section style={styles.section}>
        <div
          style={{
            ...styles.grid,
            gridTemplateColumns:
              width > 768 ? "repeat(2,1fr)" : "1fr",
          }}
        >

          <div
            style={{
              ...styles.card,
              padding: dynamicPadding,
            }}
          >
            <h3 style={styles.cardTitle}>📞 Phone Numbers</h3>
            <ul style={styles.list}>
              <li><strong>Emergency:</strong> 9981266877</li>
              <li><strong>Reception:</strong> 8720864028</li>
              <li><strong>Appointments:</strong> 8720864028</li>
              <li><strong>Emergency 2:</strong> 9753545106</li>
            </ul>
          </div>

          <div
            style={{
              ...styles.card,
              padding: dynamicPadding,
            }}
          >
            <h3 style={styles.cardTitle}>📧 Email Addresses</h3>
            <ul style={styles.list}>
              <li><strong>Emergency:</strong> emergency@hospital.com</li>
              <li><strong>Reception:</strong> reception@hospital.com</li>
              <li><strong>Appointments:</strong> appointments@hospital.com</li>
              <li><strong>General Inquiry:</strong> info@hospital.com</li>
            </ul>
          </div>

        </div>

        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Link to="/" style={styles.backBtn}>
            Go Back Home
          </Link>
        </div>
      </section>
    </div>
  );
};

const styles = {

  wrapper: {
    fontFamily: "Poppins, sans-serif",
    background: "#f4f8ff",
    overflowX: "hidden",
  },

  hero: {
    textAlign: "center",
    background: "linear-gradient(135deg, #0d6efd, #4dabf7)",
    color: "#fff",
    wordBreak: "break-word",
  },

  heroTitle: {
    fontWeight: "700",
    lineHeight: "1.2",
    wordBreak: "break-word",
  },

  heroSubtitle: {
    marginTop: "15px",
    opacity: 0.9,
    wordBreak: "break-word",
  },

  section: {
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "auto",
  },

  grid: {
    display: "grid",
    gap: "40px",
  },

  card: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
    transition: "0.3s ease",
    overflow: "hidden",
    wordBreak: "break-word",
  },

  cardTitle: {
    marginBottom: "20px",
    fontSize: "1.3rem",
  },

  list: {
    listStyle: "none",
    padding: 0,
    lineHeight: "2",
    color: "#444",
    wordBreak: "break-word",
  },

  backBtn: {
    display: "inline-block",
    padding: "12px 30px",
    borderRadius: "30px",
    border: "2px solid #0d6efd",
    color: "#0d6efd",
    textDecoration: "none",
    fontWeight: "600",
    transition: "0.3s",
  },

};

export default Contact;