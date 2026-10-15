import jwt from "jsonwebtoken";
import { Admin } from "../models/adminSchema.js";

export const isAdminAuthenticated = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.adminToken) {
    token = req.cookies.adminToken;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorised. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
    if (!req.admin) {
      return res.status(401).json({ success: false, message: "Admin not found." });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token is invalid or expired." });
  }
};
