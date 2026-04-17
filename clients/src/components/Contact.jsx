import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const Contact = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isUltraSmall = width <= 245;
  const dynamicPadding =
    width <= 200
      ? "12px"
      : width <= 350
      ? "20px"
      : "40px";
  return (
    <main style={styles.wrapper}>
      <Helmet>
        <title>Contact | Shri Gurupad Hospital</title>
      </Helmet>
      <section
        style={{
          ...styles.hero,
          padding: isUltraSmall ? "60px 10px" : "100px 20px",
        }}
      >
        <h1
          style={{
            ...styles.heroTitle,
            fontSize: width <= 300 ? "18px" : "2.8rem",
          }}
        >
          Contact Us
        </h1>
        <p
          style={{
            ...styles.heroSubtitle,
            fontSize: width <= 300 ? "11px" : "1.1rem",
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
              width > 768
                ? "repeat(2,1fr)"
                : width > 400
                ? "1fr"
                : "1fr",
            gap: width <= 300 ? "20px" : "40px",
          }}
        >
          <div
            style={{
              ...styles.card,
              padding: dynamicPadding,
            }}
            onMouseEnter={(e) => {
              if (width > 500) {
                e.currentTarget.style.transform =
                  "translateY(-10px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 25px 60px rgba(37,99,235,0.25)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow =
                "0 15px 40px rgba(0,0,0,0.08)";
            }}
          >
            <h3 style={styles.cardTitle}>📞 Phone Numbers</h3>
            <ul style={styles.list}>
              <li>Emergency: 9981266877</li>
              <li>Reception: 8720864028</li>
              <li>Appointments: 8720864028</li>
              <li>Emergency 2: 9753545106</li>
            </ul>
          </div>
          <div
            style={{
              ...styles.card,
              padding: dynamicPadding,
            }}
            onMouseEnter={(e) => {
              if (width > 500) {
                e.currentTarget.style.transform =
                  "translateY(-10px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 25px 60px rgba(37,99,235,0.25)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow =
                "0 15px 40px rgba(0,0,0,0.08)";
            }}
          >
            <h3 style={styles.cardTitle}>📧 Email Addresses</h3>
            <ul style={styles.list}>
              <li style={styles.wrap}>Emergency: emergency@hospital.com</li>
              <li style={styles.wrap}>Reception: reception@hospital.com</li>
              <li style={styles.wrap}>Appointments: appointments@hospital.com</li>
              <li style={styles.wrap}>General: info@hospital.com</li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Link
            to="/"
            style={{
              ...styles.backBtn,
              fontSize: width <= 300 ? "12px" : "14px",
              padding: width <= 300 ? "10px 20px" : "14px 34px",
            }}
          >
            Back to Home Page
          </Link>
        </div>
      </section>
    </main>
  );
};
const styles = {
  wrapper: {
    fontFamily: "Poppins, sans-serif",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    overflowX: "hidden",
  },
  hero: {
    textAlign: "center",
    background:
      "linear-gradient(135deg, #1e3a8a, #2563eb, #3b82f6)",
    color: "#fff",
  },
  heroTitle: {
    fontWeight: "800",
    lineHeight: "1.2",
  },
  heroSubtitle: {
    marginTop: "15px",
    opacity: 0.9,
  },
  section: {
    padding: "60px 15px",
    maxWidth: "1100px",
    margin: "auto",
  },
  grid: {
    display: "grid",
  },
  card: {
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(16px)",
    borderRadius: "18px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.4)",
  },
  cardTitle: {
    marginBottom: "15px",
    fontSize: "1.2rem",
    fontWeight: "700",
  },
  list: {
    listStyle: "none",
    padding: 0,
    lineHeight: "1.8",
    fontSize: "0.9rem",
    color: "#475569",
  },
  wrap: {
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  },
  backBtn: {
    display: "inline-block",
    borderRadius: "30px",
    border: "2px solid #2563eb",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
  },
};
export default Contact;