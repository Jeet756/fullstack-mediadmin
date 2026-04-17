import { useEffect, useState } from "react";
export default function ContributorsAdmin() {
  const API = "https://fullstack-mediadmin.onrender.com";
  const token = localStorage.getItem("token");
const [preview, setPreview] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const fetchData = async () => {
    try {
      setFetchLoading(true);
      const res = await fetch(`${API}/api/contributors`);
      const data = await res.json();
      setContributors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };
  useEffect(() => {
  fetchData();
}, []);
useEffect(() => {
  return () => {
    if (preview) URL.revokeObjectURL(preview);
  };
}, [preview]);
  const handleAdd = async () => {
    if (!name) return alert("Name required");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);
      await fetch(`${API}/api/contributors`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      setName("");
setImage(null);
setPreview(null); 
fetchData();
    } catch (err) {
      alert("Error adding contributor");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      setDeleteLoadingId(id);
      await fetch(`${API}/api/contributors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchData();
    } catch {
      alert("Delete failed");
    } finally {
      setDeleteLoadingId(null);
    }
  };
  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  };
  const primaryBtn = {
    background: "#2563eb",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px"
  };
  const deleteBtn = {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  };
  return (
    <div style={{ padding: "20px", background: "#f5f7fb", minHeight: "100vh" }}>
      <h2 style={{
        marginBottom: "20px",
        wordBreak: "break-word",
        fontSize: "clamp(16px, 5vw, 24px)"
      }}>
        Contributors Management
      </h2>
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}
      >
        <h3>Add Contributor</h3>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <label style={{
          display: "block",
          width: "100%",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          cursor: "pointer",
          textAlign: "center",
          background: "#fafafa",
          marginTop: "10px"
        }}>
          {image ? image.name : "Choose Image"}
          <input
            type="file"
            onChange={(e) => {
  const file = e.target.files[0];
  setImage(file);
  if (file) {
    setPreview(URL.createObjectURL(file));
  }
  e.target.value = null;
}}
            style={{ display: "none" }}
          />
        </label>
        {preview && (
  <img
    src={preview}
    alt="preview"
    width="80"
    style={{ marginTop: "10px", borderRadius: "6px" }}
  />
)}
        <button onClick={handleAdd} style={primaryBtn} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
      {fetchLoading ? (
        <p style={{ textAlign: "center", color: "#777" }}>
          Loading contributors...
        </p>
      ) : contributors.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>
          No contributors found
        </p>
      ) : (
        contributors.map((c) => (
  <div
    key={c.id}
    style={{
      background: "#fff",
      padding: "15px",
      marginBottom: "15px",
      borderRadius: "10px",
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}
  >
    <img
  src={c.image_url || "https://via.placeholder.com/80"}
  onError={(e) => (e.target.src = "https://via.placeholder.com/80")}
  width="80"
  style={{ borderRadius: "8px", flexShrink: 0 }}
/>
    <div style={{ flex: "1" }}>
      <h4 style={{ margin: 0 }}>{c.name}</h4>
    </div>
    <button
      onClick={() => {
        if (window.confirm("Delete this contributor?")) {
          handleDelete(c.id);
        }
      }}
      style={deleteBtn}
      disabled={deleteLoadingId === c.id}
    >
      {deleteLoadingId === c.id ? "Deleting..." : "Delete"}
    </button>
  </div>
))
      )}
    </div>
  );
}