import { useState } from "react";

function Posters() {
  const [preview, setPreview] = useState({});
  const [uploading, setUploading] = useState({});
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const token = localStorage.getItem("token");
  const API = "https://fullstack-mediadmin.onrender.com";

  const handleFileChange = (index, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(prev => ({ ...prev, [index]: { file, url } }));
  };

  const uploadPoster = async (index) => {
    if (!preview[index]) return;
    const formData = new FormData();
    formData.append("poster", preview[index].file);

    setUploading(prev => ({ ...prev, [index]: true }));

    try {
      const res = await fetch(`${API}/api/upload-poster/${index}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      alert(data.message);
      setRefreshKey(Date.now());
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <>
      <h2>Posters</h2>

      <div className="poster-grid">
        {[1, 2, 3].map((num) => (
          <div key={num} className="poster-card">
            <p className="label"><b>Current Poster:</b></p>
            <img
              src={`https://res.cloudinary.com/dtazvhqre/image/upload/posters/poster${num}?v=${refreshKey}`}
              alt={`Poster ${num}`}
              className="poster-img"
            />

            <input
              type="file"
              className="file-input"
              onChange={(e) => handleFileChange(num, e.target.files[0])}
            />

            {preview[num] && (
              <>
                <p className="label"><b>Preview:</b></p>
                <img
                  src={preview[num].url}
                  alt="Preview"
                  className="poster-preview"
                />
                <button
                  className="upload-btn"
                  onClick={() => uploadPoster(num)}
                  disabled={uploading[num]}
                >
                  {uploading[num] ? "Uploading..." : "Upload"}
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <style>{`
      * {
  box-sizing: border-box;
}

body {
  overflow-x: hidden; /* 🔥 prevents right scroll */
}

.poster-card {
  width: 100%;
}
        h2 {
          color: #0f172a;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .poster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 20px;
}

        .poster-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 16px; /* reduced */
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.3s ease;
  width: 100%;
  max-width: 100%;
  overflow: hidden; /* 🔥 KEY FIX */
}

        .poster-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }

        .poster-img,
.poster-preview {
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin-bottom: 10px;
}

        .label {
          align-self: flex-start;
          margin-bottom: 6px;
          color: #334155;
        }

        .file-input {
  margin-bottom: 10px;
  width: 100%;
  max-width: 100%;
}

        .upload-btn {
          padding: 10px 18px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s;
        }

        .upload-btn:hover {
          opacity: 0.85;
        }

        .upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 500px) {
          .poster-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

export default Posters;