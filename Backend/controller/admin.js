import Errorhandler from "../error/error.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/adminSchema.js";
import { Reservation } from "../models/reservationSchema.js";

// Helper to send error response directly (Express 5 safe)
const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message });
};

// ─── CHECK SETUP ──────────────────────────────────────────────────────────────
// Registration is permanently disabled
export const checkSetup = async (req, res) => {
  try {
    res.status(200).json({ success: true, adminExists: true, registrationOpen: false });
  } catch (error) {
    return sendError(res, error.message || "Check failed.", 500);
  }
};

// ─── REGISTER admin (DISABLED) ────────────────────────────────────────────────
// Public registration is disabled to secure the admin panel
export const registerAdmin = async (req, res) => {
  return sendError(
    res,
    "Public admin registration is disabled. Only authorized owner credentials are permitted.",
    403
  );
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const loginAdmin = async (req, res, next) => {
  const { adminId, email, password } = req.body;
  const inputId = (adminId || email || "").trim();

  if (!inputId || !password) {
    return sendError(res, "Please provide Admin ID and password.", 400);
  }
  try {
    const admin = await Admin.findOne({
      $or: [{ adminId: inputId }, { email: inputId }],
    }).select("+password");

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
        admin: {
          id: admin._id,
          adminId: admin.adminId || admin.email,
          name: admin.name || "Admin",
          email: admin.email,
        },
      });
  } catch (error) {
    return sendError(res, error.message || "Login failed.", 500);
  }
};

// ─── GET CURRENT ADMIN PROFILE ────────────────────────────────────────────────
export const getAdminProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      admin: {
        id: req.admin._id,
        adminId: req.admin.adminId || req.admin.email,
        name: req.admin.name || "Admin",
        email: req.admin.email,
      },
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to fetch profile.", 500);
  }
};

// ─── CHANGE ADMIN ID / PASSWORD ───────────────────────────────────────────────
export const changeAdminCredentials = async (req, res) => {
  const { currentPassword, newAdminId, newPassword } = req.body;

  if (!currentPassword) {
    return sendError(res, "Current password is required to verify your identity.", 400);
  }

  const trimmedNewId = (newAdminId || "").trim();
  const trimmedNewPassword = (newPassword || "").trim();

  if (!trimmedNewId && !trimmedNewPassword) {
    return sendError(res, "Please provide a new Admin ID or new password to update.", 400);
  }

  try {
    const admin = await Admin.findById(req.admin._id).select("+password");
    if (!admin) {
      return sendError(res, "Admin account not found.", 404);
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, "Current password is incorrect.", 400);
    }

    if (trimmedNewId) {
      if (trimmedNewId.length < 3) {
        return sendError(res, "Admin ID must be at least 3 characters long.", 400);
      }
      const existing = await Admin.findOne({
        adminId: trimmedNewId,
        _id: { $ne: admin._id },
      });
      if (existing) {
        return sendError(res, "This Admin ID is already taken.", 400);
      }
      admin.adminId = trimmedNewId;
    }

    if (trimmedNewPassword) {
      if (trimmedNewPassword.length < 6) {
        return sendError(res, "New password must be at least 6 characters long.", 400);
      }
      admin.password = trimmedNewPassword;
    }

    await admin.save();

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
        message: "Admin credentials updated successfully!",
        token,
        admin: {
          id: admin._id,
          adminId: admin.adminId,
          name: admin.name || "Admin",
          email: admin.email,
        },
      });
  } catch (error) {
    return sendError(res, error.message || "Failed to update credentials.", 500);
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
