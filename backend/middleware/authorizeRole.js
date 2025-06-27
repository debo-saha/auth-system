// server/middleware/authorizeRole.js
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.userRole; // coming from verifyToken middleware

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }

    next();
  };
};
