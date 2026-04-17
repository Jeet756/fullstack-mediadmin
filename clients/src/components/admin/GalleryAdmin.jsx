import { useEffect, useState } from "react";
const API = "https://fullstack-mediadmin.onrender.com";
function GalleryAdmin() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const fetchImages = async () => {
  try {
    const res = await fetch(`${API}/api/gallery`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.status === 401 || res.status === 403) {
      alert("Session expired, login again");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    setImages(data);
  } catch (err) {
    console.error(err);
    alert("Failed to load images");
  }
};
  useEffect(() => {
    fetchImages();
  }, []);
  const handleUpload = async () => {
    if (!file) return alert("Select image");
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);
    const res = await fetch(`${API}/api/gallery`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`
  },
  body: formData
});
if (res.status === 401 || res.status === 403) {
  alert("Session expired, login again");
  localStorage.removeItem("token");
  window.location.href = "/login";
  return;
}
    const data = await res.json();
    alert(data.message);
    setLoading(false);
    setFile(null);
    setCaption("");
    await fetchImages();
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    const res = await fetch(`${API}/api/gallery/${id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`
  }
});
if (res.status === 401 || res.status === 403) {
  alert("Session expired, login again");
  localStorage.removeItem("token");
  window.location.href = "/login";
  return;
}
    const data = await res.json();
    alert(data.message);
    fetchImages();
  };
  return (
    <div className="admin-container">
      <h2 className="title">Gallery Manager</h2>
      <div className="upload-box">
        <input
          type="file" accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Enter caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <div className="grid">
        {images.map((img) => (
          <div className="card" key={img.id}>
            {img.type === "video" ? (
  <video src={img.media_url} controls />
) : (
  <img src={img.media_url} alt={img.caption} />
)}
            <div className="card-body">
              <p>{img.caption || "No caption"}</p>
              <button onClick={() => handleDelete(img.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .admin-container {
  padding: clamp(8px, 3vw, 20px);  /* 🔥 smart responsive padding */
  font-family: sans-serif;
  background: #f5f7fb;
  min-height: 100vh;
  overflow-x: hidden;
}
        .title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .upload-box {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 15px;
          border-radius: 16px;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          margin-bottom: 25px;
        }
        .upload-box input[type="file"],
.upload-box input[type="text"] {
  flex: 1 1 100%;
  min-width: 0;   /* 🔥 important fix */
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
}
        .upload-box button {
  flex: 1 1 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: 0.3s;
}
        .upload-box button:hover {
          transform: translateY(-2px);
        }
        .grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}
        .card {
          border-radius: 16px;
          overflow: hidden;
          background: white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          transition: 0.3s;
        }
        .card:hover {
          transform: translateY(-5px);
        }
.card video {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
        .card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        .card-body {
          padding: 10px;
        }
        .card-body p {
          font-size: 14px;
          margin-bottom: 8px;
        }
        .card-body button {
          width: 100%;
          padding: 8px;
          border: none;
          border-radius: 8px;
          background: #ff4d4f;
          color: white;
          cursor: pointer;
          font-size: 13px;
        }
          @media (max-width: 250px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 6px;   /* 🔥 reduce spacing */
  }
}
@media (max-width: 230px) {
  .upload-box {
    flex-direction: column;
  }
  .upload-box input,
  .upload-box button {
    width: 100%;
  }
}
        /* 🔥 180px responsive fix */
        @media (max-width: 200px) {
          .title {
            font-size: 18px;
          }
          .upload-box {
            flex-direction: column;
          }
          .card img {
            height: 120px;
          }
        }
      `}</style>
    </div>
  );
}
export default GalleryAdmin;