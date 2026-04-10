import { useEffect, useState } from "react";

const API = "https://fullstack-mediadmin.onrender.com";

function Gallery() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 NEW
  const [error, setError] = useState(null); // 🔥 NEW

  useEffect(() => {
    fetch(`${API}/api/gallery?sort=newest`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load images");
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>✨ Our Gallery</h2>

      {/* 🔥 LOADING STATE */}
      {loading && (
        <div style={styles.centerBox}>
          <p style={styles.loadingText}>Loading images...</p>
        </div>
      )}

      {/* 🔥 ERROR STATE */}
      {!loading && error && (
        <div style={styles.centerBox}>
          <p style={{ color: "red" }}>{error}</p>
        </div>
      )}

      {/* 🔥 EMPTY STATE */}
      {!loading && !error && images.length === 0 && (
        <div style={styles.centerBox}>
          <p>No images found</p>
        </div>
      )}

      {/* GRID */}
      {!loading && !error && images.length > 0 && (
        <div style={styles.grid}>
          {images.map((img, i) => (
            <div
              key={img.id}
              style={styles.card}
              onClick={() => setSelected(i)}
            >
              <img src={img.image_url} style={styles.image} />

              <div style={styles.overlay}>
                <p style={styles.caption}>{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      {selected !== null && (
        <div style={styles.lightbox}>
          <span style={styles.close} onClick={() => setSelected(null)}>
            ✕
          </span>

          <span
            style={styles.arrowLeft}
            onClick={() =>
              setSelected((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
          >
            ‹
          </span>

          <img
            src={images[selected].image_url}
            style={styles.lightImage}
          />

          <span
            style={styles.arrowRight}
            onClick={() =>
              setSelected((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
              )
            }
          >
            ›
          </span>

          <p style={styles.lightCaption}>
            {images[selected].caption}
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 10px",
    background: "linear-gradient(135deg, #f5f7fa, #e4ecf7)",
    minHeight: "100vh",
    textAlign: "center",
    overflowX: "hidden",
  },

  heading: {
    fontSize: "32px",
    marginBottom: "30px",
    fontWeight: "bold",
    color: "#333",
  },

  centerBox: {
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontSize: "18px",
    color: "#555",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px",
  },

  card: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "15px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
  },

  image: {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    background: "#fff",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
    color: "#fff",
    padding: "15px",
    opacity: 0,
    transition: "0.3s",
  },

  caption: {
    margin: 0,
    fontSize: "14px",
  },

  lightbox: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    zIndex: 9999,
  },

  lightImage: {
    maxWidth: "95%",
    maxHeight: "85%",
    objectFit: "contain",
    borderRadius: "10px",
  },

  close: {
    position: "fixed",
    top: "20px",
    right: "20px",
    fontSize: "28px",
    color: "#fff",
    background: "rgba(0,0,0,0.6)",
    padding: "8px 14px",
    borderRadius: "50%",
    cursor: "pointer",
    zIndex: 10000,
  },

  arrowLeft: {
    position: "absolute",
    left: "30px",
    fontSize: "40px",
    color: "#fff",
    cursor: "pointer",
  },

  arrowRight: {
    position: "absolute",
    right: "30px",
    fontSize: "40px",
    color: "#fff",
    cursor: "pointer",
  },

  lightCaption: {
    color: "#ddd",
    marginTop: "15px",
  },
};

export default Gallery;