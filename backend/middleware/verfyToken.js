import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId; // or decoded.id depending on how you encoded it
    req.role = decoded.role; // helpful for role-based routes

    return next();
  } catch (error) {
    console.error("Error in verifyToken:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Invalid or expired token" });
  }
};
