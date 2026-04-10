import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      icon: "📋",
      title: "Free Appointment",
      price: "₹0",
      features: [
        "No booking charges",
        "Walk-in or online appointment",
        "Quick consultation access",
      ],
    },
    {
      icon: "👶",
      title: "Delivery Package",
      price: "₹35,000",
      features: [
        "Normal childbirth",
        "Mother & baby care",
        "Hospital stay included",
      ],
    },
    {
      icon: "🩺",
      title: "Hysterectomy",
      price: "₹30,000",
      features: [
        "Uterus removal surgery",
        "Expert surgical care",
        "Comfortable recovery",
      ],
    },
    {
      icon: "💉",
      title: "Kidney Stone (PCNL)",
      price: "₹40,000",
      features: [
        "Stone removal procedure",
        "Minimally invasive surgery",
        "Post-op recovery care",
      ],
    },
    {
      icon: "🏥",
      title: "Hernia Surgery",
      price: "₹30,000",
      features: [
        "Hernia repair operation",
        "Experienced surgeon",
        "Fast healing support",
      ],
    },
    {
      icon: "🩻",
      title: "Appendix Surgery",
      price: "₹20,000",
      features: [
        "Appendix removal",
        "Quick and safe process",
        "Hospital stay included",
      ],
    },
    {
      icon: "🛏️",
      title: "General Ward",
      price: "₹375/day",
      features: ["Shared room", "Basic comfort", "Affordable stay"],
    },
    {
      icon: "🛌",
      title: "VIP Ward (Non-AC)",
      price: "₹1,175/day",
      features: ["Private room", "Premium services", "Peaceful environment"],
    },
    {
      icon: "❄️",
      title: "VIP Ward (AC)",
      price: "₹1,675/day",
      features: [
        "Air-conditioned private room",
        "Modern amenities",
        "Personal attention",
      ],
    },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .pricing-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #eef2ff, #f8fafc);
          padding: 60px 15px;
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
        }

        .heading {
          text-align: center;
          font-size: 34px;
          font-weight: 800;
          margin-bottom: 10px;
          color: #0f172a;
          word-break: break-word;
        }

        .subheading {
          text-align: center;
          font-size: 15px;
          margin-bottom: 50px;
          color: #475569;
        }

        .grid {
          display: grid;
          gap: 30px;
          max-width: 1200px;
          margin: auto;
        }

        @media (min-width: 600px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 992px) {
          .grid { grid-template-columns: repeat(3, 1fr); }
        }

        .card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(16px);
          border-radius: 22px;
          padding: 25px;
          text-align: center;
          transition: all 0.35s ease;
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 15px 40px rgba(0,0,0,0.08);
          cursor: pointer;
        }

        .card:hover {
          transform: translateY(-10px) scale(1.03);
          box-shadow: 0 25px 60px rgba(37,99,235,0.25);
        }

        .icon {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #0f172a;
        }

        .price {
          font-size: 22px;
          font-weight: 800;
          margin: 10px 0;
          color: #2563eb;
        }

        .features {
          list-style: none;
          padding: 0;
          margin-bottom: 15px;
        }

        .features li {
          font-size: 14px;
          margin-bottom: 6px;
          color: #475569;
        }

        .btn {
          width: 100%;
          padding: 10px;
          border-radius: 30px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          background: linear-gradient(135deg, #2563eb, #1e3a8a);
          color: white;
          transition: 0.3s;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(37,99,235,0.4);
        }

        @media (max-width: 272px) {
          .title { font-size: 14px; }
          .price { font-size: 18px; }
          .features li { font-size: 12px; }
          .icon { font-size: 28px; }
        }

        @media (max-width: 195px) {
          .heading {
            font-size: 18px;
            padding: 0 5px;
          }
        }

      `}</style>

      <div className="pricing-page">
        <Helmet>
          <title>Hospital Charges & Treatment Cost | Shri Gurupad Hospital</title>
        </Helmet>

        <h2 className="heading">Our Pricing Plans</h2>
        <p className="subheading">
          Transparent & Affordable Healthcare Packages
        </p>

        <div className="grid">
          {plans.map((plan, index) => (
            <div className="card" key={index}>
              <div className="icon">{plan.icon}</div>
              <div className="title">{plan.title}</div>
              <div className="price">{plan.price}</div>

              <ul className="features">
                {plan.features.map((item, i) => (
                  <li key={i}>✔ {item}</li>
                ))}
              </ul>

              <button
                className="btn"
                onClick={() => navigate("/contact")}
              >
                Enquire Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Pricing;