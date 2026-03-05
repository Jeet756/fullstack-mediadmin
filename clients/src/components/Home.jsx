import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const topImage = "/img1.jpg";
const posterImages = ["/poster1.jpg", "/poster2.jpg", "/poster3.jpg"];

const Home = () => {
  const [currentPoster, setCurrentPoster] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [isSmall, setIsSmall] = useState(window.innerWidth <= 320);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoster((prev) => (prev + 1) % posterImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
      setIsSmall(window.innerWidth <= 320);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () =>
    setCurrentPoster((prev) => (prev + 1) % posterImages.length);

  const handlePrev = () =>
    setCurrentPoster((prev) =>
      prev === 0 ? posterImages.length - 1 : prev - 1
    );

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", overflowX: "hidden" }}>
      
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          height: isMobile ? "70vh" : "90vh",
        }}
      >
        <img
          src={topImage}
          alt="Main"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "#fff",
            padding: "20px",
          }}
        >
          <h1
            style={{
              fontSize: isSmall ? "1.4rem" : isMobile ? "1.8rem" : "3rem",
              fontWeight: 700,
            }}
          >
            Advanced Healthcare With Trust
          </h1>

          <p
            style={{
              marginTop: "15px",
              fontSize: isSmall ? "0.8rem" : isMobile ? "0.9rem" : "1.2rem",
              letterSpacing: "1px",
              opacity: 0.9,
            }}
          >
            Compassion • Technology • Excellence
          </p>

          <Link
            to="/appointment"
            style={{
              marginTop: "25px",
              padding: isSmall ? "8px 18px" : "12px 28px",
              background: "linear-gradient(45deg,#0d6efd,#00c6ff)",
              color: "#fff",
              borderRadius: "40px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Book Appointment
          </Link>
        </div>
      </section>

      <section
        style={{
          position: "relative",
          width: "100%",
          margin: "60px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          height: isMobile ? "55vh" : "80vh",
          background:
            "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        }}
      >
        <img
          src={posterImages[currentPoster]}
          alt="bg"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(25px)",
            transform: "scale(1.05)",
            opacity: 0.4,
          }}
        />

        <div
          style={{
            position: "relative",
            width: isSmall ? "95%" : isMobile ? "90%" : "75%",
            height: isSmall ? "70%" : "85%",
            backdropFilter: "blur(20px)",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "25px",
            padding: isSmall ? "10px" : "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={posterImages[currentPoster]}
            alt="poster"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "20px",
            }}
          />
        </div>

        <button
          onClick={handlePrev}
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "#fff",
            borderRadius: "50%",
            padding: isSmall ? "6px 10px" : "10px 15px",
            cursor: "pointer",
          }}
        >
          ❮
        </button>

        <button
          onClick={handleNext}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "#fff",
            borderRadius: "50%",
            padding: isSmall ? "6px 10px" : "10px 15px",
            cursor: "pointer",
          }}
        >
          ❯
        </button>
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? "25px" : "50px",
          padding: isMobile ? "50px 15px" : "80px 8%",
        }}
      >
        <div style={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
          <h2
            style={{
              fontSize: isSmall ? "1.5rem" : isMobile ? "1.8rem" : "2.8rem",
              fontWeight: 700,
            }}
          >
            Heal With Care
          </h2>

          <p style={{ margin: "20px 0", opacity: 0.8 }}>
            We provide premium healthcare services with comfort,
            advanced technology, and compassionate treatment.
          </p>

          <Link
            to="/contact"
            style={{
              padding: "10px 24px",
              background: "#0d6efd",
              color: "#fff",
              borderRadius: "30px",
              textDecoration: "none",
            }}
          >
            Contact Us
          </Link>
        </div>

        <div style={{ flex: 1, textAlign: "center" }}>
          <img
            src="/img8.png"
            alt="hospital"
            style={{
              maxWidth: "100%",
              borderRadius: "20px",
            }}
          />
        </div>
      </section>

      <section
        style={{
          background: "linear-gradient(135deg,#f5f9ff,#eef3ff)",
          padding: isMobile ? "60px 15px" : "100px 8%",
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
        }}
      >
        {[
          { icon: "🩺", title: "Professional Care", text: "Experienced doctors delivering compassionate treatment." },
          { icon: "🚑", title: "24/7 Emergency", text: "Immediate response with modern equipment." },
          { icon: "🏥", title: "Advanced Facilities", text: "State-of-the-art infrastructure for comfort." }
        ].map((item, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "15px" }}>
              {item.icon}
            </div>
            <h3 style={{ marginBottom: "10px" }}>{item.title}</h3>
            <p style={{ opacity: 0.7 }}>{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;