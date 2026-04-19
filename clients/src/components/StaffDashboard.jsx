import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
function StaffDashboard() {
  const API = "https://fullstack-mediadmin.onrender.com";
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

useEffect(() => {
  const fetchToday = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(`${API}/api/my-attendance?from=${today}&to=${today}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setTodayAttendance(data[0]);
      }
    } catch {}
  };
  fetchToday();
}, []);

  const [todayAttendance, setTodayAttendance] = useState(null);
  const fetchData = async (customFrom, customTo) => {
  const f = customFrom || from;
  const t = customTo || to;

  if (!f || !t) return;

  setLoading(true);

  try {
    const res = await fetch(
      `${API}/api/my-attendance?from=${f}&to=${t}`,
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
  const getMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

const isAllowed = (slot) => {
  const t = getMinutes();
  const map = {
    morning: [420, 510],
    afternoon: [780, 870],
    night: [1140, 1230],
  };
  const [s, e] = map[slot];
  return t >= s && t <= e;
};
 const markAttendance = async (slot) => {
  try {
    setLoading(true); // 🔥 UX improve (button click pe loader)

    const res = await fetch(`${API}/api/self-attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ slot })
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Failed to mark attendance");
      return;
    }

    alert(result.message || "Attendance marked");

    const today = new Date().toISOString().split("T")[0];

    // 🔥 Direct fresh data fetch (state delay issue avoid)
    await fetchData(today, today);

    // 🔥 also update today's attendance state (buttons disable ke liye)
    setTodayAttendance(prev => ({
  ...(prev || {}),
  [slot]: true
}));

  } catch (err) {
    alert("Error while marking attendance");
  } finally {
    setLoading(false);
  }
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
      <div style={{ marginTop: "20px" }}>
  <h3>📅 Aaj ki attendance</h3>
<p style={{ marginBottom: "10px", color: "#475569" }}>
  Today: {new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</p>
  <button
  style={primaryBtn}
  disabled={!isAllowed("morning") || todayAttendance?.morning}
  title={!isAllowed("morning") ? "Allowed only 7–8:30 AM" : ""}
  onClick={() => markAttendance("morning")}
>
  🌅 Morning (7 - 8:30)
</button>

<button
  style={{ ...primaryBtn, marginLeft: "10px" }}
  disabled={!isAllowed("afternoon") || todayAttendance?.afternoon}
  title={!isAllowed("afternoon") ? "Allowed only 1–2:30 PM" : ""}
  onClick={() => markAttendance("afternoon")}
>
  🌞 Afternoon (1 - 2:30)
</button>

<button
  style={{ ...primaryBtn, marginLeft: "10px" }}
  disabled={!isAllowed("night") || todayAttendance?.night}
  title={!isAllowed("night") ? "Allowed only 7–8:30 PM" : ""}
  onClick={() => markAttendance("night")}
>
  🌙 Night (7 - 8:30)
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