import React, { useState } from "react";

function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const response = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    alert(result.message);
    return;
  }

  localStorage.setItem("token", result.token);
  localStorage.setItem("role", result.role);

  if (result.role === "admin") {
    window.location.href = "/admin";
  } else if (result.role === "staff") {
    window.location.href = "/staff";
  } else {
    window.location.href = "/patient";
  }
};

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          font-family: 'Segoe UI', sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(20px);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          color: white;
        }

        .login-card h2 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 28px;
          font-weight: 600;
        }

        .field {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
        }

        .field input {
          padding: 12px;
          border-radius: 10px;
          border: none;
          outline: none;
          font-size: 14px;
          transition: 0.3s ease;
        }

        .field input:focus {
          box-shadow: 0 0 0 3px rgba(255,255,255,0.4);
        }

        button {
          width: 100%;
          padding: 12px;
          border-radius: 30px;
          border: none;
          font-size: 16px;
          font-weight: 600;
          background: white;
          color: #1e3a8a;
          cursor: pointer;
          transition: 0.3s ease;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }

        .footer-text {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          opacity: 0.9;
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <h2>Welcome Back</h2>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
              />
            </div>

            <button type="submit">Login</button>
          </form>

          <div className="footer-text">
            Secure Medical Portal Access
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;