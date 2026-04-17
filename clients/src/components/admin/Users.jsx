import { useEffect, useState } from "react";
function Users() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
const [searchKey, setSearchKey] = useState("firstName");
  const token = localStorage.getItem("token");
  const API = "https://fullstack-mediadmin.onrender.com";
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      setUsers(data);
      setFiltered(data);
    } catch {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    const res = await fetch(`${API}/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setFiltered((prev) => prev.filter((u) => u.id !== id));
  };
  useEffect(() => {
    fetchUsers();
  }, []);
 useEffect(() => {
  const q = search.toLowerCase();
  setFiltered(
    users.filter((u) => {
      const value = u[searchKey];
      if (!value) return false;
      return value.toString().toLowerCase().includes(q);
    })
  );
}, [search, searchKey, users]);
  return (
    <>
      <style>{`
      * {
  box-sizing: border-box;
}
body {
  overflow-x: hidden;
}
        .user-container {
          padding: 10px;
        }
        .user-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .user-header h2 {
          font-size: 24px;
          color: #1e293b;
        }
.search-box {
  padding: 10px 12px;
  border-radius: 25px;
  border: 1px solid #cbd5e1;
  outline: none;
  width: 100%;
  min-width: 0;
  max-width: 100%;
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
        }
        .delete-btn:hover {
          opacity: 0.85;
        }
        .empty {
          text-align: center;
          padding: 40px;
          color: #64748b;
        }
@media (max-width: 320px) {
  .name {
    font-size: 16px;
  }
}
        @media (max-width: 500px) {
          .user-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
      <div className="user-container">
        <div className="user-header">
          <h2>Users</h2>
          <div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    width: "100%",
    minWidth: 0, 
  }}
>
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
    <option value="role">Role</option>
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
          <div className="empty">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No users found</div>
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
  {filtered.map((u) => (
    <div
      key={u.id}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #eee",
        flexWrap: "wrap",
        gap: "10px"
      }}
    >
      <div>
        <b>{u.firstName} {u.lastName}</b>
        <div style={{ fontSize: "13px", color: "#555" }}>{u.email}</div>
        <div style={{ fontSize: "13px", color: "#555" }}>{u.phone}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontSize: "12px",
            background: "#e0f2fe",
            padding: "4px 10px",
            borderRadius: "20px",
            display: "inline-block",
            marginBottom: "5px"
          }}
        >
          {u.role}
        </div>
        <br />
        <button
          onClick={() => deleteUser(u.id)}
          style={{
            padding: "6px 10px",
            border: "none",
            borderRadius: "6px",
            background: "#ef4444",
            color: "white",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>
        )}
      </div>
    </>
  );
}
export default Users;