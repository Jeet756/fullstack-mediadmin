import { useState } from "react";

function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showApps, setShowApps] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [showPosterSection, setShowPosterSection] = useState(false);
  const token = localStorage.getItem("token");

  const uploadPoster = async (index, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("poster", file);

    const res = await fetch(
      `http://localhost:5000/api/upload-poster/${index}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await res.json();
    alert(data.message);
  };

  const fetchApplications = async () => {
    const res = await fetch("http://localhost:5000/api/applications", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setApplications(data);
    setShowApps(true);
    setShowAppointments(false);
    setShowPosterSection(false);
  };

  const fetchAppointments = async () => {
    const res = await fetch("http://localhost:5000/api/appointments", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setAppointments(data);
    setShowAppointments(true);
    setShowApps(false);
    setShowPosterSection(false);
  };

  const deleteApplication = async (index) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    const res = await fetch(
      `http://localhost:5000/api/applications/${index}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert(data.message);
    setApplications(applications.filter((_, i) => i !== index));
  };

  const deleteAppointment = async (index) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;

    const res = await fetch(
      `http://localhost:5000/api/appointments/${index}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert(data.message);
    setAppointments(appointments.filter((_, i) => i !== index));
  };
 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const cardStyle = {
    border: "1px solid #ccc",
    margin: "10px 0",
    padding: "12px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    fontSize: "clamp(12px, 3vw, 14px)",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  };

  const buttonStyle = {
    padding: "8px 12px",
    fontSize: "clamp(10px, 3vw, 14px)",
    cursor: "pointer",
    flex: "1 1 140px",
    minWidth: "120px",
  };

  return (
    <div
      style={{
        padding: "clamp(10px, 3vw, 20px)",
        fontFamily: "Arial, sans-serif",
        width: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <h1 style={{ fontSize: "clamp(20px, 6vw, 28px)" }}>
        Welcome to Admin Dashboard
      </h1>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <button onClick={fetchApplications} style={buttonStyle}>
          View New Joiners Responses
        </button>

        <button onClick={fetchAppointments} style={buttonStyle}>
          View Appointments
        </button>

        <button
          onClick={() => (window.location.href = "/register")}
          style={buttonStyle}
        >
          Register New ID/Password
        </button>

        <button
          onClick={() => {
            setShowPosterSection(true);
            setShowApps(false);
            setShowAppointments(false);
          }}
          style={buttonStyle}
        >
          Manage Posters
        </button>
      </div>

      <button
        onClick={handleLogout}
        style={{
          ...buttonStyle,
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          maxWidth: "200px",
        }}
      >
        Logout
      </button>

      {showPosterSection && (
        <>
          <h3 style={{ fontSize: "clamp(16px, 4vw, 20px)", marginTop: "20px" }}>
            Replace Poster Images
          </h3>

          <div style={{ marginBottom: "20px" }}>
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{
                    maxWidth: "100%",
                    fontSize: "clamp(10px, 3vw, 13px)",
                  }}
                  onChange={(e) => uploadPoster(num, e.target.files[0])}
                />
                <span
                  style={{
                    fontSize: "clamp(10px, 3vw, 14px)",
                    wordBreak: "break-word",
                  }}
                >
                  Replace poster{num}.jpg
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {showApps && (
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ fontSize: "clamp(18px, 5vw, 24px)" }}>Applications</h2>

          {applications.map((app, index) => (
            <div key={index} style={cardStyle}>
              <p><strong>Name:</strong> {app.firstName} {app.lastName}</p>
              <p><strong>Email:</strong> {app.email}</p>
              <p><strong>Phone:</strong> {app.phone}</p>
              <p><strong>Address:</strong> {app.address}</p>
              <p><strong>Date of Birth:</strong> {app.dob}</p>
              <p><strong>Position:</strong> {app.position}</p>
              <p><strong>Qualification:</strong> {app.qualification}</p>
              <p><strong>Experience:</strong> {app.experience} years</p>
              <p><strong>License:</strong> {app.license}</p>

              <button
                onClick={() => deleteApplication(app.id)}
                style={{
                  marginTop: "8px",
                  padding: "6px 12px",
                  backgroundColor: "darkred",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "clamp(10px, 3vw, 12px)",
                }}
              >
                Delete Application
              </button>
            </div>
          ))}
        </div>
      )}

      {showAppointments && (
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ fontSize: "clamp(18px, 5vw, 24px)" }}>Appointments</h2>

          {appointments.map((appt, index) => (
            <div
              key={index}
              style={{
                ...cardStyle,
                border: "1px solid green",
                backgroundColor: "#eef9f1",
              }}
            >
              <p><strong>Name:</strong> {appt.name}</p>
              <p><strong>Email:</strong> {appt.email}</p>
              <p><strong>Phone:</strong> {appt.phone}</p>
              <p><strong>Age:</strong> {appt.age}</p>
              <p><strong>Gender:</strong> {appt.gender}</p>
              <p><strong>Symptoms:</strong> {appt.symptoms}</p>
              <p><strong>Appointment Date:</strong> {appt.appointmentDate}</p>
              <p><strong>Doctor / Priority:</strong> {appt.doctorPriority}</p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(appt.createdAt).toLocaleString()}
              </p>

              <button
                onClick={() => deleteAppointment(appt.id)}
                style={{
                  marginTop: "8px",
                  padding: "6px 12px",
                  backgroundColor: "darkred",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "clamp(10px, 3vw, 12px)",
                }}
              >
                Delete Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;