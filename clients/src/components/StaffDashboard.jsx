import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Helmet } from "react-helmet-async";
function StaffDashboard() {
  const API = "https://fullstack-mediadmin.onrender.com";
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const fetchData = async () => {
    if (!from || !to) return alert("Select date range");
    if (new Date(from) > new Date(to))
      return alert("Invalid date range");
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/api/my-attendance?from=${from}&to=${to}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await res.json();
      if (!res.ok) {
        alert(result.message || "Error");
        setData([]);
      } else {
        setData(Array.isArray(result) ? result : []);
      }
    } catch {
      alert("Error fetching data");
    }
    setLoading(false);
  };
  const downloadExcel = () => {
    if (!data.length) return alert("No data");
    const excelData = data.map((d) => ({
      Date: new Date(d.date).toLocaleDateString("en-GB"),
      Status: d.status,
      Morning: d.morning ? "✔️" : "",
      Afternoon: d.afternoon ? "✔️" : "",
      Night: d.night ? "✔️" : "",
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `attendance_${from}_to_${to}.xlsx`);
  };
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        color: "#1e293b",
        padding: "20px",
      }}
    >
      <Helmet>
        <title>Staff Dashboard</title>
      </Helmet>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600" }}>
          📊 My Attendance
        </h1>
        <p style={{ color: "#64748b" }}>
          Track your attendance easily
        </p>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          padding: "20px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={inputStyle}
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={inputStyle}
        />
        <button style={primaryBtn} onClick={fetchData}>
          🔍 Search
        </button>
        <button style={secondaryBtn} onClick={downloadExcel}>
          ⬇️ Export
        </button>
      </div>
      <div
        style={{
          marginTop: "20px",
          borderRadius: "16px",
          padding: "15px",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "30px" }}>
            ⏳ Loading...
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
            No data found
          </div>
        ) : (
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              paddingRight: "5px",
            }}
          >
            {data.map((d, i) => {
              const formattedDate = new Date(d.date).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              );
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 5px",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <span>{formattedDate}</span>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {d.status === "present" && (
                      <>
                        {d.morning && <Badge text="Morning" color="#22c55e" />}
                        {d.afternoon && <Badge text="Afternoon" color="#3b82f6" />}
                        {d.night && <Badge text="Night" color="#a855f7" />}
                      </>
                    )}
                    {d.status === "absent" && (
                      <Badge text="Absent" color="#ef4444" />
                    )}
                    {d.status === "not_marked" && (
                      <Badge text="Not Marked" color="#f59e0b" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <button
        style={{ ...secondaryBtn, marginTop: "20px" }}
        onClick={handleLogout}
      >
        🚪 Logout
      </button>
    </div>
  );
}
/* 🔥 STYLES */
const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: "#1e293b",
};
const primaryBtn = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "500",
};
const secondaryBtn = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: "#1e293b",
  cursor: "pointer",
};
/* 🔥 BADGE */
function Badge({ text, color }) {
  return (
    <span
      style={{
        background: color,
        color: "#fff",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "500",
      }}
    >
      {text}
    </span>
  );
}
export default StaffDashboard;