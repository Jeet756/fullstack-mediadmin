import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [width, setWidth] = useState(window.innerWidth);

  const navigate = useNavigate();
  const navRef = useRef(null);

  /* ---------- update role after login / logout ---------- */

  useEffect(() => {
    const updateRole = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("authChanged", updateRole);

    return () => {
      window.removeEventListener("authChanged", updateRole);
    };
  }, []);

  /* ---------- resize handler ---------- */

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);

      if (window.innerWidth > 900) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* ---------- click outside close ---------- */

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (!navRef.current) return;

      if (!navRef.current.contains(event.target)) {
        setIsOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  const isMobile = width <= 900;

  const goToDashboard = () => {

    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (!token) return navigate("/login");

    if (savedRole === "admin") navigate("/admin");
    else if (savedRole === "staff") navigate("/staff");
    else navigate("/patient");

    setIsOpen(false);
  };
const scrollToFooter = () => {
  const footer = document.getElementById("footer");

  if (footer) {
    footer.scrollIntoView({ behavior: "smooth" });
  }

  setIsOpen(false);
};
  const brandName =
    width <= 260
      ? "SG Hospital"
      : "Shri Gurupad Hospital";

  return (

    <nav style={styles.navbar}>

      <div style={styles.container}>

        <Link to="/" style={styles.brand}>
          <img
            src="/hosplogo.png"
            alt="logo"
            style={{ width: "40px", marginRight: "8px" }}
          />
          <span style={styles.title}>{brandName}</span>
        </Link>

        <ul
          ref={navRef}
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
          <li>
            <Link to="/" style={styles.link} onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
<li>
  <Link to="/gallery" style={styles.link} onClick={() => setIsOpen(false)}>
    Gallery
  </Link>
</li>
<li>
            <Link to="/doctors" style={styles.link} onClick={() => setIsOpen(false)}>
              Our Experts
            </Link>
          </li>
<li>
  <Link to="/pricing" style={styles.link} onClick={() => setIsOpen(false)}>
    Treatment Costs
  </Link>
</li>
          <li>
  <Link to="/features" style={styles.link} onClick={() => setIsOpen(false)}>
    Hospital Services
  </Link>
</li>

          <li>
  <button onClick={scrollToFooter} style={styles.loginBtn}>
    More+
  </button>
</li>
          <li>
            {role ? (
              <button onClick={goToDashboard} style={styles.loginBtn}>
                Dashboard
              </button>
            ) : (
              <Link
                to="/login"
                style={styles.loginBtn}
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </li>

        </ul>

        {isMobile && (
          <div
            style={styles.menuIcon}
            onClick={() => setIsOpen(!isOpen)}
          >
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
    backdropFilter: "blur(10px)",
    zIndex: 1000,
  },

  container: {
    maxWidth: "1200px",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    position: "relative",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },

  title: {
    fontWeight: "bold",
    fontSize: "18px",
    color: "#0d6efd",
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
    fontSize: "24px",
    cursor: "pointer",
  },

};

export default Navbar;