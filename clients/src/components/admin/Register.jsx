import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import FaceRegister from "../admin/FaceRegister";
function Register() {
  const [faceImage, setFaceImage] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "",
  });
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://fullstack-mediadmin.onrender.com/api/register-with-face",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
  ...data,
  imageBase64: faceImage
}),
        }
      );
      const result = await res.json();
      if (!res.ok) return alert(result.message);
      alert(result.message);
      setData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        role: "",
      });
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };
  return (
    <>
      <Helmet>
        <title>Register User | Shri Gurupad Hospital</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="reg-container">
        <h2>Register New User</h2>
        <form className="reg-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={data.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={data.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={data.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={data.address}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            required
          />
          <select name="role" value={data.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="staff">Staff</option>
            <option value="patient">Patient</option>
          </select>
          <div>FACE COMPONENT BELOW 👇</div>
          <FaceRegister onCapture={(img) => setFaceImage(img)} />
            <div>FACE COMPONENT ABOVE 👆</div>
          <button type="submit">Register</button>
        </form>
      </div>
      <style>{`
        .reg-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 30px;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.4);
        }
        .reg-container h2 {
          text-align: center;
          font-size: 22px;
          margin-bottom: 25px;
          color: #0f172a;
        }
        .reg-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .reg-form input,
        .reg-form select {
          padding: 12px 15px;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          outline: none;
          font-size: 14px;
          transition: 0.2s;
        }
        .reg-form input:focus,
        .reg-form select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 5px rgba(99,102,241,0.3);
        }
        .reg-form button {
          padding: 12px 18px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          color: white;
          cursor: pointer;
          font-weight: 500;
          transition: 0.2s;
        }
        .reg-form button:hover {
          opacity: 0.85;
        }
        @media (max-width: 600px) {
          .reg-container {
            padding: 20px;
            margin: 15px;
          }
        }
      `}</style>
    </>
  );
}
export default Register;