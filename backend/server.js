require("dotenv").config();
const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
app.use(cors()); // Allow React Native to access API
app.use(express.json()); // Support JSON in requests
app.use("/uploads", express.static("uploads")); // Access images via /uploads

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Ensure the uploads directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123456789",
  database: process.env.DB_NAME || "carvip2",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error: ", err);
    process.exit(1); // Exit on connection failure
  }
  console.log("✅ MySQL connected successfully!");
});


// Middleware cho xac thuc
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided or invalid format" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};


















const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret'
});

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'carvip', 
    format: async () => 'jpg',
    public_id: (req, file) => 'car_' + Date.now()
  }
});

const upload = multer({ storage: storage });

app.post('/upload-car-image/:id', upload.single('image'), async (req, res) => {
  const imageUrl = req.file.path; 
  const carId = req.params.id;

  
  await connection.execute('UPDATE car SET image_path = ? WHERE id = ?', [imageUrl, carId]);

  res.json({ success: true, imageUrl });
});



// // Configure image storage for vehicles
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });
// const upload = multer({ storage: storage });


// // Middleware for role-based access control
// const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ success: false, message: "Access forbidden" });
//     }
//     next();
//   };
// };

// // Login endpoint
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ success: false, message: "Email and password are required" });
//   }

//   db.query("SELECT * FROM User WHERE email = ? AND status = 'Active'", [email], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, message: "Server error" });
//     }

//     if (results.length === 0) {
//       return res.status(400).json({ success: false, message: "Account not found or inactive" });
//     }

//     const user = results[0];

//     bcrypt.compare(password, user.password, (err, isMatch) => {
//       console.log("👉 Plain:", password);
//         console.log("👉 Hashed from DB:", user.password);
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ success: false, message: "Server error" });
//       }
//       if (!isMatch) {
        

//         return res.status(400).json({ success: false, message: "Invalid credentials" });
//       }

//       if (!process.env.JWT_SECRET) {
//         console.error("JWT_SECRET not defined");
//         return res.status(500).json({ success: false, message: "Server configuration error" });
//       }

//       const token = jwt.sign(
//         { user_id: user.user_id, role: user.role },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRATION || "1h" }
//       );

//       return res.status(200).json({
//         success: true,
//         message: "Login successful",
//         token: token,
//         role: user.role,
//       });
//     });
//   });
// });

// // Register endpoint
// app.post("/register", (req, res) => {
//   const { email, password, role, name, phone } = req.body;

//   if (!email || !password || !role || !name || !phone) {
//     return res.status(400).json({ success: false, message: "Email, password, role, name, and phone are required" });
//   }

//   db.query("SELECT * FROM User WHERE email = ?", [email], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, message: "Server error" });
//     }
//     if (results.length > 0) {
//       return res.status(400).json({ success: false, message: "Email already exists" });
//     }

//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ success: false, message: "Server error" });
//       }

//       const query = "INSERT INTO User (name, email, phone, password, role, status) VALUES (?, ?, ?, ?, ?, 'Active')";
//       db.query(query, [name, email, phone, hashedPassword, role], (err, results) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ success: false, message: "Account creation failed" });
//         }

//         return res.status(201).json({ success: true, message: "User registered successfully" });
//       });
//     });
//   });
// });

// // Apply verifyToken for all routes below
// app.use(verifyToken);

// // Get list of vehicles
// app.get("/vehicles", (req, res) => {
//   db.query("SELECT * FROM Vehicle", (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, message: "Database error" });
//     }
//     res.json({ success: true, message: "Vehicle list fetched successfully", data: results });
//   });
// });

// // Upload vehicle image
// app.post("/upload/:vehicle_id", restrictTo("Admin", "Staff"), upload.single("image"), (req, res) => {
//   const vehicleId = req.params.vehicle_id;
//   const filePath = req.file ? req.file.filename : null;

//   if (!filePath) {
//     return res.status(400).json({ success: false, message: "No image uploaded" });
//   }

//   db.query("SELECT * FROM Vehicle WHERE vehicle_id = ?", [vehicleId], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, message: "Database error" });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ success: false, message: "Vehicle not found" });
//     }

//     const sql = "UPDATE Vehicle SET image = ? WHERE vehicle_id = ?";
//     db.query(sql, [filePath, vehicleId], (err, results) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ success: false, message: "Error updating vehicle image" });
//       }

//       res.json({ success: true, message: "Vehicle image uploaded successfully" });
//     });
//   });
// });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
