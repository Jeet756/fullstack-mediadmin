import React, { useState, useEffect } from "react";

function Join() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    position: "",
    qualification: "",
    experience: "",
    license: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://fullstack-mediadmin.onrender.com/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const dynamicPadding =
    width <= 200
      ? "15px"
      : width <= 350
      ? "25px"
      : "40px";

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: linear-gradient(135deg, #eef2ff, #e0f2fe);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 15px;
          font-family: 'Segoe UI', sans-serif;
          overflow-x: hidden;
        }

        .card {
          width: 100%;
          max-width: 900px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.4);
          word-break: break-word;
          overflow: hidden;
        }

        h1 {
          text-align: center;
          margin-bottom: 10px;
          font-size: 32px;
          color: #1e293b;
          word-break: break-word;
        }

        .subtitle {
          text-align: center;
          margin-bottom: 40px;
          color: #64748b;
          word-break: break-word;
        }

        h3 {
          margin-bottom: 20px;
          color: #334155;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 5px;
        }

        .grid {
          display: grid;
          gap: 20px;
        }

        .field {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .field label {
          margin-bottom: 6px;
          font-size: 14px;
          color: #475569;
        }

        .field input,
        .field select,
        .field textarea {
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          outline: none;
          font-size: 14px;
          width: 100%;
        }

        textarea {
          resize: none;
        }

        .btn-container {
          text-align: center;
          margin-top: 40px;
        }

        button {
          padding: 14px 40px;
          border-radius: 30px;
          border: none;
          font-size: 16px;
          font-weight: 600;
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          color: white;
          cursor: pointer;
          width: 100%;
          max-width: 300px;
        }

        @media (min-width: 600px) {
          .grid.two {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="page">
        <div className="card" style={{ padding: dynamicPadding }}>
          <h1>Join Our Medical Team</h1>
          <p className="subtitle">
            Become part of a professional and caring healthcare environment.
          </p>

          <form onSubmit={handleSubmit}>
            <h3>Personal Details</h3>

            <div className="grid two">
              <div className="field">
                <label>First Name</label>
                <input name="firstName" onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Last Name</label>
                <input name="lastName" onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Email</label>
                <input type="email" name="email" onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Phone</label>
                <input type="tel" name="phone" onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Date of Birth</label>
                <input type="date" name="dob" onChange={handleChange} required />
              </div>
            </div>

            <div className="field" style={{ marginTop: "20px" }}>
              <label>Full Address</label>
              <textarea rows="3" name="address" onChange={handleChange} required />
            </div>

            <h3 style={{ marginTop: "40px" }}>Professional Details</h3>

            <div className="field">
              <label>Position Applying For</label>
              <select name="position" onChange={handleChange} required>
                <option value="">Select...</option>
                <option>Doctor</option>
                <option>Nurse</option>
                <option>Lab Technician</option>
                <option>Pharmacist</option>
                <option>Emergency Staff</option>
                <option>Receptionist</option>
              </select>
            </div>

            <div className="grid two" style={{ marginTop: "20px" }}>
              <div className="field">
                <label>Highest Qualification</label>
                <input name="qualification" onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Years of Experience</label>
                <input type="number" name="experience" onChange={handleChange} required />
              </div>
            </div>

            <div className="field" style={{ marginTop: "20px" }}>
              <label>Medical Registration / License (if any)</label>
              <input name="license" onChange={handleChange} />
            </div>

            <div className="btn-container">
              <button type="submit">Submit Application</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Join;