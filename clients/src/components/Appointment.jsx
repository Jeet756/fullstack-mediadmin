import { useState } from "react";

const Appointment = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    symptoms: "",
    appointmentDate: "",
    doctorPriority: "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://fullstack-mediadmin.onrender.com/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      alert(data.message || "Thank you for your enquiry, our team will reach you!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        symptoms: "",
        appointmentDate: "",
        doctorPriority: "",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong! Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Enter Patient Details</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          style={styles.input}
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          style={styles.input}
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          style={styles.input}
        />
        <input
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          required
          style={styles.input}
        />
        <input
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          placeholder="Gender (Male/Female/Other)"
          required
          style={styles.input}
        />
        <input
          name="symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          placeholder="Describe your Symptoms"
          required
          style={styles.input}
        />

        <label style={styles.label}>Appointment Date</label>
        <input
          name="appointmentDate"
          type="date"
          value={formData.appointmentDate}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="doctorPriority"
          value={formData.doctorPriority}
          onChange={handleChange}
          placeholder="Doctor / Priority"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Submit Appointment
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#555",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    transition: "0.2s",
  },
  button: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default Appointment;