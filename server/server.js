const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();
const PORT = 5000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());


const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});



const postersPath = path.join(__dirname, "../clients/public");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, postersPath);
  },
  filename: function (req, file, cb) {
    const posterIndex = req.params.index;
    cb(null, `poster${posterIndex}.jpg`);
  },
});

const upload = multer({ storage });

app.post("/api/upload-poster/:index", upload.single("poster"), (req, res) => {
  res.json({ message: "Poster updated successfully" });
});



const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }

    req.user = user;
    next();
  });
};



app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );

  const user = result.rows[0];

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1d" }
  );

  res.json({ token, role: user.role });
});


app.post("/api/register", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const { username, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users(username,password,role) VALUES($1,$2,$3)",
    [username, hashedPassword, role]
  );

  res.json({ message: "User Registered" });
});



app.post("/api/applications", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    address,
    position,
    qualification,
    experience,
    license,
  } = req.body;

  await pool.query(
    `INSERT INTO applications
    (firstName,lastName,email,phone,dob,address,position,qualification,experience,license)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [
      firstName,
      lastName,
      email,
      phone,
      dob,
      address,
      position,
      qualification,
      experience,
      license,
    ]
  );

  res.json({ message: "Application submitted successfully" });
});



app.get("/api/applications", authenticateToken, async (req, res) => {
  const result = await pool.query("SELECT * FROM applications ORDER BY id DESC");
  res.json(result.rows);
});



app.delete("/api/applications/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;

  await pool.query("DELETE FROM applications WHERE id=$1", [id]);

  res.json({ message: "Application deleted" });
});



app.post("/api/appointments", async (req, res) => {
  const {
    name,
    email,
    phone,
    age,
    gender,
    symptoms,
    appointmentDate,
    doctorPriority,
  } = req.body;

  await pool.query(
    `INSERT INTO appointments
    (name,email,phone,age,gender,symptoms,appointmentDate,doctorPriority)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      name,
      email,
      phone,
      age,
      gender,
      symptoms,
      appointmentDate,
      doctorPriority,
    ]
  );

  res.json({
    message: "Thank you for your enquiry, our team will reach you!",
  });
});



app.get("/api/appointments", authenticateToken, async (req, res) => {
  const result = await pool.query("SELECT * FROM appointments ORDER BY id DESC");
  res.json(result.rows);
});



app.delete("/api/appointments/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;

  await pool.query("DELETE FROM appointments WHERE id=$1", [id]);

  res.json({ message: "Appointment deleted" });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});