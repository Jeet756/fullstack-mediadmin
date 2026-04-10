import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const Doctors = () => {
  const API = "https://fullstack-mediadmin.onrender.com";
  const [doctors, setDoctors] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const filteredDoctors = doctors.filter((doc) => {
  const searchText = search.toLowerCase().trim();

  const name = doc.name
    .toLowerCase()
    .replace("dr.", "")
    .replace("dr ", "")
    .trim();

  return name.includes(searchText);
});
  useEffect(() => {
    fetch(`${API}/api/doctors`)
      .then((res) => res.json())
      .then((data) => {
        data.sort((a, b) => a.order_index - b.order_index);
        setDoctors(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isUltraSmall = width <= 245;

  const dynamicPadding =
    width <= 200 ? "15px" : width <= 350 ? "20px" : "30px";

  return (
    <div style={styles.wrapper}>
      <Helmet>
        <title>Our Doctors | Best Medical Specialists</title>
        <meta
          name="description"
          content="Meet our experienced doctors including gynecologists, surgeons, physicians, and specialists dedicated to quality healthcare."
        />
      </Helmet>

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
          Meet Our Expert Medical Staff
        </h1>

        <p
          style={{
            ...styles.heroSubtitle,
            fontSize: isUltraSmall ? "12px" : "1.1rem",
          }}
        >
          Highly qualified professionals dedicated to your health and well-being
        </p>
      </section>
          <div style={{ textAlign: "center", marginBottom: "30px", marginTop: "20px" }}>
  <input
    type="text"
    placeholder="Search doctor by name..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      padding: "12px 20px",
      width: "100%",
      maxWidth: "400px",
      borderRadius: "30px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: "14px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
    }}
  />
</div>
      {/* SECTION */}
      <section style={styles.section}>
        {loading ? (
          <h2 style={{ textAlign: "center" }}>Loading...</h2>
        ) : (
          <div
            style={{
              ...styles.grid,
              gridTemplateColumns:
                width > 992
                  ? "repeat(3, 1fr)"
                  : width > 600
                  ? "repeat(2, 1fr)"
                  : "1fr",
            }}
          >
            {filteredDoctors.length === 0 ? (
  <h3 style={{ textAlign: "center" }}>No doctor found</h3>
) : (
  filteredDoctors.map((doc) => (
    <div
      key={doc.id}
      style={{
        ...styles.card,
        padding: dynamicPadding,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
        e.currentTarget.style.boxShadow =
          "0 20px 50px rgba(37,99,235,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)";
      }}
    >
      <div style={styles.imageWrapper}>
        {doc.image_url ? (
          <img src={doc.image_url} alt={doc.name} style={styles.image} />
        ) : (
          <div style={styles.noImage}>
            <span>Photo Not Available</span>
          </div>
        )}
      </div>

      <h3 style={styles.name}>{doc.name}</h3>
      <p style={styles.degree}>{doc.degree}</p>
      <p style={styles.desc}>{doc.description}</p>
    </div>
  ))
)}
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  noImage: {
  width: "110px",
  height: "110px",
  borderRadius: "50%",
  background: "#e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center", // 👈 add this
  padding: "5px",      // 👈 add this
  fontSize: "11px",
  color: "#475569",
  border: "4px solid #3b82f6",
  fontWeight: "600"
},
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
    wordBreak: "break-word",
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
    padding: "80px 20px",
    maxWidth: "1300px",
    margin: "auto",
  },

  grid: {
    display: "grid",
    gap: "30px",
  },

  card: {
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(16px)",
    borderRadius: "22px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    transition: "all 0.35s ease",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.4)",
    textAlign: "center",
  },

  imageWrapper: {
  marginBottom: "15px",
  display: "flex",          // 👈 add this
  justifyContent: "center", // 👈 add this
},

  image: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #3b82f6",
  },

  name: {
    fontSize: "1.2rem",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#0f172a",
  },

  degree: {
    fontSize: "0.85rem",
    color: "#2563eb",
    marginBottom: "12px",
    fontWeight: "600",
  },

  desc: {
    fontSize: "0.9rem",
    color: "#475569",
    lineHeight: "1.6",
  },
};

export default Doctors;