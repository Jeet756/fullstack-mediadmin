import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default function ViewAttendance() {
  const API = "https://fullstack-mediadmin.onrender.com";
  const token = localStorage.getItem("token");
  const [mode, setMode] = useState("user");
  const [searchKey, setSearchKey] = useState("email");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
const [userFrom, setUserFrom] = useState("");
const [userTo, setUserTo] = useState("");
const [userData, setUserData] = useState([]);
const [userSummary, setUserSummary] = useState(null);
const [allFrom, setAllFrom] = useState("");
const [allTo, setAllTo] = useState("");
const [allData, setAllData] = useState([]);
const fetchUserAttendance = async () => {
  setLoading(true);
  try {
    const res = await fetch(
      `${API}/api/user-attendance?searchKey=${searchKey}&value=${value}&from=${userFrom}&to=${userTo}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const result = await res.json();
    setUserData(result.records || []);
    setUserSummary(result.summary || null);
  } catch {
    alert("Error fetching data");
  }
  setLoading(false);
};
  const fetchAllStats = async () => {
  setLoading(true);
  try {
    const res = await fetch(
      `${API}/api/all-attendance-stats?from=${allFrom}&to=${allTo}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const result = await res.json();
    setAllData(result);
  } catch {
    alert("Error fetching stats");
  }
  setLoading(false);
};
const downloadExcel = () => {
  const currentData = mode === "user" ? userData : allData;
if (currentData.length === 0) {
  return alert("No data to export");
}
  let excelData = [];
  if (mode === "user") {
  excelData = userData.map((d) => ({
      Date: new Date(d.date).toLocaleDateString("en-GB"),
      Status: `${d.status} (M:${d.morning ? "1":"0"} A:${d.afternoon ? "1":"0"} N:${d.night ? "1":"0"})`,
    }));
    if (userSummary) {
      excelData.push({});
      excelData.push({
        Date: "Summary",
        Status: "",
      });
      excelData.push({
        Date: "Present",
        Status: userSummary.present,
      });
      excelData.push({
        Date: "Absent",
        Status: userSummary.absent,
      });
      excelData.push({
        Date: "Not Recorded",
        Status: userSummary.notRecorded,
      });
      excelData.push({
  Date: "Morning",
  Status: userSummary.morning,
});
excelData.push({
  Date: "Afternoon",
  Status: userSummary.afternoon,
});
excelData.push({
  Date: "Night",
  Status: userSummary.night,
});
    }
  } else {
  excelData = allData.map((u) => ({
  Name: u.name,
  Morning: u.morning,
  Afternoon: u.afternoon,
  Night: u.night,
  Present: u.present, 
  Absent: u.absent,
  "Not Marked": u.notMarked,
}));
}
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const file = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  const fileName = mode === "user"
  ? `attendance_${userFrom}_to_${userTo}.xlsx`
  : `attendance_${allFrom}_to_${allTo}.xlsx`;
  saveAs(file, fileName);
};
  const handleSearch = () => {
  if (mode === "user") {
    if (!userFrom || !userTo) return alert("Select date range");
    if (!value) return alert("Enter search value");
    fetchUserAttendance();
  } else {
    if (!allFrom || !allTo) return alert("Select date range");
    fetchAllStats();
  }
};
  const deleteAllAttendance = async () => {
    if (!allFrom || !allTo) return alert("Select date range");
    if (!window.confirm("⚠️ Delete ALL attendance within this date?")) return;
    await fetch(`${API}/api/attendance/all`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ from: allFrom, to: allTo }),
    });
    alert("Deleted all");
  };
  return (
    <>
      <style>{`
        .app-container { padding: 10px; }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .header h2 {
          font-size: 24px;
          color: #1e293b;
        }
        .toggle {
          display: flex;
          gap: 10px;
        }
        .toggle button {
          padding: 8px 14px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          background: #e2e8f0;
        }
        .active {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
        }
        .search-box {
          padding: 10px 15px;
          border-radius: 25px;
          border: 1px solid #cbd5e1;
          outline: none;
          width: 100%;
          min-width: 0;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        .card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          border: 1px solid rgba(255,255,255,0.4);
          transition: 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .badge-green {
          color: #16a34a;
          font-weight: 600;
        }
        .badge-red {
          color: #dc2626;
          font-weight: 600;
        }
        .summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 20px;
}
        .summary div {
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  word-wrap: break-word;
}
        .green { background: #dcfce7; }
        .red { background: #fee2e2; }
        .yellow { background: #fef9c3; }
        .btn {
          padding: 10px 15px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
        }
        .delete-btn {
          padding: 10px 15px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          cursor: pointer;
          font-weight: 500;
        }
        .delete-btn:hover {
          opacity: 0.85;
        }
        .empty {
          text-align: center;
          padding: 40px;
          color: #64748b;
        }
      `}</style>
      <div className="app-container">
        <div className="header">
          <h2>Attendance</h2>
          <div className="toggle">
            <button
              className={mode === "user" ? "active" : ""}
              onClick={() => setMode("user")}
            >
              User
            </button>
            <button
              className={mode === "all" ? "active" : ""}
              onClick={() => setMode("all")}
            >
              All
            </button>
          </div>
        </div>
       <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
  {mode === "user" && (
    <>
      <select
        className="search-box"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      >
        <option value="email">Email</option>
        <option value="phone">Phone</option>
        <option value="firstName">First Name</option>
        <option value="lastName">Last Name</option>
        <option value="fullName">Full Name</option>
      </select>
      <input
        type="text"
        placeholder={
  searchKey === "fullName"
    ? "Enter full name (e.g. John Doe)"
    : `Enter ${searchKey}`
}
        className="search-box"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  )}
  {mode === "user" ? (
    <>
      <input
        type="date"
        className="search-box"
        value={userFrom}
        onChange={(e) => setUserFrom(e.target.value)}
      />
      <input
        type="date"
        className="search-box"
        value={userTo}
        onChange={(e) => setUserTo(e.target.value)}
      />
    </>
  ) : (
    <>
      <input
        type="date"
        className="search-box"
        value={allFrom}
        onChange={(e) => setAllFrom(e.target.value)}
      />
      <input
        type="date"
        className="search-box"
        value={allTo}
        onChange={(e) => setAllTo(e.target.value)}
      />
    </>
  )}
</div>
       <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
  <button className="btn" onClick={handleSearch}>
    🔍 Search
  </button>
  <button className="btn" onClick={downloadExcel}>
    ⬇️ Download Excel
  </button>
  {mode === "all" && (
    <button className="delete-btn" onClick={deleteAllAttendance}>
      ⚠️ Delete All
    </button>
  )}
</div>
        {loading ? (
          <div className="empty">Loading...</div>
        ) : (mode === "user" ? userData : allData).length === 0 ? (
          <div className="empty">No data found</div>
        ) : (
          <div
  style={{
    maxHeight: "400px",
    overflowY: "auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px"
  }}
>
  {mode === "user" && userData.map((d, i) => {
      const formattedDate = new Date(d.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      return (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "1px solid #eee"
          }}
        >
          <span>{formattedDate}</span>
         <div style={{ display: "flex", gap: "10px", fontSize: "13px" }}>
  {d.status === "present" && (
    <>
      {d.morning && <span>Mor: ✔️</span>}
      {d.afternoon && <span>Aft: ✔️</span>}
      {d.night && <span>Nyt: ✔️</span>}
    </>
  )}
  {d.status === "absent" && (
    <span style={{ color: "#dc2626", fontWeight: "600" }}>
      Absent
    </span>
  )}
  {d.status === "not_marked" && (
    <span style={{ color: "#eab308", fontWeight: "600" }}>
      Not Marked
    </span>
  )}
</div>
        </div>
      );
    })}
{mode === "all" && allData.map((u, i) => (
    <div
      key={i}
      style={{
        padding: "10px 0",
        borderBottom: "1px solid #eee"
      }}
    >
      <b>{u.name}</b>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "5px" }}>
        <span>Mor: {u.morning}</span>
<span>Aft: {u.afternoon}</span>
<span>Nyt: {u.night}</span>
<span style={{ color: "green" }}>Pre: {u.present}</span> 
<span style={{ color: "red" }}>Abs: {u.absent}</span>
<span style={{ color: "orange" }}>Not Marked: {u.notMarked}</span>
      </div>
    </div>
  ))}
</div>
        )}
        {mode === "user" && userSummary &&  (
  <div className="summary">
  <div className="green">Present: {userSummary.present}</div>
  <div className="red">Absent: {userSummary.absent}</div>
  <div className="yellow">Not Recorded: {userSummary.notRecorded}</div>
  <div className="green">Morning: {userSummary.morning}</div>
  <div className="green">Afternoon: {userSummary.afternoon}</div>
  <div className="green">Night: {userSummary.night}</div>
</div>
)}
      </div>
    </>
  );
}