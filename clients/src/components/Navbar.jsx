import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      if (window.innerWidth > 900) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width <= 900;

  const goToDashboard = () => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (!token) return navigate("/login");

    if (savedRole === "admin") navigate("/admin");
    else if (savedRole === "staff") navigate("/staff");
    else if (savedRole === "patient") navigate("/patient");
    else navigate("/login");
  };

const brandName =
  width <= 260
    ? "SG Hospital"
    : "Shri Gurupad Hospital";
  return (
    <nav style={styles.navbar}>
      <div
        style={{
          ...styles.container,
          padding:
            width <= 250
              ? "10px 8px"
              : width <= 400
              ? "12px 15px"
              : "15px 20px",
        }}
      >
        <Link to="/" style={styles.brand}>
          <img
            src="/hosplogo.png"
            alt="Logo"
            style={{
              width: width <= 250 ? "28px" : width <= 400 ? "35px" : "45px",
              marginRight: "8px",
              flexShrink: 0,
            }}
          />

          <span
            style={{
              fontWeight: "bold",
              color: "#0d6efd",
              fontSize:
                width <= 200
                  ? "11px"
                  : width <= 300
                  ? "13px"
                  : width <= 400
                  ? "15px"
                  : "20px",
              whiteSpace: "nowrap",
            }}
          >
            {brandName}
          </span>
        </Link>

        <ul
          style={{
            ...styles.navLinks,
            ...(isMobile && {
              display: isOpen ? "flex" : "none",
              flexDirection: "column",
              position: "absolute",
              top: "60px",
              left: 0,
              width: "100%",
              background: "#fff",
              padding: "15px 0",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }),
          }}
        >
          <li><Link to="/" style={styles.link}>Home</Link></li>
          <li><Link to="/about" style={styles.link}>About</Link></li>
          <li><Link to="/contact" style={styles.link}>Contact</Link></li>
          <li><Link to="/doctors" style={styles.link}>Staff</Link></li>
          <li><Link to="/join" style={styles.link}>Join</Link></li>

          <li>
            {role ? (
              <button onClick={goToDashboard} style={styles.loginBtn}>
                Dashboard
              </button>
            ) : (
              <Link to="/login" style={styles.loginBtn}>
                Login
              </Link>
            )}
          </li>
        </ul>

        {isMobile && (
          <div style={styles.menuIcon} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    width: "100%",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(12px)",
    zIndex: 1000,
  },
  container: {
    maxWidth: "1200px",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "#333",
  },
  loginBtn: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "2px solid #0d6efd",
    background: "transparent",
    color: "#0d6efd",
    cursor: "pointer",
  },
  menuIcon: {
    fontSize: "22px",
    cursor: "pointer",
    marginLeft: "10px",
  },
};

export default Navbar;