import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [verifying, setVerifying] = useState(false);
const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    setSending(true);
    try {
      const res = await fetch(
        "https://fullstack-mediadmin.onrender.com/api/send-reset-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setStep(2);
      }

      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSending(false);
    }
  };

 const verifyOtp = async () => {
  setVerifying(true);   // 🔥 start loading

  try {
    const res = await fetch(
      "https://fullstack-mediadmin.onrender.com/api/verify-reset-otp",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setStep(3);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  } finally {
    setVerifying(false);  // 🔥 stop loading
  }
};

 const resetPassword = async () => {
  setUpdating(true);  // 🔥 start loading

  try {
    const res = await fetch(
      "https://fullstack-mediadmin.onrender.com/api/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Password updated successfully");
      navigate("/login");
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  } finally {
    setUpdating(false); // 🔥 stop loading
  }
};

  return (
    <>
      <style>{`
        .fp-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          padding: 20px;
        }

        .fp-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from {opacity:0; transform: translateY(20px);}
          to {opacity:1; transform: translateY(0);}
        }

        .fp-title {
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 10px;
        }

        .fp-desc {
          font-size: 14px;
          color: #cbd5f5;
          margin-bottom: 25px;
        }

        .fp-input {
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 15px;
          border-radius: 12px;
          border: none;
          outline: none;
          font-size: 14px;
          background: rgba(255,255,255,0.15);
          color: #fff;
        }

        .fp-input::placeholder {
          color: #cbd5e1;
        }

        .fp-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .fp-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.4);
        }

        .fp-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          gap: 8px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #475569;
        }

        .dot.active {
          background: #6366f1;
          transform: scale(1.2);
        }
      `}</style>

      <div className="fp-container">
        <Helmet>
          <title>Reset Password | Shri Gurupad Hospital</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="fp-card">
          <div className="step-indicator">
            <div className={`dot ${step >= 1 ? "active" : ""}`}></div>
            <div className={`dot ${step >= 2 ? "active" : ""}`}></div>
            <div className={`dot ${step >= 3 ? "active" : ""}`}></div>
          </div>

          <div className="fp-title">Reset Password</div>
          <div className="fp-desc">
            Enter your email → verify OTP → set new password
          </div>

          {step === 1 && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="fp-input"
              />

              <button
                onClick={sendOtp}
                disabled={sending}
                className="fp-btn"
              >
                {sending ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="fp-input"
              />

              <button 
  onClick={verifyOtp} 
  className="fp-btn"
  disabled={verifying}
>
  {verifying ? "Verifying OTP..." : "Verify OTP"}
</button>
            </>
          )}

          {step === 3 && (
            <>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="fp-input"
              />

              <button 
  onClick={resetPassword} 
  className="fp-btn"
  disabled={updating}
>
  {updating ? "Updating Password..." : "Update Password"}
</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;