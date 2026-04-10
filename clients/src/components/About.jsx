import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const About = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [contributors, setContributors] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("https://fullstack-mediadmin.onrender.com/api/contributors")
    .then(res => res.json())
    .then(data => setContributors(data))
    .catch(() => setContributors([]))
    .finally(() => setLoading(false));
}, []);
  const isUltraSmall = width <= 245;

  const dynamicCardPadding =
    width <= 200
      ? "12px"
      : width <= 300
      ? "20px"
      : "35px";

  return (
    <main style={styles.wrapper}>
      <Helmet>
        <title>About | Shri Gurupad Hospital</title>
      </Helmet>

      {/* HERO */}
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
              fontSize:
                width <= 300 ? "18px" : width <= 600 ? "28px" : "48px",
            }}
          >
            About Shri Gurupad Hospital
          </h1>

          <p
            style={{
              ...styles.subtitle,
              fontSize: width <= 300 ? "12px" : "18px",
            }}
          >
            Delivering excellence in healthcare with compassion,
            integrity, and innovation.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2
            style={{
              ...styles.sectionHeading,
              fontSize: width <= 300 ? "16px" : "32px",
            }}
          >
            Who We Are
          </h2>

          <p style={styles.text}>
            Shri Gurupad Hospital is a modern, multispecialty healthcare
            institution dedicated to providing world-class medical services.
          </p>

          <p style={styles.text}>
            With advanced infrastructure and ethical practices, we create a
            healing environment built on trust and excellence.
          </p>
        </div>
      </section>
      {/* MISSION VISION VALUES */}
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
            gap: width <= 300 ? "20px" : "40px",
          }}
        >
          {/* CARD */}
          {[
            {
              title: "🎯 Our Mission",
              content:
                "To provide high-quality, affordable healthcare services that improve lives.",
            },
            {
              title: "🌟 Our Vision",
              content:
                "To become the most trusted healthcare provider recognized for excellence.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                ...styles.card,
                padding: dynamicCardPadding,
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
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p>{item.content}</p>
            </div>
          ))}

          {/* VALUES CARD */}
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
<section style={{ padding: "60px 20px" }}>
  <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
    Our Contributors
  </h2>

  <p style={{ textAlign: "center", marginBottom: "20px", color: "#64748b" }}>
    Our contributors who support and strengthen our healthcare mission
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        width > 992
          ? "repeat(3,1fr)"
          : width > 600
          ? "repeat(2,1fr)"
          : "1fr",
      gap: "30px"
    }}
  >
    {loading ? (
  <p style={{ textAlign: "center" }}>Loading...</p>
) : contributors.length === 0 ? (
  <p style={{ textAlign: "center" }}>No Contributors Yet</p>
) : (
  contributors.map((c) => (
    <div
      key={c.id}
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "15px",
        textAlign: "center"
      }}
    >
      {c.image_url ? (
        <img
          src={c.image_url}
          alt={c.name}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />
      ) : (
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px"
          }}
        >
          Photo Not Available
        </div>
      )}

      <h4 style={{ marginTop: "10px" }}>{c.name}</h4>
    </div>
  ))
)}
  </div>
</section>
      {/* CTA */}
      <section
        style={{
          ...styles.cta,
          padding: isUltraSmall ? "50px 10px" : "80px 20px",
        }}
      >
        <h2 style={{ fontSize: width <= 300 ? "16px" : "30px" }}>
          We Are Available 24/7
        </h2>

        <p style={{ opacity: 0.9 }}>
          Your health is our highest priority.
        </p>

        <Link
          to="/contact"
          style={{
            ...styles.ctaBtn,
            fontSize: width <= 300 ? "12px" : "14px",
            padding: width <= 300 ? "10px 20px" : "14px 35px",
          }}
        >
          Contact Hospital
        </Link>
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

  heroContent: {
    maxWidth: "900px",
    margin: "auto",
  },

  title: {
    fontWeight: "800",
    lineHeight: "1.2",
  },

  subtitle: {
    marginTop: "20px",
    opacity: 0.95,
  },

  section: {
    padding: "60px 15px",
  },

  container: {
    maxWidth: "900px",
    margin: "auto",
    textAlign: "center",
  },

  sectionHeading: {
    marginBottom: "25px",
    fontWeight: "700",
  },

  text: {
    lineHeight: "1.8",
    marginBottom: "15px",
    color: "#475569",
    fontSize: "0.95rem",
  },

  mvvSection: {
    padding: "60px 15px",
    background:
      "linear-gradient(180deg, #ffffff, #f0f6ff)",
  },

  mvvGrid: {
    maxWidth: "1100px",
    margin: "auto",
    display: "grid",
  },

  card: {
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(16px)",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255,255,255,0.4)",
  },

  cardTitle: {
    marginBottom: "12px",
    fontSize: "1.1rem",
    fontWeight: "700",
  },

  list: {
    paddingLeft: "18px",
    lineHeight: "1.7",
    fontSize: "0.9rem",
  },

  cta: {
    textAlign: "center",
    background:
      "linear-gradient(135deg, #2563eb, #1e3a8a)",
    color: "#fff",
  },

  ctaBtn: {
    display: "inline-block",
    marginTop: "20px",
    background: "#fff",
    color: "#2563eb",
    borderRadius: "40px",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default About;