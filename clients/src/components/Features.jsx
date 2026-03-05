import React, { useState, useEffect } from "react";

function Features() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const features = [
    { icon: "👩‍⚕️", title: "Obstetrics & Gynecology Specialist", desc: "Comprehensive care for women’s health including prenatal and reproductive services delivered by expert specialists." },
    { icon: "👶", title: "Pediatric Care", desc: "Dedicated child healthcare services offering preventive and diagnostic support for infants and children." },
    { icon: "🦴", title: "Orthopedics Department", desc: "Advanced treatment of bone, joint, and muscle disorders using modern techniques." },
    { icon: "🔪", title: "General Surgery", desc: "Comprehensive surgical services performed with focus on patient safety and recovery." },
    { icon: "🦾", title: "Bone Specialist", desc: "Expert care for fractures and bone-related ailments with rehabilitation support." },
    { icon: "🔥", title: "Pain Management", desc: "Modern therapies for acute and chronic pain improving quality of life." },
    { icon: "🚑", title: "Emergency Services", desc: "24/7 emergency care with rapid response teams and life-support systems." },
    { icon: "🤸‍♂️", title: "Physiotherapy", desc: "Personalized rehabilitation programs to restore movement and functionality." },
    { icon: "📡", title: "Sonography", desc: "High-precision ultrasound imaging for accurate diagnostics." },
    { icon: "🏥", title: "ICU", desc: "Advanced monitoring and life-support facilities for critical care patients." },
    { icon: "🛠️", title: "Modular Operation Theater", desc: "State-of-the-art sterile OT equipped with latest surgical technology." },
    { icon: "❤️‍🩹", title: "Echocardiography Doppler", desc: "Advanced heart imaging to evaluate cardiac function accurately." },
    { icon: "🍼", title: "NICU", desc: "Specialized care for premature and critically ill newborns." },
    { icon: "📈", title: "ECG", desc: "Accurate cardiac rhythm monitoring for heart diagnosis." },
    { icon: "🩻", title: "Digital X-Ray", desc: "High-resolution digital imaging for quick diagnosis." },
    { icon: "📷", title: "C-Arm Imaging", desc: "Real-time imaging assistance for minimally invasive surgeries." },
    { icon: "🏨", title: "OPD", desc: "Efficient outpatient services for consultations and follow-ups." }
  ];

  const dynamicPadding =
    width <= 200
      ? "15px"
      : width <= 350
      ? "20px"
      : "30px";

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .features-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          padding: 60px 15px;
          font-family: 'Segoe UI', sans-serif;
          overflow-x: hidden;
        }

        .heading {
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 50px;
          color: #0f172a;
          word-break: break-word;
        }

        .grid {
          display: grid;
          gap: 25px;
          max-width: 1200px;
          margin: auto;
        }

        @media (min-width: 600px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 992px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          text-align: center;
          transition: 0.4s ease;
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 15px 30px rgba(0,0,0,0.05);
          word-break: break-word;
          overflow: hidden;
        }

        .icon {
          font-size: 36px;
          margin-bottom: 15px;
        }

        .title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #1e293b;
        }

        .desc {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
        }
      `}</style>

      <div className="features-page">
        <h2 className="heading">Why Choose Our Hospital?</h2>

        <div className="grid">
          {features.map((item, index) => (
            <div
              className="card"
              key={index}
              style={{ padding: dynamicPadding }}
            >
              <div className="icon">{item.icon}</div>
              <div className="title">{item.title}</div>
              <div className="desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Features;