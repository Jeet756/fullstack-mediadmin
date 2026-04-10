import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
const [searchKey, setSearchKey] = useState("name");
  const token = localStorage.getItem("token");
  const API = "https://fullstack-mediadmin.onrender.com";
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [dateType, setDateType] = useState("appointmentDate");
const downloadExcel = () => {
  if (filtered.length === 0) {
    return alert("No data to export");
  }

  const formattedData = filtered.map((a) => ({
    Name: a.name,
    Email: a.email,
    Phone: a.phone,
    Age: a.age,
    Gender: a.gender,
    Symptoms: a.symptoms,
    "Appointment Date": formatDate(a.appointmentDate),
    "Created Date": formatDate(a.createdAt),
    Priority: a.doctorPriority,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(fileData, `appointments_${Date.now()}.xlsx`);
};
const deleteAllAppointments = async () => {
  if (!fromDate || !toDate) {
    return alert("Select from and to date first");
  }

  const confirmDelete = window.confirm(
    "Are you sure you want to delete ALL appointments in this date range?"
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API}/api/appointments`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        from: fromDate,
        to: toDate,
        type: dateType,
      }),
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message);

    alert(`${data.count} appointments deleted`);

    fetchAppointments(); // refresh

  } catch {
    alert("Delete failed");
  }
};
const fetchAppointments = async () => {
  setLoading(true);

  try {
    let url = `${API}/api/appointments`;

    if (fromDate && toDate) {
      url += `?from=${fromDate}&to=${toDate}&type=${dateType}`;
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message);

    setAppointments(data);
    setFiltered(data);

  } catch {
    alert("Failed to load appointments");
  } finally {
    setLoading(false);
  }
};
// ======= FETCH_WITH_FILTER_END =======

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    const res = await fetch(`${API}/api/appointments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setFiltered((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
  const q = search.toLowerCase();

  setFiltered(
    appointments.filter((a) => {

      // 👉 date special handling
      if (searchKey === "appointmentDate") {
        return formatDate(a.appointmentDate)
          .toLowerCase()
          .includes(q);
      }

      const value = a[searchKey];
      if (!value) return false;

      return value.toString().toLowerCase().includes(q);
    })
  );
}, [search, searchKey, appointments]);

  const formatDate = (date) => {
  if (!date) return "N/A";

  const d = new Date(date); // 👈 FIXED

  if (isNaN(d.getTime())) return "Invalid";

  return d.toLocaleDateString("en-IN");
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

          width: 100%;
          min-width: 0;
          box-sizing: border-box;
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
          overflow-wrap: anywhere;
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

          .search-box {
            width: 100%;
          }
        }
      `}</style>

      <div className="app-container">
        <div className="app-header">
          <h2>Appointments</h2>
          <div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    width: "100%",
  }}
>
<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
  
  <select
    value={dateType}
    onChange={(e) => setDateType(e.target.value)}
    className="search-box"
  >
    <option value="appointmentDate">Appointment Date</option>
    <option value="createdAt">Created Date</option>
  </select>

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
    onClick={fetchAppointments}
    className="delete-btn"
    style={{ background: "#2563eb" }}
  >
    Apply Filter
  </button>
<button
  onClick={() => {
    setFromDate("");
    setToDate("");
    fetchAppointments();
  }}
  className="delete-btn"
  style={{ background: "gray" }}
>
  Reset
</button>
<button
  onClick={deleteAllAppointments}
  className="delete-btn"
  style={{ background: "#b91c1c" }}
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
</div>
  <select
    value={searchKey}
    onChange={(e) => {
      setSearchKey(e.target.value);
      setSearch("");
    }}
    className="search-box"
  >
    <option value="name">Name</option>
    <option value="email">Email</option>
    <option value="phone">Phone</option>
    <option value="age">Age</option>
    <option value="gender">Gender</option>
    <option value="symptoms">Symptoms</option>
    <option value="doctorPriority">Priority</option>
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
          <div className="empty">Loading appointments...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No appointments found</div>
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
      {filtered.map((a) => (
        <div key={a.id} className="card">
  <div>
    <div className="name">{a.name}</div>

    <div className="info"><b>Email:</b> {a.email}</div>
    <div className="info"><b>Phone:</b> {a.phone}</div>
    <div className="info"><b>Age:</b> {a.age}</div>
    <div className="info"><b>Gender:</b> {a.gender}</div>
    <div className="info"><b>Symptoms:</b> {a.symptoms}</div>
    <div className="info"><b>Date:</b> {formatDate(a.appointmentDate)}</div>
    <div className="info"><b>Created:</b> {formatDate(a.createdAt)}</div>
    <div className="badge">{a.doctorPriority}</div>
  </div>

  <button
    className="delete-btn"
    onClick={() => deleteAppointment(a.id)}
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

export default Appointments;