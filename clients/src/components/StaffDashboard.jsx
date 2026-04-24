import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import FaceVerify from "./FaceVerify";
function StaffDashboard() {
  const API = "https://fullstack-mediadmin.onrender.com";
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
const [showFace, setShowFace] = useState(false);
const [pendingSlot, setPendingSlot] = useState(null);
  const fetchToday = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(`${API}/api/my-attendance?from=${today}&to=${today}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
setTodayAttendance(data[0] || {});
    } catch {}
  };
useEffect(() => {
  fetchToday();
}, []);

  const [todayAttendance, setTodayAttendance] = useState(null);
  const fetchData = async (customFrom, customTo) => {
  const f = typeof customFrom === "string" ? customFrom : from;
  const t = typeof customTo === "string" ? customTo : to;

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

// const isAllowed = (slot) => {
//   const t = getMinutes();
//   const map = {
//     morning: [420, 510],
//     afternoon: [780, 870],
//     night: [1140, 1230],
//   };
//   const [s, e] = map[slot];
//   return t >= s && t <= e;
// };

const isAllowed = () => true; // 🔥 TEST MODE
 const markAttendance = async (slot) => {
  try {
    setLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
const lng = position.coords.longitude;
const accuracy = position.coords.accuracy;

        const res = await fetch(`${API}/api/self-attendance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ slot, lat, lng, accuracy })
        });

        const result = await res.json();

        if (!res.ok) {
  alert(result.message || "Failed");
  setLoading(false);
  return;
}

        alert(result.message);
        await fetchToday();
setLoading(false);
        const today = new Date().toISOString().split("T")[0];
        await fetchData(today, today);

        setTodayAttendance(prev => ({
          ...(prev || {}),
          [slot]: true
        }));
      },
      (error) => {
  alert("Location permission required");
  setLoading(false);
}
    );
  } catch {
    alert("Error");
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
const markAttendanceWithFace = async (slot, embedding) => {
  try {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`${API}/api/self-attendance-face`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              slot,
              embedding,
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy
            })
          });

          const result = await res.json();

          if (!res.ok) {
            alert(result.message);
          } else {
            alert(result.message);
            fetchToday();
          }
        } catch {
          alert("Network error");
        }
        setLoading(false);
      },
      () => {
        alert("Location permission required");
        setLoading(false);
      }
    );
  } catch {
    alert("Error");
    setLoading(false);
  }
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
        <button style={primaryBtn} onClick={() => fetchData()}>
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
  disabled={false}
  onClick={() => {
    console.log("clicked morning");
    setPendingSlot("morning");
    setShowFace(true);
  }}
>
  🌅 Morning (7 - 8:30)
</button>
{!isAllowed("morning") && <p style={{ color: "red" }}>⛔ Time over</p>}

<button
  style={primaryBtn}
  disabled={todayAttendance?.afternoon || !isAllowed("afternoon")}
  onClick={() => {
    setPendingSlot("afternoon");
    setShowFace(true);
  }}
>
  🌞 Afternoon (1 - 2:30)
</button>
{!isAllowed("afternoon") && <p style={{ color: "red" }}>⛔ Time over</p>}

<button
  style={primaryBtn}
  disabled={todayAttendance?.night || !isAllowed("night")}
  onClick={() => {
    setPendingSlot("night");
    setShowFace(true);
  }}
>
  🌙 Night (7 - 8:30)
</button>
{!isAllowed("night") && <p style={{ color: "red" }}>⛔ Time over</p>}
</div>
{showFace && (
  <FaceVerify
    onVerify={(embedding) => {
      markAttendanceWithFace(pendingSlot, embedding);
      setShowFace(false);
    }}
  />
)}
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