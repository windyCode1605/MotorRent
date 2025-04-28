// Phân quyền truy cập cho người dùng dựa trên vai trò của họ
exports.authorizeRoles = (role) => {
    return (req, res, next) => {
      if (!req.user || req.user.role !== role) {
        return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
      }
      next();
    };
  };