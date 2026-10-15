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
} from "../controller/admin.js";
import { isAdminAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Public routes ────────────────────────────────────────────
router.get("/check-setup", checkSetup);       // Is any admin created?
router.post("/register",   registerAdmin);    // Public only if 0 admins; else needs auth
router.post("/login",      loginAdmin);
router.get("/logout",      logoutAdmin);

// ── Protected admin routes ───────────────────────────────────
router.get("/stats",                      isAdminAuthenticated, getDashboardStats);
router.get("/reservations",               isAdminAuthenticated, getAllReservations);
router.get("/reservations/:id",           isAdminAuthenticated, getSingleReservation);
router.put("/reservations/:id/status",    isAdminAuthenticated, updateReservationStatus);
router.delete("/reservations/:id",        isAdminAuthenticated, deleteReservation);

export default router;
