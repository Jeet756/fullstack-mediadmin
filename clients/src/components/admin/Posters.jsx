import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
const API = "https://fullstack-mediadmin.onrender.com";
export default function Posters() {
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const fetchData = async () => {
    try {
      setFetchLoading(true);
      const res = await fetch(`${API}/api/posters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Failed to load");
    } finally {
      setFetchLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const upload = async () => {
    if (!file) return toast.error("Select file first");
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("media", file);
      const res = await fetch(`${API}/api/posters`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Uploaded 🚀");
      setFile(null);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      setDeleteLoadingId(id);
      await fetch(`${API}/api/posters/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deleted 🗑️");
      fetchData();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteLoadingId(null);
    }
  };
  return (
    <div style={{ padding: "20px", background: "#f4f7fb", minHeight: "100vh" , overflowX: "hidden" }}>
      <Toaster />
      <h2 style={{ marginBottom: "20px" }}>🎬 Posters Dashboard</h2>
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <label style={{
          display: "block",
          padding: "20px",
          border: "2px dashed #ccc",
          borderRadius: "10px",
          textAlign: "center",
          cursor: "pointer"
        }}>
          {file ? file.name : "Click or Drag file here"}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />
        </label>
        {file && (
          <div style={{ marginTop: "10px" }}>
            {file.type.startsWith("image") ? (
              <img
                src={URL.createObjectURL(file)}
                width="120"
                style={{ borderRadius: "8px" }}
              />
            ) : (
              <video
                src={URL.createObjectURL(file)}
                width="120"
              />
            )}
          </div>
        )}
        <button
          onClick={upload}
          disabled={loading}
          style={{
            marginTop: "15px",
            padding: "10px 15px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
        gap: "20px"
      }}>
        {fetchLoading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No posters found</p>
        ) : (
          items.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                position: "relative"
              }}
            >
              {p.type === "image" ? (
                <img
                  src={p.media_url}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <video
                  src={p.media_url}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover"
                  }}
                  controls
                />
              )}
              <button
                onClick={() => remove(p.id)}
                disabled={deleteLoadingId === p.id}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  cursor: "pointer"
                }}
              >
                {deleteLoadingId === p.id ? "..." : "✕"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}