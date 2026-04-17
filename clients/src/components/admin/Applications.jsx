import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
function Applications() {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchKey, setSearchKey] = useState("firstName");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
  const getToken = () => localStorage.getItem("token");
  const API = "https://fullstack-mediadmin.onrender.com";
  const navigate = useNavigate();
const handleUnauthorized = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.dispatchEvent(new Event("authChanged"));
  alert("Session expired, login again");
  navigate("/login");
};
  const deleteApplication = async (id) => {
  if (!window.confirm("Delete this application?")) return;
  try {
    const res = await fetch(`${API}/api/applications/${id}`, {
      method: "DELETE",
      headers: { 
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}` 
},
    });
if (res.status === 401) return handleUnauthorized();
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Delete failed");
      return;
    }
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setFiltered((prev) => prev.filter((a) => a.id !== id));
  } catch (err) {
    console.error(err);
    alert("Server unreachable / Network issue ⚠️");
  }
};
const deleteAllApplications = async () => {
  if (!fromDate && !toDate) {
  return alert("Select at least one date");
}
  if (!window.confirm("Delete ALL applications in selected date range?"))
    return;
  try {
    const res = await fetch(`${API}/api/applications/delete-range`, {
      method: "DELETE",
      headers: { 
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        from: fromDate,
        to: toDate,
      }),
    });
if (res.status === 401) return handleUnauthorized();
    const data = await res.json();
    if (!res.ok) return alert(data.message);
    alert("Deleted successfully");
    fetchApplications(); 
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};
const downloadExcel = () => {
  if (filtered.length === 0) {
    return alert("No data to export");
  }
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "DOB",
    "Address",
    "Qualification",
    "Experience",
    "Position",
    "Applied On",
  ];
  const rows = filtered.map((a) => [
    a.firstName,
    a.lastName,
    a.email,
    a.phone,
    formatDate(a.dob),
    a.address,
    a.qualification,
    a.experience,
    a.position,
    formatDate(a.createdAt),
  ]);
  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows]
      .map((e) => e.map((v) => `"${v}"`).join(","))
      .join("\n");
  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "applications.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  const fetchApplications = useCallback(async () => {
  setLoading(true);
  try {
    let url = `${API}/api/applications`;
    if (fromDate || toDate) {
      url += `?from=${fromDate}&to=${toDate}`;
    }
    const res = await fetch(url, {
      headers: { 
  Authorization: `Bearer ${getToken()}` 
},
    });
    if (res.status === 401) return handleUnauthorized();
    const data = await res.json();
    if (!res.ok) return alert(data.message);
    setApplications(data);
    setFiltered(data);
  } catch (err) {
    console.error(err);
    alert("Failed to load applications");
  } finally {
    setLoading(false);
  }
}, [fromDate, toDate]);
useEffect(() => {
  fetchApplications();
}, [fetchApplications]);
  useEffect(() => {
  const q = search.toLowerCase();
  setFiltered(
    applications.filter((a) => {
      if (searchKey === "dob") {
        return formatDate(a.dob).toLowerCase().includes(q);
      }
      const value = a?.[searchKey];
      if (value === undefined || value === null) return false;
      return value.toString().toLowerCase().includes(q);
    })
  );
}, [search, searchKey, applications]);
  const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};
  return (
    <>
      <style>{`
        .app-container {
          padding: 10px;
        }
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .app-header h2 {
          font-size: 24px;
          color: #1e293b;
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
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        .name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #0f172a;
        }
        .info {
          font-size: 14px;
          color: #475569;
          margin-bottom: 6px;
          word-break: break-word;
        }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          background: #e0f2fe;
          color: #0369a1;
          font-size: 12px;
          margin-top: 5px;
        }
        .delete-btn {
          margin-top: 15px;
          padding: 10px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          cursor: pointer;
          font-weight: 500;
          transition: 0.2s;
        }
        .delete-btn:hover {
          opacity: 0.85;
        }
        .empty {
          text-align: center;
          padding: 40px;
          color: #64748b;
        }
        @media (max-width: 500px) {
          .app-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
@media (max-width: 300px) {
  .app-header > div {
    flex-direction: column;
    width: 100%;
  }
  .search-box {
    width: 80%;
  }
}
        @media (max-width: 350px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .card {
            padding: 14px;
          }
          .name {
            font-size: 16px;
          }
          .info {
            font-size: 13px;
          }
        }
      `}</style>
      <div className="app-container">
        <div className="app-header">
          <h2>Applications</h2>
          <div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    width: "100%"
  }}
>
<input
  type="date"
  value={fromDate}
  onChange={(e) => setFromDate(e.target.value)}
  className="search-box"
/>
<input
  type="date"
  value={toDate}
  onChange={(e) => setToDate(e.target.value)}
  className="search-box"
/>
<button
  onClick={fetchApplications}
  className="delete-btn"
  style={{ background: "#2563eb" }}
>
  Apply Filter
</button>
<button
  onClick={() => {
    setFromDate("");
    setToDate("");
    fetchApplications();
  }}
  className="delete-btn"
  style={{ background: "gray" }}
>
  Reset
</button>
<button
  onClick={deleteAllApplications}
  className="delete-btn"
>
  Delete All
</button>
<button
  onClick={downloadExcel}
  className="delete-btn"
  style={{ background: "#16a34a" }}
>
  Download Excel
</button>
            <select
              value={searchKey}
              onChange={(e) => {
                setSearchKey(e.target.value);
                setSearch("");
              }}
              className="search-box"
            >
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="qualification">Qualification</option>
              <option value="experience">Experience</option>
              <option value="position">Position</option>
            </select>
            <input
              type="text"
              placeholder={`Search ${searchKey}`}
              className="search-box"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <div className="empty">Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No applications found</div>
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
    <div className="grid">
      {filtered.map((app) => (
        <div key={app.id} className="card">
  <div>
    <div className="name">
      {app.firstName} {app.lastName}
    </div>
    <div className="info"><b>Email:</b> {app.email}</div>
    <div className="info"><b>Phone:</b> {app.phone}</div>
    <div className="info"><b>DOB:</b> {formatDate(app.dob)}</div>
    <div className="info"><b>Address:</b> {app.address}</div>
    <div className="info"><b>Qualification:</b> {app.qualification}</div>
    <div className="info"><b>Experience:</b> {app.experience} yrs</div>
    <div className="info"><b>Applied On:</b> {formatDate(app.createdAt)}</div>
    <div className="badge">{app.position}</div>
  </div>
  <button
    className="delete-btn"
    onClick={() => deleteApplication(app.id)}
  >
    Delete
  </button>
</div>
      ))}
    </div>
  </div>
)}
      </div>
    </>
  );
}
export default Applications;