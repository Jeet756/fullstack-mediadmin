import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const About = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmall = width <= 400;
  const isUltraSmall = width <= 245;
  const dynamicCardPadding =
    width <= 200
      ? "15px"
      : width <= 300
      ? "25px"
      : "40px";

  return (
    <div style={styles.wrapper}>
            <section
        style={{
          ...styles.hero,
          padding: isUltraSmall ? "60px 10px" : "100px 20px",
        }}
      >
        <div style={styles.heroContent}>
          <h1
            style={{
              ...styles.title,
              fontSize: isUltraSmall
                ? "18px"
                : isSmall
                ? "28px"
                : "48px",
            }}
          >
            About Shri Gurupad Hospital
          </h1>

          <p
            style={{
              ...styles.subtitle,
              fontSize: isUltraSmall ? "12px" : "18px",
            }}
          >
            Delivering excellence in healthcare with compassion, integrity, and innovation.
          </p>
        </div>
      </section>
      <section style={styles.section}>
        <div style={styles.container}>
          <h2
            style={{
              ...styles.sectionHeading,
              fontSize: isUltraSmall ? "16px" : "32px",
            }}
          >
            Who We Are
          </h2>

          <p style={styles.text}>
            Shri Gurupad Hospital is a modern, multispecialty healthcare institution
            dedicated to providing world-class medical services.
          </p>

          <p style={styles.text}>
            With advanced infrastructure and ethical practices, we create a healing
            environment built on trust and excellence.
          </p>
        </div>
      </section>
      <section style={styles.mvvSection}>
        <div
          style={{
            ...styles.mvvGrid,
            gridTemplateColumns:
              width > 992
                ? "repeat(3, 1fr)"
                : width > 600
                ? "repeat(2, 1fr)"
                : "1fr",
            gap: isUltraSmall ? "20px" : "40px",
          }}
        >
          <div
            style={{
              ...styles.card,
              padding: dynamicCardPadding,
            }}
          >
            <h3 style={styles.cardTitle}>🎯 Our Mission</h3>
            <p>
              To provide high-quality, affordable healthcare services that improve lives.
            </p>
          </div>
          <div
            style={{
              ...styles.card,
              padding: dynamicCardPadding,
            }}
          >
            <h3 style={styles.cardTitle}>🌟 Our Vision</h3>
            <p>
              To become the most trusted healthcare provider recognized for excellence.
            </p>
          </div>
          <div
            style={{
              ...styles.card,
              padding: dynamicCardPadding,
            }}
          >
            <h3 style={styles.cardTitle}>💡 Our Core Values</h3>
            <ul style={styles.list}>
              <li>Compassion & Respect</li>
              <li>Patient-Centered Care</li>
              <li>Integrity & Transparency</li>
              <li>Continuous Improvement</li>
            </ul>
          </div>
        </div>
      </section>
      <section
        style={{
          ...styles.cta,
          padding: isUltraSmall ? "50px 10px" : "80px 20px",
        }}
      >
        <h2 style={{ fontSize: isUltraSmall ? "16px" : "30px" }}>
          We Are Available 24/7
        </h2>

        <p style={{ opacity: 0.9 }}>
          Your health is our highest priority.
        </p>

        <Link to="/contact" style={styles.ctaBtn}>
          Contact Us
        </Link>
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
    background:
      "linear-gradient(135deg, #0d6efd, #00c6ff)",
    color: "#fff",
  },

  heroContent: {
    maxWidth: "900px",
    margin: "auto",
    wordBreak: "break-word",
  },

  title: {
    fontWeight: "700",
    lineHeight: "1.2",
    wordBreak: "break-word",
  },

  subtitle: {
    marginTop: "20px",
    opacity: 0.95,
    wordBreak: "break-word",
  },

  section: {
    padding: "80px 20px",
  },

  container: {
    maxWidth: "900px",
    margin: "auto",
    textAlign: "center",
  },

  sectionHeading: {
    marginBottom: "30px",
    fontWeight: "700",
    wordBreak: "break-word",
  },

  text: {
    lineHeight: "1.8",
    marginBottom: "20px",
    color: "#444",
    wordBreak: "break-word",
  },

  mvvSection: {
    padding: "80px 20px",
    background:
      "linear-gradient(180deg, #ffffff, #f0f6ff)",
  },

  mvvGrid: {
    maxWidth: "1100px",
    margin: "auto",
    display: "grid",
  },

  card: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
    transition: "0.3s ease",
    overflow: "hidden",
    wordBreak: "break-word",
  },

  cardTitle: {
    marginBottom: "15px",
    fontSize: "20px",
  },

  list: {
    paddingLeft: "20px",
    lineHeight: "1.8",
  },

  cta: {
    textAlign: "center",
    background:
      "linear-gradient(135deg, #0d6efd, #6610f2)",
    color: "#fff",
  },

  ctaBtn: {
    display: "inline-block",
    marginTop: "25px",
    padding: "14px 35px",
    background: "#fff",
    color: "#0d6efd",
    borderRadius: "50px",
    textDecoration: "none",
    fontWeight: "600",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
};

export default About;