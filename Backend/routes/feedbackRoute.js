import express from "express";
import {
  submitFeedback,
  getAllFeedback,
  getFeedbackStats,
  deleteFeedback,
  getPublicRecentFeedback,
} from "../controller/feedback.js";
import { isAdminAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Public Routes ─────────────────────────────────────────────
router.post("/submit", submitFeedback);
router.get("/recent", getPublicRecentFeedback);

// ── Protected Admin Routes ────────────────────────────────────
router.get("/stats", isAdminAuthenticated, getFeedbackStats);
router.get("/all", isAdminAuthenticated, getAllFeedback);
router.delete("/:id", isAdminAuthenticated, deleteFeedback);

export default router;
