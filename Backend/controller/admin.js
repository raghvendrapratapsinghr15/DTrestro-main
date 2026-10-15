import Errorhandler from "../error/error.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/adminSchema.js";
import { Reservation } from "../models/reservationSchema.js";

// Helper to send error response directly (Express 5 safe)
const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message });
};

// ─── CHECK SETUP (public) ─────────────────────────────────────────────────────
// Returns whether any admin account already exists
export const checkSetup = async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    res.status(200).json({ success: true, adminExists: count > 0 });
  } catch (error) {
    return sendError(res, error.message || "Check failed.", 500);
  }
};

// ─── REGISTER admin ───────────────────────────────────────────────────────────
// Public ONLY when no admin exists (first-time setup).
// Once an admin exists, requires a valid JWT (authenticated admin only).
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return sendError(res, "Please provide name, email, and password.", 400);
  }
  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return sendError(res, "An admin with this email already exists.", 400);
    }
    await Admin.create({ name, email, password });
    res.status(201).json({ success: true, message: "Admin account created successfully!" });
  } catch (error) {
    return sendError(res, error.message || "Registration failed.", 500);
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendError(res, "Please provide email and password.", 400);
  }
  try {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return sendError(res, "Invalid credentials.", 401);
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return sendError(res, "Invalid credentials.", 401);
    }
    const token = admin.generateToken();

    res
      .cookie("adminToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sameSite: "lax",
      })
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully!",
        token,
        admin: { id: admin._id, name: admin.name, email: admin.email },
      });
  } catch (error) {
    return sendError(res, error.message || "Login failed.", 500);
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export const logoutAdmin = (req, res) => {
  res
    .clearCookie("adminToken")
    .status(200)
    .json({ success: true, message: "Logged out successfully!" });
};

// ─── GET ALL RESERVATIONS ─────────────────────────────────────────────────────
export const getAllReservations = async (req, res) => {
  try {
    const { status, date, search } = req.query;
    const query = {};

    if (status && status !== "All") query.status = status;
    if (date) query.date = date;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName:  { $regex: search, $options: "i" } },
        { phone:     { $regex: search, $options: "i" } },
        { email:     { $regex: search, $options: "i" } },
      ];
    }

    const reservations = await Reservation.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, reservations });
  } catch (error) {
    return sendError(res, error.message || "Failed to fetch reservations.");
  }
};

// ─── GET DASHBOARD STATS ──────────────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [total, todayCount, pending, confirmed, cancelled, upcoming] =
      await Promise.all([
        Reservation.countDocuments(),
        Reservation.countDocuments({ date: today }),
        Reservation.countDocuments({ status: "Pending" }),
        Reservation.countDocuments({ status: "Confirmed" }),
        Reservation.countDocuments({ status: "Cancelled" }),
        Reservation.countDocuments({ date: { $gte: today }, status: { $ne: "Cancelled" } }),
      ]);

    res.status(200).json({
      success: true,
      stats: { total, todayCount, upcoming, pending, confirmed, cancelled },
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to fetch stats.");
  }
};

// ─── UPDATE STATUS ────────────────────────────────────────────────────────────
export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return sendError(res, "Invalid status value.", 400);
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!reservation) {
      return sendError(res, "Reservation not found.", 404);
    }
    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      reservation,
    });
  } catch (error) {
    return sendError(res, error.message || "Update failed.");
  }
};

// ─── DELETE RESERVATION ───────────────────────────────────────────────────────
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return sendError(res, "Reservation not found.", 404);
    }
    res.status(200).json({ success: true, message: "Reservation deleted successfully!" });
  } catch (error) {
    return sendError(res, error.message || "Delete failed.");
  }
};

// ─── GET SINGLE RESERVATION ───────────────────────────────────────────────────
export const getSingleReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return sendError(res, "Reservation not found.", 404);
    }
    res.status(200).json({ success: true, reservation });
  } catch (error) {
    return sendError(res, error.message || "Failed to fetch reservation.");
  }
};
