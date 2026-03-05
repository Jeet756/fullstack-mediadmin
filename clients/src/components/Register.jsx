import { useState } from "react";

function Register() {
  const [data, setData] = useState({
    username: "",
    password: "",
    role: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

await fetch("http://localhost:5000/api/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(data),
});

    alert("User Registered");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Register New User</h1>

      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="password" placeholder="Password" onChange={handleChange} required />
        
        <select name="role" onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="staff">Staff</option>
          <option value="patient">Patient</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;