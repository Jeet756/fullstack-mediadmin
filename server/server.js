const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
require("dotenv").config();
const { Pool } = require("pg");
const { body, validationResult } = require("express-validator");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const { ipKeyGenerator } = require("express-rate-limit");
const app = express();
const postersFile = path.join(__dirname, "posters.json");
const JWT_ISSUER = process.env.JWT_ISSUER || "mediadmin";
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
pool.on("error", (err) => {
  console.error("Unexpected DB error", err)
})
const axios = require("axios");
async function safeGithubUpdate(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      console.log("Retrying GitHub update...", i + 1);
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, 1000 * (i + 1)));
    }
  }
}
async function updateDoctorsJSON() {
  try {
    const result = await pool.query(
      "SELECT id, name, degree, description, image_url, order_index FROM doctors ORDER BY order_index ASC"
    );
    const doctors = result.rows;
    const content = Buffer.from(JSON.stringify(doctors, null, 2)).toString("base64");
    const url = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${process.env.GITHUB_FILE_PATH}`;
    await safeGithubUpdate(async () => {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      });
      const sha = data.sha;
      await axios.put(
        url,
        {
          message: "Update doctors.json",
          content,
          sha,
          branch: process.env.GITHUB_BRANCH
        },
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`
          }
        }
      );
    });
    console.log(" doctors.json updated on GitHub");
  } catch (err) {
    console.error(
      " GitHub JSON update failed",
      err.response?.data || err.message
    );
  }
}
async function updateGalleryJSON() {
  try {
    const result = await pool.query(
      "SELECT id, media_url, caption, type, created_at FROM gallery ORDER BY created_at DESC"
    );
    const gallery = result.rows;
    const content = Buffer.from(
      JSON.stringify(gallery, null, 2)
    ).toString("base64");
    const url = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${process.env.GITHUB_GALLERY_PATH}`;
    await safeGithubUpdate(async () => {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      });
      const sha = data.sha;
      await axios.put(
        url,
        {
          message: "Update gallery.json",
          content,
          sha,
          branch: process.env.GITHUB_BRANCH,
        },
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
        }
      );
    });
    console.log(" gallery.json updated");
  } catch (err) {
    console.error(
      " GitHub JSON update failed",
      err.response?.data || err.message
    );
  }
}
async function updateContributorsJSON() {
  try {
    const result = await pool.query(
      "SELECT id, name, image_url FROM contributors ORDER BY id DESC"
    );
    const contributors = result.rows;
    const content = Buffer.from(
      JSON.stringify(contributors, null, 2)
    ).toString("base64");
    const url = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${process.env.GITHUB_CONTRIBUTORS_PATH}`;
    await safeGithubUpdate(async () => {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      });
      const sha = data.sha;
      await axios.put(
        url,
        {
          message: "Update contributors.json",
          content,
          sha,
          branch: process.env.GITHUB_BRANCH
        },
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`
          }
        }
      );
    });
    console.log(" contributors.json updated");
  } catch (err) {
    console.error(
      " GitHub JSON update failed",
      err.response?.data || err.message
    );
  }
}
async function updatePostersJSON() {
  try {
    const result = await pool.query(
      "SELECT id, media_url, type, order_index FROM posters ORDER BY order_index ASC, id DESC"
    );
    const posters = result.rows;
    const content = Buffer.from(
      JSON.stringify(posters, null, 2)
    ).toString("base64");
    const url = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${process.env.GITHUB_POSTERS_PATH}`;
    await safeGithubUpdate(async () => {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      });
      const sha = data.sha;
      await axios.put(
        url,
        {
          message: "Update posters.json",
          content,
          sha,
          branch: process.env.GITHUB_BRANCH
        },
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`
          }
        }
      );
    });
    console.log(" posters.json updated");
  } catch (err) {
    console.error(" posters.json update failed", err.response?.data || err.message);
  }
}
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const verifyOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many attempts"
});
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY missing in env");
}
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
if (!process.env.CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Cloudinary env missing");
}
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(
  helmet({
    referrerPolicy: { policy: "no-referrer" },
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'", "https:"]
      }
    }
  })
);
app.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req, res) => ipKeyGenerator(req, res)
});
app.use("/api", limiter);
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://fullstack-mediadmin.vercel.app",
        "http://localhost:5173"
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked CORS:", origin);
        callback(null, false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use((req, res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  next();
});
function sanitizeInput(obj) {
  if (typeof obj === "string") {
    return obj.replace(/[<>&'"]/g, (c) => ({
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeInput);
  }
  if (typeof obj === "object" && obj !== null) {
    const newObj = {};
    for (let key in obj) {
      if (key.toLowerCase().includes("password") || key.toLowerCase().includes("otp")) {
        newObj[key] = obj[key];
      } else {
        newObj[key] = sanitizeInput(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied" });
  }
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token format" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, {
    issuer: JWT_ISSUER,
    algorithms: ["HS256"]
  }, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.user = user;
    next();
  });
};
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
app.get("/", (req, res) => {
  res.send("MediAdmin Backend Running ");
});
app.get("/api/user-attendance", authenticateToken, async (req, res) => {
  const { searchKey, value, from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ message: "Date range required" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" })
  }
  try {
    const allowedKeys = ["email", "phone", "firstName", "lastName", "fullName"];
    if (!allowedKeys.includes(searchKey)) {
      return res.status(400).json({ message: "Invalid search key" });
    }
    let user;
    if (searchKey === "fullName") {
      user = await pool.query(
        `SELECT id FROM users 
     WHERE LOWER(firstname || ' ' || lastname) = LOWER($1)`,
        [value]
      );
    } else if (searchKey === "firstName") {
      user = await pool.query(
        `SELECT id FROM users WHERE LOWER(firstname) = LOWER($1)`,
        [value]
      );
    } else if (searchKey === "lastName") {
      user = await pool.query(
        `SELECT id FROM users WHERE LOWER(lastname) = LOWER($1)`,
        [value]
      );
    } else {
      const columnMap = {
        email: "email",
        phone: "phone"
      };
      if (!columnMap.hasOwnProperty(searchKey)) {
        return res.status(400).json({ message: "Invalid search key" });
      }
      const column = columnMap[searchKey];
      if (!column) {
        return res.status(400).json({ message: "Invalid search key" });
      }
      user = await pool.query(
        `SELECT id FROM users WHERE ${column} = $1`,
        [value]
      );
    }
    if (user.rows.length === 0) {
      return res.json({ records: [], summary: null })
    }
    const userId = user.rows[0].id;
    const result = await pool.query(
      `SELECT 
  d::date as date,
  COALESCE(a.status, 'not_marked') as status,
  COALESCE(a.morning, false) as morning,
  COALESCE(a.afternoon, false) as afternoon,
  COALESCE(a.night, false) as night
FROM generate_series($2::date, $3::date, interval '1 day') d
LEFT JOIN attendance a
ON a.date = d AND a.user_id = $1
ORDER BY d ASC;`,
      [userId, from, to]
    );
    const records = result.rows;
    let present = 0;
    let absent = 0;
    let notRecorded = 0;
    let morning = 0;
    let afternoon = 0;
    let night = 0;
    records.forEach(r => {
      if (r.status === "present") present++;
      if (r.status === "absent") absent++;
      if (r.status === "not_marked") notRecorded++;
      if (r.morning) morning++;
      if (r.afternoon) afternoon++;
      if (r.night) night++;
    });
    res.json({
      records,
      summary: {
        present,
        absent,
        notRecorded,
        morning,
        afternoon,
        night
      }
    });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
});
app.get("/api/all-attendance-stats", authenticateToken, async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ message: "Date range required" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.firstname || ' ' || u.lastname AS name,
        COUNT(DISTINCT a.date) AS marked_days,
        COUNT(CASE WHEN a.morning = true THEN 1 END)::int AS morning,
        COUNT(CASE WHEN a.afternoon = true THEN 1 END)::int AS afternoon,
        COUNT(CASE WHEN a.night = true THEN 1 END)::int AS night,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END)::int AS present,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END)::int AS absent
      FROM users u
      LEFT JOIN attendance a
        ON u.id = a.user_id 
        AND a.date BETWEEN $1 AND $2
      WHERE u.role = 'staff'
      GROUP BY u.id, u.firstname, u.lastname
    `, [from, to]);
    const start = new Date(from);
    const end = new Date(to);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const totalDays =
      Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const finalData = result.rows.map(r => ({
      name: r.name,
      morning: parseInt(r.morning),
      afternoon: parseInt(r.afternoon),
      night: parseInt(r.night),
      present: parseInt(r.present),
      absent: parseInt(r.absent),
      notMarked: Math.max(0, totalDays - parseInt(r.marked_days))
    }));
    res.json(finalData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const result = await pool.query(`
      SELECT 
        id,
        firstname AS "firstName",
        lastname AS "lastName",
        email,
        phone,
        address,
        role
      FROM users
WHERE role != 'admin'
ORDER BY id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/api/attendance/user", authenticateToken, async (req, res) => {
  const { searchKey, value, from, to } = req.body;
  if (!from || !to) {
    return res.status(400).json({ message: "Date range required" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" })
  }
  try {
    const allowedKeys = ["email", "phone", "firstName", "lastName", "fullName"];
    if (!allowedKeys.includes(searchKey)) {
      return res.status(400).json({ message: "Invalid search key" });
    }
    let user;
    if (searchKey === "fullName") {
      user = await pool.query(
        `SELECT id FROM users 
     WHERE LOWER(firstname || ' ' || lastname) = LOWER($1)`,
        [value]
      );
    } else if (searchKey === "firstName") {
      user = await pool.query(
        `SELECT id FROM users WHERE LOWER(firstname)=LOWER($1)`,
        [value]
      );
    } else if (searchKey === "lastName") {
      user = await pool.query(
        `SELECT id FROM users WHERE LOWER(lastname)=LOWER($1)`,
        [value]
      );
    } else {
      const columnMap = {
        email: "email",
        phone: "phone"
      };
      if (!columnMap.hasOwnProperty(searchKey)) {
        return res.status(400).json({ message: "Invalid search key" });
      }
      const column = columnMap[searchKey];
      if (!column) {
        return res.status(400).json({ message: "Invalid search key" });
      }
      user = await pool.query(
        `SELECT id FROM users WHERE ${column}=$1`,
        [value]
      );
    }
    if (user.rows.length === 0) {
      return res.json({ message: "User not found" })
    }
    const userId = user.rows[0].id;
    await pool.query(
      `DELETE FROM attendance 
       WHERE user_id=$1 AND date BETWEEN $2 AND $3`,
      [userId, from, to]
    );
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
});
app.delete("/api/attendance/all", authenticateToken, async (req, res) => {
  const { from, to } = req.body;
  if (!from || !to || new Date(from) > new Date(to)) {
    return res.status(400).json({ message: "Invalid date range" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" })
  }
  try {
    await pool.query(
      `DELETE FROM attendance WHERE date BETWEEN $1 AND $2`,
      [from, to]
    );
    res.json({ message: "All deleted" });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
});
app.delete("/api/users/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const result = await pool.query(
      "DELETE FROM users WHERE id=$1 AND role!='admin' RETURNING *",
      [userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req) => {
    const index = Number(req.params.index);
    if (!Number.isInteger(index) || index < 0 || index > 10) {
      throw new Error("Invalid index");
    }
    return {
      folder: "posters",
      public_id: `poster${index}`,
      overwrite: true,
      invalidate: true,
      resource_type: "auto"
    };
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
      return cb(new Error("Only valid images allowed"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
});
const doctorStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => {
    return {
      folder: "doctors",
      resource_type: "image"
    };
  }
});
const posterStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "image";
    if (file.mimetype.startsWith("video")) {
      resourceType = "video";
    }
    return {
      folder: "posters",
      resource_type: resourceType
    };
  }
});
const posterUpload = multer({
  storage: posterStorage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg", "image/png", "image/webp", "image/jpg",
      "video/mp4", "video/webm", "video/ogg"
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only image/video allowed"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});
const doctorUpload = multer({
  storage: doctorStorage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only images allowed"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
app.get("/api/doctors", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM doctors ORDER BY order_index ASC, id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.post(
  "/api/doctors",
  authenticateToken,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    next();
  },
  (req, res, next) => {
    doctorUpload.single("image")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { name, degree, description, order_index } = req.body;
      if (!req.file) {
        return res.status(400).json({ message: "Image required" });
      }
      const image_url = req.file?.path || null;
      const public_id = req.file?.filename || null;
      await pool.query(
        `INSERT INTO doctors (name, degree, description, image_url, public_id, order_index)
   VALUES ($1,$2,$3,$4,$5,$6)`,
        [name, degree, description, image_url, public_id, order_index || 0]
      );
      await updateDoctorsJSON();
      res.json({ message: "Doctor added" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
app.delete("/api/doctors/:id",
  authenticateToken,
  async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      const result = await pool.query(
        "SELECT public_id FROM doctors WHERE id=$1",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      const public_id = result.rows[0].public_id;
      if (public_id) {
        await cloudinary.uploader.destroy(public_id);
      }
      await pool.query("DELETE FROM doctors WHERE id=$1", [id]);
      await updateDoctorsJSON();
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
app.put("/api/doctors/reorder", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  const { order } = req.body;
  if (!Array.isArray(order)) {
    return res.status(400).json({ message: "Invalid data" });
  }
  try {
    const dbClient = await pool.connect();
    try {
      await dbClient.query("BEGIN");
      for (let i = 0; i < order.length; i++) {
        await dbClient.query(
          "UPDATE doctors SET order_index=$1 WHERE id=$2",
          [i, order[i]]
        );
      }
      await dbClient.query("COMMIT");
      await updateDoctorsJSON();
      res.json({ message: "Reordered successfully" });
    } catch (err) {
      await dbClient.query("ROLLBACK");
      console.error(err);
      res.status(500).json({ message: "Server error" });
    } finally {
      dbClient.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.put("/api/doctors/:id",
  authenticateToken,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    next();
  },
  (req, res, next) => {
    doctorUpload.single("image")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      const { name, degree, description, order_index } = req.body;
      const existing = await pool.query(
        "SELECT public_id FROM doctors WHERE id=$1",
        [id]
      );
      if (existing.rows.length === 0) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      let public_id = existing.rows[0]?.public_id || null;
      let image_url = null;
      if (req.file) {
        if (public_id) {
          await cloudinary.uploader.destroy(public_id);
        }
        image_url = req.file.path;
        public_id = req.file.filename;
        await pool.query(
          `UPDATE doctors 
     SET name=$1, degree=$2, description=$3, image_url=$4, public_id=$5, order_index=$6 
     WHERE id=$7`,
          [name, degree, description, image_url, public_id, order_index || 0, id]
        );
        await updateDoctorsJSON();
      } else {
        await pool.query(
          `UPDATE doctors 
     SET name=$1, degree=$2, description=$3, order_index=$4 
     WHERE id=$5`,
          [name, degree, description, order_index || 0, id]
        );
        await updateDoctorsJSON();
      }
      res.json({ message: "Doctor updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
app.get("/api/public/posters", async (req, res) => {
  try {
    const url = `https://raw.githubusercontent.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/main/posters.json?t=${Date.now()}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to load posters" });
  }
});
app.get("/api/posters", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  const result = await pool.query(
    "SELECT * FROM posters ORDER BY order_index ASC, id DESC"
  );
  res.json(result.rows);
});
app.post(
  "/api/posters",
  authenticateToken,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    next();
  },
  (req, res, next) => {
    posterUpload.single("media")(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "File required" });
      }
      const media_url = req.file.path;
      const public_id = req.file.filename;
      const type = req.file.mimetype.startsWith("video")
        ? "video"
        : "image";
      await pool.query(
        `INSERT INTO posters (media_url, public_id, type)
         VALUES ($1,$2,$3)`,
        [media_url, public_id, type]
      );
      await updatePostersJSON();
      res.json({ message: "Poster added" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);
app.delete("/api/posters/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const result = await pool.query(
      "SELECT public_id, type FROM posters WHERE id=$1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    const { public_id, type } = result.rows[0];
    if (public_id) {
      try {
        await cloudinary.uploader.destroy(public_id, {
          resource_type: type === "video" ? "video" : "image"
        });
      } catch (err) {
        console.log("Cloudinary delete failed:", err.message);
      }
    }
    await pool.query("DELETE FROM posters WHERE id=$1", [id]);
    await updatePostersJSON();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
const contributorStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => {
    return {
      folder: "contributors",
      resource_type: "image"
    };
  }
});
const contributorUpload = multer({
  storage: contributorStorage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only images allowed"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
app.get("/api/contributors", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contributors ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.post(
  "/api/contributors",
  authenticateToken,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    next();
  },
  (req, res, next) => {
    contributorUpload.single("image")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { name } = req.body;
      if (!req.file) {
        return res.status(400).json({ message: "Image required" });
      }
      const image_url = req.file?.path || null;
      const public_id = req.file?.filename || null;
      await pool.query(
        `INSERT INTO contributors (name, image_url, public_id)
         VALUES ($1,$2,$3)`,
        [name, image_url, public_id]
      );
      await updateContributorsJSON();
      res.json({ message: "Contributor added" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
app.delete("/api/contributors/:id",
  authenticateToken,
  async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      const result = await pool.query(
        "SELECT public_id FROM contributors WHERE id=$1",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Not found" });
      }
      const public_id = result.rows[0].public_id;
      if (public_id) {
        await cloudinary.uploader.destroy(public_id);
      }
      await pool.query("DELETE FROM contributors WHERE id=$1", [id]);
      await updateContributorsJSON();
      res.json({ message: "Deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "image";
    if (file.mimetype.startsWith("video")) {
      resourceType = "video";
    }
    return {
      folder: "gallery",
      resource_type: resourceType
    };
  }
});
const galleryUpload = multer({
  storage: galleryStorage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg", "image/png", "image/webp", "image/jpg",
      "video/mp4", "video/webm", "video/ogg"
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only image/video allowed"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});
app.get("/api/public/gallery", async (req, res) => {
  try {
    const url = `https://raw.githubusercontent.com/Jeet756/mediadmin-data/main/gallery.json?t=${Date.now()}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to load gallery" });
  }
});
app.get("/api/gallery", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const result = await pool.query(
      "SELECT * FROM gallery ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.post(
  "/api/gallery",
  authenticateToken,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    next();
  },
  (req, res, next) => {
    galleryUpload.single("image")(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("LOCK TABLE gallery IN EXCLUSIVE MODE");
      const countResult = await client.query("SELECT COUNT(*) FROM gallery");
      const count = parseInt(countResult.rows[0].count);
      if (count >= 50) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Gallery limit reached" });
      }
      const { caption } = req.body;
      const media_url = req.file?.path;
      const public_id = req.file?.filename;
      const type = req.file.mimetype.startsWith("video")
        ? "video"
        : "image";
      if (!req.file) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Image required" });
      }
      await client.query(
        `INSERT INTO gallery (media_url, public_id, caption, type)
   VALUES ($1,$2,$3,$4)`,
        [media_url, public_id, caption || "", type]
      );
      await client.query("COMMIT");
      await updateGalleryJSON();
      res.json({ message: "Image added" });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      res.status(500).json({ message: "Server error" });
    } finally {
      client.release();
    }
  }
);
app.delete("/api/gallery/:id",
  authenticateToken,
  async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      const result = await pool.query(
        "SELECT public_id, type FROM gallery WHERE id=$1",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Not found" });
      }
      const { public_id, type } = result.rows[0];
      if (public_id) {
        await cloudinary.uploader.destroy(public_id, {
          resource_type: type === "video" ? "video" : "image"
        });
      }
      await pool.query("DELETE FROM gallery WHERE id=$1", [id]);
      await updateGalleryJSON();
      res.json({ message: "Deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
app.post("/api/upload-poster/:index", authenticateToken, async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" })
  }
  next()
},
  (req, res, next) => {
    upload.single("poster")(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file || !req.file.path) {
        return res.status(400).json({ message: "Upload failed" });
      }
      res.json({
        message: "Poster updated successfully",
        url: req.file.path
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: "Too many OTP requests. Try again later",
  keyGenerator: (req, res) => {
    return (req.body.email || "unknown") + "_" + ipKeyGenerator(req, res);
  },
});
app.post("/api/send-reset-otp", otpLimiter, async (req, res) => {
  let dbClient;
  try {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Valid email required" });
    }
    const userExists = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );
    if (userExists.rows.length === 0) {
      return res.status(400).json({ message: "Email not registered" });
    }
    dbClient = await pool.connect();
    await dbClient.query("BEGIN");
    const existingOTP = await dbClient.query(
      `SELECT id FROM password_resets 
   WHERE email=$1 AND expires_at > NOW() 
   LIMIT 1 FOR UPDATE`,
      [email]
    );
    if (existingOTP.rows.length > 0) {
      await dbClient.query("ROLLBACK");
      return res.status(400).json({
        message: "OTP already sent. Wait 5 minutes"
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);
    await dbClient.query(
      `DELETE FROM password_resets 
WHERE expires_at < NOW() OR (verified = true AND expires_at < NOW())`
    );
    await dbClient.query(
      "INSERT INTO password_resets(email,otp,expires_at) VALUES($1,$2,$3)",
      [email, otp, expires]
    );
    if (!process.env.BREVO_API_KEY) {
      await dbClient.query("ROLLBACK");
      return res.status(500).json({
        message: "Email service not configured"
      });
    }
    const emailSender = new SibApiV3Sdk.SendSmtpEmail();
    emailSender.subject = "Password Reset OTP";
    emailSender.htmlContent = `<h2>Your OTP: ${otp}</h2><p>Valid for 5 minutes</p>`;
    emailSender.sender = {
      name: "MediAdmin",
      email: "jeetmukati756@gmail.com"
    };
    emailSender.to = [{ email }];
    const response = await apiInstance.sendTransacEmail(emailSender);
    if (!response) {
      throw new Error("Email send failed");
    }
    await dbClient.query("COMMIT");
    return res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("OTP ERROR:", err);
    if (dbClient) {
      try {
        await dbClient.query("ROLLBACK");
      } catch { }
    }
    return res.status(500).json({
      message: "Failed to send OTP"
    });
  } finally {
    if (dbClient) dbClient.release();
  }
});
app.post("/api/verify-reset-otp", verifyOtpLimiter, async (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP required" });
  }
  try {
    const result = await pool.query(
      `SELECT * FROM password_resets 
WHERE email=$1 AND otp=$2 AND verified=false AND expires_at > NOW()
ORDER BY id DESC LIMIT 1`,
      [email, otp]
    )
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid OTP" })
    }
    const record = result.rows[0]
    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ message: "OTP expired" })
    }
    const update = await pool.query(
      `UPDATE password_resets 
   SET verified=true 
   WHERE id=$1 AND verified=false 
   RETURNING *`,
      [record.id]
    );
    if (update.rowCount === 0) {
      return res.status(400).json({
        message: "Already used or invalid OTP"
      });
    }
    res.json({ message: "OTP verified" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})
const resetLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  keyGenerator: (req, res) => {
    return (req.body.email || "unknown") + "_" + ipKeyGenerator(req, res);
  },
});
app.post("/api/reset-password", resetLimiter, async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, newPassword } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Valid email required" });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }
    await client.query("BEGIN");
    const reset = await client.query(
      `SELECT * FROM password_resets 
       WHERE email=$1 
       AND verified=true 
       AND expires_at > NOW()
       ORDER BY id DESC 
       LIMIT 1`,
      [email]
    );
    if (reset.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "OTP not verified" });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await client.query(
      "UPDATE users SET password=$1 WHERE email=$2",
      [hashed, email]
    );
    await client.query(
      "DELETE FROM password_resets WHERE id=$1",
      [reset.rows[0].id]
    );
    await client.query("COMMIT");
    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, try again later",
  keyGenerator: (req, res) => {
    return (req.body.email || "unknown") + "_" + ipKeyGenerator(req, res);
  },
});
app.post(
  "/api/login",
  loginLimiter,
  [
    body("email").isEmail(),
    body("password").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input" });
    }
    try {
      const { email, password } = req.body;
      const result = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      );
      const user = result.rows[0];
      const fakeHash = "$2b$10$1234567890123456789012u9Qw1q6rFz9F9l9F9l9F9l9F9l9F9l9F";
      const isMatch = await bcrypt.compare(
        password,
        user ? user.password : fakeHash
      );
      if (!user || !isMatch) {
        await bcrypt.compare(password, fakeHash);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "12h", issuer: JWT_ISSUER }
      );
      res.json({
        token,
        role: user.role,
        name: user.firstname,
        firstName: user.firstname
      });
    } catch (err) {
      console.error("Error:", err.message);
      res.status(500).json({ message: "Server Error" });
    }
  }
);
app.post("/api/register", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const {
      password,
      role,
      firstName,
      lastName,
      email,
      phone,
      address
    } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Valid email required" });
    }
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "Name required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }
    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users
(password,role,firstname,lastname,email,phone,address)
VALUES($1,$2,$3,$4,$5,$6,$7)`,
      [
        hashedPassword,
        role,
        firstName,
        lastName,
        email,
        phone,
        address
      ]
    );
    res.json({ message: "User Registered Successfully" });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server Error" })
  }
});
app.post("/api/applications", async (req, res) => {
  try {
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
    await pool.query(`INSERT INTO applications
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
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});
app.get("/api/applications", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const { from, to } = req.query;
    let query = `
      SELECT 
        id,
        firstname AS "firstName",
        lastname AS "lastName",
        email,
        phone,
        dob,
        address,
        position,
        qualification,
        experience,
        license,
        created_at AS "createdAt"
      FROM applications
    `;
    let values = [];
    if (from && to) {
      query += `
        WHERE created_at >= $1::date 
AND created_at < ($2::date + INTERVAL '1 day')
      `;
      values.push(from, to);
    }
    query += ` ORDER BY id DESC`;
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/api/applications/delete-range", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const { from, to } = req.body;
    if (!from || !to || new Date(from) > new Date(to)) {
      return res.status(400).json({ message: "Invalid date range" });
    }
    const result = await pool.query(
      `DELETE FROM applications 
       WHERE created_at >= $1::date 
AND created_at < ($2::date + INTERVAL '1 day')`,
      [from, to]
    );
    res.json({
      message: "Applications deleted",
      count: result.rowCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/api/applications/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    await pool.query(
      "DELETE FROM applications WHERE id=$1",
      [id]
    );
    res.json({ message: "Application deleted" });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
const appointmentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: "Too many appointment requests"
});
app.post("/api/appointments", appointmentLimiter,
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("phone").notEmpty(),
    body("appointmentDate").notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input" });
    }
    try {
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
    } catch (err) {
      console.error("Error:", err.message);
      res.status(500).json({ message: "Server Error" });
    }
  });
app.get("/api/appointments", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const { from, to, type } = req.query;
    let query = `
      SELECT 
        id,
        name,
        email,
        phone,
        age,
        gender,
        symptoms,
        appointmentdate AS "appointmentDate",
        doctorpriority AS "doctorPriority",
        created_at AS "createdAt"
      FROM appointments
    `;
    let values = [];
    if (from && to && type) {
      if (type === "appointmentDate") {
        query += ` 
          WHERE appointmentdate::date BETWEEN $1::date AND $2::date
        `;
      } else if (type === "createdAt") {
        query += ` 
          WHERE created_at::date BETWEEN $1::date AND $2::date
        `;
      }
      values.push(from, to);
    }
    query += ` ORDER BY id DESC`;
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/api/appointments", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const { from, to, type } = req.body;
    if (!from || !to || !type) {
      return res.status(400).json({ message: "from, to, type required" });
    }
    let query = "";
    if (type === "appointmentDate") {
      query = `
        DELETE FROM appointments
        WHERE appointmentdate::date BETWEEN $1::date AND $2::date
      `;
    } else if (type === "createdAt") {
      query = `
        DELETE FROM appointments
        WHERE created_at::date BETWEEN $1::date AND $2::date
      `;
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }
    const result = await pool.query(query, [from, to]);
    res.json({
      message: "Appointments deleted successfully",
      count: result.rowCount
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/api/appointments/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    await pool.query(
      "DELETE FROM appointments WHERE id=$1",
      [id]
    );
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/staff-users", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" })
    }
    const result = await pool.query(
      `SELECT 
  id,
  firstname AS "firstName",
  lastname AS "lastName",
  email,
  phone
FROM users
WHERE role='staff'`
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})
app.get("/api/attendance/:date", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" })
  }
  const date = req.params.date
  try {
    const result = await pool.query(
      `SELECT user_id, morning, afternoon, night, status 
FROM attendance 
WHERE date=$1`,
      [date]
    )
    res.json(result.rows)
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})
app.get("/api/attendance-dates", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" })
  }
  try {
    const result = await pool.query(
      "SELECT DISTINCT date FROM attendance"
    )
    const dates = result.rows.map(r => r.date)
    res.json(dates)
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})
app.post("/api/attendance", authenticateToken, async (req, res) => {
  const { date, records } = req.body
  if (!date || !records) {
    return res.status(400).json({ message: "Invalid data" })
  }
  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ message: "Invalid records array" });
  }
  for (const r of records) {
    if (!r.user_id || !r.status) {
      return res.status(400).json({ message: "Invalid record data" });
    }
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" })
  }
  try {
    await Promise.all(
      records.map((r) =>
        pool.query(
          `INSERT INTO attendance(user_id,date,morning,afternoon,night,status)
       VALUES($1,$2,$3,$4,$5,$6)
       ON CONFLICT (user_id, date)
       DO UPDATE SET 
         morning = EXCLUDED.morning,
         afternoon = EXCLUDED.afternoon,
         night = EXCLUDED.night,
         status = EXCLUDED.status`,
          [
            r.user_id,
            date,
            r.morning,
            r.afternoon,
            r.night,
            r.status
          ]
        )
      )
    );
    res.json({ message: "Attendance saved" })
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})
app.post("/api/self-attendance", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role !== "staff") {
      return res.status(403).json({ message: "Staff only" });
    }

    const { slot } = req.body;
    if (!["morning", "afternoon", "night"].includes(slot)) {
      return res.status(400).json({ message: "Invalid slot" });
    }

    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();

    const timeWindows = {
      morning: [420, 510],
      afternoon: [780, 870],
      night: [1140, 1230],
    };

    const [start, end] = timeWindows[slot];

    if (totalMinutes < start || totalMinutes > end) {
      return res.status(400).json({
        message: `⛔ ${slot} window closed`
      });
    }

    const today = new Date().toISOString().slice(0, 10);

    const existing = await pool.query(
      "SELECT * FROM attendance WHERE user_id=$1 AND date=$2",
      [userId, today]
    );

    if (existing.rows.length === 0) {
      await pool.query(
        `INSERT INTO attendance(user_id,date,morning,afternoon,night,status)
         VALUES($1,$2,$3,$4,$5,$6)`,
        [
          userId,
          today,
          slot === "morning",
          slot === "afternoon",
          slot === "night",
          "present"
        ]
      );
    } else {
      const record = existing.rows[0];

      if (record[slot]) {
        return res.status(400).json({
          message: `Already marked ${slot}`
        });
      }

      await pool.query(
        `UPDATE attendance
         SET ${slot}=true, status='present'
         WHERE user_id=$1 AND date=$2`,
        [userId, today]
      );
    }

    res.json({ message: `${slot} marked ✅` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/my-attendance", authenticateToken, async (req, res) => {
  try {
    const { from, to } = req.query;
    const email = req.user.email;
    const user = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = user.rows[0].id;
    let query = `
      SELECT 
        d::date as date,
        COALESCE(a.status, 'not_marked') as status,
        COALESCE(a.morning, false) as morning,
        COALESCE(a.afternoon, false) as afternoon,
        COALESCE(a.night, false) as night
      FROM generate_series($2::date, $3::date, interval '1 day') d
      LEFT JOIN attendance a
      ON a.date = d AND a.user_id = $1
      ORDER BY d DESC
    `;
    const today = new Date().toISOString().slice(0, 10);
    let startDate = from;
    let endDate = to;
    if (!from && !to) {
      startDate = today;
      endDate = today;
    } else if (from && !to) {
      endDate = from;
    } else if (!from && to) {
      startDate = to;
      endDate = to;
    }
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: "Invalid date range" });
    }
    const result = await pool.query(query, [
      userId,
      startDate,
      endDate
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (
    err.message === "Only valid images allowed" ||
    err.message === "Only images allowed"
  ) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});