const mysql = require('mysql2');
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || 'local'}`
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
  console.log("MySQL connected");
});

module.exports = db.promise(); // Xuất promise để dùng async/await
