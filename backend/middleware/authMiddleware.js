const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: "Token không tồn tại" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT Error:", err);
      return res.status(403).json({ message: "Token không hợp lệ" });
    }

    console.log("Authenticated user:", user); // 👈 In payload
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
