const express = require("express");                      //
const multer = require("multer");                        // thư viện upload file
const mysql = require("mysql2");                         // thư viện làm việc với cơ sở dữ liệu mysql
const cors = require("cors");                            // Cho phép các ứng dụng fontend truy cập api ở các domain khác
const brcypt  = require("bcrypt");                       // Thư viện cho để mã hóa mật khẩu bằng thuật toán brcypt
const jwt = require("jsonwebtoken");                     // Thư viện tạo token xác thực cho người dùng

require("dotenv").config();                               // Tải file .env chứa biến môi trường , ví dụ: mật khẩu , khóa bí mật vào process.env

const app = express();                                    // Khởi tạo một ứng dụng web api bằng framework Expresss

app.use(cors());                                          // Áp dụng middleware cho toàn bộ ứng dụng cho phép fontend truy cập API
app.use(express.json());                                  // Cho phép đọc body JSON trong các request POST/PUSH
app.use('/uploads', express.static('/uploads'));          // Cho phép truy cập ảnh đa upload từ thư mục uploads qua đường dẫn /uploads
