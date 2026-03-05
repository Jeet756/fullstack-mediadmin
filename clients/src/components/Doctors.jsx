import { useEffect, useState } from "react";

const doctors = [
  {
    name: "Dr. Saraswati Gupta",
    degree: "MBBS, MS (Obstetrics & Gynecology)",
    desc: "Expert in childbirth, infertility, and comprehensive women’s healthcare."
  },
  {
    name: "Dr. Pankaj Gupta",
    degree: "MBBS, DA, FIPM",
    desc: "Pain management specialist and anesthesiologist."
  },
  {
    name: "Dr. Mayank Patidar",
    degree: "MD (Internal Medicine)",
    desc: "Treats chronic and acute medical conditions."
  },
  {
    name: "Dr. Rohan Jain",
    degree: "MBBS, MS (General & Laparoscopic Surgery)",
    desc: "Specialist in minimally invasive surgeries."
  },
  {
    name: "Dr. Avdhesh Swarnakar",
    degree: "MBBS, MS (Orthopaedics)",
    desc: "Expert in bone and joint disorders."
  },
  {
    name: "Dr. Madansingh Solanki",
    degree: "MD (Internal Medicine)",
    desc: "Focus on lifestyle and chronic diseases."
  },
  {
    name: "Dr. Rakesh Dawar",
    degree: "MBBS, MS (General Surgery)",
    desc: "Experienced laparoscopic surgeon."
  },
  {
    name: "Dr. Manoj Gurjar",
    degree: "MBBS, MS (General Surgery)",
    desc: "Skilled in trauma and emergency surgeries."
  },
  {
    name: "Dr. Rajneesh Patidar",
    degree: "MD (Internal Medicine)",
    desc: "Adult medicine and diagnostics expert."
  },
  {
    name: "Dr. Chandan Swarnakar",
    degree: "MBBS, MS (Gynecology)",
    desc: "Specialist in pregnancy and maternity care."
  },
  {
    name: "Dr. Aajam Sheikh",
    degree: "BDS, MDS (Oral & Dental Surgery)",
    desc: "Oral and dental surgery specialist."
  },
  {
    name: "Dr. Amit Naiek",
    degree: "MD (Internal Medicine)",
    desc: "Focused on chronic condition management."
  },
  {
    name: "Dr. Chandrakanta Gupta",
    degree: "MBBS, MS (Gynecology)",
    desc: "Comprehensive women’s healthcare expert."
  },
  {
    name: "Dr. Sweta Solanki",
    degree: "MBBS, MS (Gynecology)",
    desc: "Compassionate prenatal and gynecology care."
  },
  {
    name: "Dr. Nitin Rawat",
    degree: "MD (Internal Medicine)",
    desc: "Specialist in diabetes & hypertension."
  },
  {
    name: "Dr. Ajeet Solanki",
    degree: "MD (Pediatrics)",
    desc: "Child and neonatal health specialist."
  },
  {
    name: "Dr. Nishu Jain",
    degree: "MBBS, MS (Gynecology)",
    desc: "Expert in reproductive health treatments."
  }
];

const Doctors = () => {
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
      ? "20px"
      : "30px";

  return (
    <div style={styles.wrapper}>

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

      <section style={styles.section}>
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
          {doctors.map((doc, index) => (
            <div
              key={index}
              style={{
                ...styles.card,
                padding: dynamicPadding,
              }}
            >
              <h3 style={styles.name}>{doc.name}</h3>
              <p style={styles.degree}>{doc.degree}</p>
              <p style={styles.desc}>{doc.desc}</p>
            </div>
          ))}
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
    maxWidth: "1300px",
    margin: "auto",
  },

  grid: {
    display: "grid",
    gap: "30px",
  },

  card: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
    transition: "0.3s ease",
    overflow: "hidden",
    wordBreak: "break-word",
  },

  name: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "10px",
  },

  degree: {
    fontSize: "0.9rem",
    color: "#0d6efd",
    marginBottom: "15px",
    fontWeight: "500",
    wordBreak: "break-word",
  },

  desc: {
    fontSize: "0.9rem",
    color: "#555",
    lineHeight: "1.6",
    wordBreak: "break-word",
  }

};

export default Doctors;