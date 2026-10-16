import express from "express";
import {
  checkSetup,
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAllReservations,
  getDashboardStats,
  updateReservationStatus,
  deleteReservation,
  getSingleReservation,
  changeAdminCredentials,
  getAdminProfile,
} from "../controller/admin.js";
import { isAdminAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Public routes ────────────────────────────────────────────
router.get("/check-setup", checkSetup);       // Registration status (disabled)
router.post("/register",   registerAdmin);    // Disabled (returns 403 Forbidden)
router.post("/login",      loginAdmin);       // Admin login
router.get("/logout",      logoutAdmin);      // Admin logout

// ── Protected admin routes ───────────────────────────────────
router.get("/me",                         isAdminAuthenticated, getAdminProfile);
router.put("/change-credentials",         isAdminAuthenticated, changeAdminCredentials);
router.get("/stats",                      isAdminAuthenticated, getDashboardStats);
router.get("/reservations",               isAdminAuthenticated, getAllReservations);
router.get("/reservations/:id",           isAdminAuthenticated, getSingleReservation);
router.put("/reservations/:id/status",    isAdminAuthenticated, updateReservationStatus);
router.delete("/reservations/:id",        isAdminAuthenticated, deleteReservation);

export default router;
