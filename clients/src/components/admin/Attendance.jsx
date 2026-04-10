import { useEffect, useState } from "react";

function Attendance() {
  const [staffUsers, setStaffUsers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceDate, setAttendanceDate] = useState("");
  const [isRecorded, setIsRecorded] = useState(false);
  const token = localStorage.getItem("token");
  const API = "https://fullstack-mediadmin.onrender.com";
  const [search, setSearch] = useState("");
const [searchKey, setSearchKey] = useState("firstName");
const [filteredUsers, setFilteredUsers] = useState([]);
const [loading, setLoading] = useState(false);
  // 🔥 FETCH STAFF
 const fetchStaffUsers = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API}/api/staff-users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setStaffUsers(data);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  // 🔥 FETCH ATTENDANCE BY DATE
  const fetchAttendanceByDate = async (date) => {
  if (!date) return;

  try {
    setLoading(true);

    const res = await fetch(`${API}/api/attendance/${date}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    let updated = {};

staffUsers.forEach(u => {
  updated[u.id] = attendance[u.id] || {
    morning: false,
    afternoon: false,
    night: false,
    status: "not_marked"
  };
});

    if (Array.isArray(data) && data.length > 0) {
      setIsRecorded(true);
    } else {
      setIsRecorded(false);
      setAttendance(updated);
      return;
    }

    data.forEach(r => {
  updated[r.user_id] = {
    morning: r.morning || false,
    afternoon: r.afternoon || false,
    night: r.night || false,
    status: r.status || "not_marked"
  };
});

    setAttendance(updated);

  } catch (err) {
    console.error(err);
    alert("Failed to load attendance");
  } finally {
    setLoading(false);
  }
};

  // 🔥 SAVE
  const saveAttendance = async () => {
    if (!attendanceDate) return alert("Select date first");

    const records = staffUsers
  .filter(u => {
  const user = attendance[u.id];
  if (!user) return false;

  // ❌ skip not marked users
  if (
    !user.morning &&
    !user.afternoon &&
    !user.night &&
    user.status !== "absent"
  ) {
    return false;
  }

  return true;
})
  .map(u => {
    const user = attendance[u.id];

    let status = user.status;

    if (!status) {
  if (user.morning || user.afternoon || user.night) {
    status = "present";
  } else {
    status = "not_marked";
  }
}

    return {
      user_id: u.id,
      morning: user.morning || false,
      afternoon: user.afternoon || false,
      night: user.night || false,
      status
    };
  });
if (records.length === 0) {
    return alert("At least one attendance mark karo");
  }
    const res = await fetch(`${API}/api/attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ date: attendanceDate, records })
    });

    const data = await res.json();
    alert(data.message);
    setIsRecorded(true);
  };

  useEffect(() => {
    fetchStaffUsers();
  }, []);
  useEffect(() => {
  const q = search.toLowerCase();

  setFilteredUsers(
    staffUsers.filter((u) => {

      // 👇 full name support
      if (searchKey === "fullName") {
        return `${u.firstName} ${u.lastName}`
          .toLowerCase()
          .includes(q);
      }

      const value = u[searchKey];
      if (!value) return false;

      return value.toString().toLowerCase().includes(q);
    })
  );
}, [search, searchKey, staffUsers]);


  // 🔥 RUN WHEN DATE OR USERS CHANGE
  useEffect(() => {
    if (staffUsers.length > 0 && attendanceDate) {
      fetchAttendanceByDate(attendanceDate);
    }
  }, [attendanceDate, staffUsers]);

  return (
    <>
      <h2>Attendance</h2>

      <input
  type="date"
  value={attendanceDate}
  onChange={(e) => {
    setAttendanceDate(e.target.value);
    setAttendance({});
    setIsRecorded(false);
  }}
/>
{loading && (
  <p style={{ color: "blue", fontWeight: "bold" }}>
    🔄 Loading attendance...
  </p>
)}
{attendanceDate && (
  <div
    style={{
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginTop: "10px"
    }}
  >

    
    <select
      value={searchKey}
      onChange={(e) => {
        setSearchKey(e.target.value);
        setSearch("");
      }}
      style={{
        padding: "8px",
        borderRadius: "20px",
        border: "1px solid #ccc"
      }}
    >
      <option value="firstName">First Name</option>
      <option value="lastName">Last Name</option>
      <option value="fullName">Full Name</option>
      <option value="email">Email</option>
      <option value="phone">Phone</option>
    </select>

    <input
      type="text"
      placeholder={`Search ${searchKey}`}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        padding: "8px 12px",
        borderRadius: "20px",
        border: "1px solid #ccc",
        flex: 1,
        minWidth: "150px"
      }}
    />
  </div>
)}
{/* 👇 YE ADD KARNA HAI */}
{attendanceDate && (
  <p style={{ marginTop: "5px", fontWeight: "bold" }}>
    {isRecorded ? "✅ Attendance Recorded" : "❌ Not Recorded"}
  </p>
)}
      {/* 🔥 SCROLLABLE CONTAINER */}
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          marginTop: "10px",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px"
        }}
      >
        {filteredUsers.map(u => (
          <div
            key={u.id}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "10px 0"
            }}
          >
            <b>{u.firstName} {u.lastName}</b>
            <div style={{ fontSize: "12px", color: "gray" }}>
  {u.email} | {u.phone}
</div>
            <div>
  {/* MORNING */}
  <label>
    <input
      type="checkbox"
      checked={attendance[u.id]?.morning || false}
      onChange={() => {
  setAttendance(prev => {
    const user = prev[u.id] || {};

    const selectedCount =
      (user.morning ? 1 : 0) +
      (user.afternoon ? 1 : 0) +
      (user.night ? 1 : 0);

    // ❌ last selected hai → uncheck mat hone de
    if (user.morning && selectedCount === 1) return prev;

    return {
      ...prev,
      [u.id]: {
        ...user,
        morning: !user.morning,
        status: "present"
      }
    };
  });
}}
    />
    Morning
  </label>

  {/* AFTERNOON */}
  <label style={{ marginLeft: "10px" }}>
    <input
      type="checkbox"
      checked={attendance[u.id]?.afternoon || false}
      onChange={() => {
  setAttendance(prev => {
    const user = prev[u.id] || {};

    const selectedCount =
      (user.morning ? 1 : 0) +
      (user.afternoon ? 1 : 0) +
      (user.night ? 1 : 0);

    if (user.afternoon && selectedCount === 1) return prev;

    return {
      ...prev,
      [u.id]: {
        ...user,
        afternoon: !user.afternoon,
        status: "present"
      }
    };
  });
}}
    />
    Afternoon
  </label>

  {/* NIGHT */}
  <label style={{ marginLeft: "10px" }}>
    <input
      type="checkbox"
      checked={attendance[u.id]?.night || false}
      onChange={() => {
  setAttendance(prev => {
    const user = prev[u.id] || {};

    const selectedCount =
      (user.morning ? 1 : 0) +
      (user.afternoon ? 1 : 0) +
      (user.night ? 1 : 0);

    if (user.night && selectedCount === 1) return prev;

    return {
      ...prev,
      [u.id]: {
        ...user,
        night: !user.night,
        status: "present"
      }
    };
  });
}}
    />
    Night
  </label>

  {/* ABSENT */}
  <label style={{ marginLeft: "10px" }}>
    <input
      type="checkbox"
      checked={attendance[u.id]?.status === "absent"}
      onChange={() => {
        setAttendance(prev => ({
          ...prev,
          [u.id]: {
            morning: false,
            afternoon: false,
            night: false,
            status: "absent"
          }
        }));
      }}
    />
    Absent
  </label>

  {/* NOT MARKED */}
  <label style={{ marginLeft: "10px" }}>
    <input
      type="checkbox"
      checked={attendance[u.id]?.status === "not_marked"}
      onChange={() => {
        setAttendance(prev => ({
          ...prev,
          [u.id]: {
            morning: false,
            afternoon: false,
            night: false,
            status: "not_marked"
          }
        }));
      }}
    />
    Not Marked
  </label>
</div>
          </div>
        ))}
      </div>

      <button
  style={{ marginTop: "10px" }}
  onClick={saveAttendance}
  disabled={loading}
>
  {loading
    ? "Loading..."
    : isRecorded
    ? "Update Attendance"
    : "Save Attendance"}
</button>
    </>
  );
}

export default Attendance;