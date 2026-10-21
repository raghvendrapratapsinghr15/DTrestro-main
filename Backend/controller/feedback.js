import Errorhandler from "../error/error.js";
import { Feedback } from "../models/feedbackSchema.js";

// Helper to send error response safely
const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message });
};

// ─── 1. SUBMIT FEEDBACK (PUBLIC) ─────────────────────────────────────────────
export const submitFeedback = async (req, res, next) => {
  try {
    const {
      userExperience,
      improvementSuggestions,
      rating,
      userName,
      userImage,
    } = req.body;

    // Validation
    if (!userExperience || !userExperience.trim()) {
      return sendError(res, "Please describe your experience in the feedback box.", 400);
    }

    if (userExperience.trim().length < 5) {
      return sendError(res, "Experience feedback must contain at least 5 characters.", 400);
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return sendError(res, "Please select a valid rating between 1 and 5 stars.", 400);
    }

    // Generate unique feedback UID
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const timeSuffix = Date.now().toString(36).slice(-4).toUpperCase();
    const feedbackId = `FB-${timeSuffix}-${randomSuffix}`;

    // Default avatars if not provided
    const avatarList = [
      "/review_1.png",
      "/review_2.png",
      "/review_3.png",
    ];
    const resolvedImage =
      userImage && userImage.trim()
        ? userImage.trim()
        : avatarList[Math.floor(Math.random() * avatarList.length)];

    const newFeedback = await Feedback.create({
      feedbackId,
      userName: userName && userName.trim() ? userName.trim() : "Guest Diner",
      userImage: resolvedImage,
      userExperience: userExperience.trim(),
      improvementSuggestions: improvementSuggestions ? improvementSuggestions.trim() : "",
      rating: numericRating,
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! Your feedback has been submitted successfully.",
      feedback: newFeedback,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return sendError(res, messages.join(", "), 400);
    }
    return sendError(res, error.message || "Failed to submit feedback.", 500);
  }
};

// ─── 2. GET ALL FEEDBACK (ADMIN PROTECTED) ────────────────────────────────────
export const getAllFeedback = async (req, res, next) => {
  try {
    const {
      rating,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Filter by star rating
    if (rating && rating !== "All" && rating !== "all") {
      const parsedRating = Number(rating);
      if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
        query.rating = parsedRating;
      }
    }

    // Search by UID, userExperience, improvementSuggestions, userName
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { feedbackId: regex },
        { userName: regex },
        { userExperience: regex },
        { improvementSuggestions: regex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const [feedbacks, total] = await Promise.all([
      Feedback.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Feedback.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json({
      success: true,
      total,
      totalPages,
      currentPage: pageNum,
      feedbacks,
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve feedback records.", 500);
  }
};

// ─── 3. GET FEEDBACK STATS (ADMIN PROTECTED) ──────────────────────────────────
export const getFeedbackStats = async (req, res, next) => {
  try {
    const total = await Feedback.countDocuments();

    // Aggregation for rating breakdown and average
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalScore = 0;

    stats.forEach((item) => {
      if (item._id >= 1 && item._id <= 5) {
        ratingCounts[item._id] = item.count;
        totalScore += item._id * item.count;
      }
    });

    const averageRating = total > 0 ? (totalScore / total).toFixed(1) : "0.0";

    return res.status(200).json({
      success: true,
      stats: {
        totalFeedback: total,
        averageRating: Number(averageRating),
        breakdown: {
          fiveStar: ratingCounts[5],
          fourStar: ratingCounts[4],
          threeStar: ratingCounts[3],
          twoStar: ratingCounts[2],
          oneStar: ratingCounts[1],
        },
      },
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to calculate feedback statistics.", 500);
  }
};

// ─── 4. DELETE FEEDBACK (ADMIN PROTECTED) ─────────────────────────────────────
export const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return sendError(res, "Feedback record not found.", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to delete feedback.", 500);
  }
};

// ─── 5. PUBLIC RECENT FEEDBACK (OPTIONAL) ─────────────────────────────────────
export const getPublicRecentFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ rating: { $gte: 4 } })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    return res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to load recent feedback.", 500);
  }
};
