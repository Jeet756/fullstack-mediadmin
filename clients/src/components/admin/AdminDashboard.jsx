import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useCallback } from "react";
function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("firstName");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  }, [navigate]);
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token || role !== "admin") {
        navigate("/login");
      }
    };
    checkAuth();
    window.addEventListener("authChanged", checkAuth);
    return () => {
      window.removeEventListener("authChanged", checkAuth);
    };
  }, [navigate]);
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000;
        if (Date.now() > exp) {
          handleLogout();
        }
      } catch (err) {
        handleLogout();
      }
    };
    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [handleLogout]);
  const menuItems = [
    { name: "Doctors", path: "/admin/doctors" },
    { name: "Applications", path: "/admin/applications" },
    { name: "Appointments", path: "/admin/appointments" },
    { name: "Users", path: "/admin/users" },
    { name: "Posters", path: "/admin/posters" },
    { name: "Attendance", path: "/admin/attendance" },
    { name: "Register User", path: "/admin/register" },
    { name: "View Attendance", path: "/admin/view-attendance" },
    { name: "Gallery", path: "/admin/gallery" },
    { name: "Contributors", path: "/admin/contributors" },
  ];
  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <style>{`
        .dashboard {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #eef2ff, #e0f2fe);
          font-family: 'Segoe UI', sans-serif;
        }
        .sidebar {
          width: 240px;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(15px);
          padding: 20px;
          border-right: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          box-sizing: border-box;
          height: 90vh;        
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #6366f1 #e2e8f0;
        }
        .sidebar::-webkit-scrollbar {
          height: 6px;
        }
        .sidebar::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .sidebar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          border-radius: 10px;
        }
        .logo {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 30px;
          color: #1e293b;
        }
        .menu-item {
          padding: 12px 15px;
          border-radius: 10px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: 0.2s;
          color: #334155;
        }
        .menu-item:hover {
          background: rgba(99,102,241,0.1);
        }
        .active {
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          color: white;
          font-weight: 500;
        }
        .content {
          flex: 1;
          padding: 25px;
          overflow-y: auto;
        }
        .topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap; 
  gap: 10px;       
}
        .title {
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  min-width: 0; 
}
        .logout-btn {
  padding: 8px 12px; 
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
  max-width: 100%;   
  white-space: nowrap;
}
        .logout-btn:hover {
          opacity: 0.85;
        }
@media (max-width: 220px) {
  .topbar {
    flex-direction: column;
    align-items: stretch;
  }
  .logout-btn {
    width: 100%;
    text-align: center;
  }
}
        @media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden; 
    padding: 10px 0;
    gap: 0;
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.4);
    height: auto !important; /* 
  }
  .logo {
    display: none;
  }
  .menu-item {
  flex: 0 0 auto;
  margin-left: 10px;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 20px;
  white-space: nowrap;
  line-height: 1;
  display: flex;
  align-items: center;
  height: 32px; 
}
.active {
  padding: 8px 12px !important;
  line-height: 1 !important;
  display: flex !important;
  align-items: center !important;
  height: 32px !important; 
}
  .content {
    padding: 15px;
  }
}
      `}</style>
      <div className="dashboard">
        <div className="sidebar">
          <div className="logo">Admin Panel</div>
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`menu-item ${location.pathname === item.path ? "active" : ""
                }`}
            >
              {item.name}
            </div>
          ))}
        </div>
        <div className="content">
          <div className="topbar">
            <div className="title">Welcome Admin 👋</div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
export default AdminDashboard;