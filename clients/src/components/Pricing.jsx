import React from "react";
import { useNavigate } from "react-router-dom";

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
        html, body { margin: 0; padding: 0; overflow-x: hidden; width: 100%; }

        .pricing-page {
          width: 100%;
          min-height: 100vh;
          padding: 40px 10px;
          background: linear-gradient(135deg, #e0f2fe, #eef2ff);
          font-family: sans-serif;
        }

        .heading {
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .subheading {
          text-align: center;
          font-size: 13px;
          margin-bottom: 30px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          width: 100%;
        }

        .card {
          width: 100%;
          max-width: 100%;
          background: #ffffff;
          border-radius: 14px;
          padding: 15px 10px;
          text-align: center;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .icon { font-size: 24px; margin-bottom: 6px; }
        .title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
        .price { font-size: 18px; font-weight: 700; margin: 6px 0; }
        .features { list-style: none; padding: 0; margin-bottom: 10px; }
        .features li { font-size: 11px; margin-bottom: 4px; }
        .btn {
          width: 100%;
          padding: 7px;
          border-radius: 18px;
          border: none;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          background: #3b82f6;
          color: white;
        }

        /* Tablet */
        @media (min-width: 500px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
          .heading { font-size: 26px; }
          .subheading { font-size: 14px; }
          .title { font-size: 16px; }
          .price { font-size: 20px; }
          .features li { font-size: 12px; }
          .btn { font-size: 12px; padding: 8px; }
        }

        /* Medium screens */
        @media (min-width: 768px) {
          .grid { grid-template-columns: repeat(3, 1fr); }
          .heading { font-size: 28px; }
        }

        /* Large screens */
        @media (min-width: 1100px) {
          .grid { grid-template-columns: repeat(3, 1fr); } /* max 3 cards */
          .heading { font-size: 30px; }
        }
      `}</style>

      <div className="pricing-page">
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