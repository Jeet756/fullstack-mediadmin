import React, { useState } from "react";

function Faq() {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "What are the hospital's visiting hours?",
      answer:
        "Visiting hours are from 10:00 AM to 6:00 PM, Monday to Saturday. Emergency visits are allowed 24/7 with permission.",
    },
    {
      question: "Do I need an appointment for OPD?",
      answer:
        "Yes, we recommend booking an appointment online or via phone to avoid waiting time in the OPD.",
    },
    {
      question: "Does the hospital have ambulance services?",
      answer:
        "Yes, we provide 24/7 ambulance service. Call our emergency number for immediate help.",
    },
    {
      question: "Which insurance providers are accepted?",
      answer:
        "We accept most major insurance providers. Please contact our reception for detailed insurance assistance.",
    },
    {
      question: "Is parking available for patients and visitors?",
      answer:
        "Yes, we have a dedicated parking area available for both patients and visitors at no additional cost.",
    },
    {
      question: "Can I get medical reports online?",
      answer:
        "Yes, patients can access their reports through our secure online portal after logging in.",
    },
    {
      question: "Are emergency services available at night?",
      answer:
        "Absolutely. Our emergency department is open 24/7 including nights, weekends, and holidays.",
    },
    {
      question: "Is there a pharmacy inside the hospital?",
      answer:
        "Yes, we have a fully stocked pharmacy inside the hospital premises for patient convenience.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <style>{`
        .faq-page {
          min-height: 100vh;
          padding: 80px 20px;
          background: linear-gradient(135deg, #eef2ff, #e0f7fa);
          font-family: 'Segoe UI', sans-serif;
        }

        .heading {
  text-align: center;
  font-size: clamp(22px, 6vw, 38px); /* responsive font */
  font-weight: 700;
  margin-bottom: 60px;
  color: #0f172a;
  padding: 0 10px; /* side space */
  word-break: break-word; /* force wrap on very small screens */
}

        .faq-container {
          max-width: 900px;
          margin: auto;
        }

        .faq-item {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-radius: 18px;
          margin-bottom: 20px;
          overflow: hidden;
          box-shadow: 0 15px 30px rgba(0,0,0,0.05);
          transition: 0.3s ease;
          border: 1px solid rgba(255,255,255,0.4);
        }

        .faq-question {
          padding: 20px 25px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #1e293b;
        }

        .faq-question:hover {
          background: rgba(99,102,241,0.05);
        }

        .faq-answer {
          padding: 0 25px 20px 25px;
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          animation: fadeIn 0.3s ease-in-out;
        }

        .icon {
          font-size: 18px;
          transition: transform 0.3s ease;
        }

        .rotate {
          transform: rotate(180deg);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="faq-page">
        <h2 className="heading">Frequently Asked Questions</h2>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span
                  className={`icon ${
                    activeIndex === index ? "rotate" : ""
                  }`}
                >
                  ▼
                </span>
              </div>

              {activeIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Faq;