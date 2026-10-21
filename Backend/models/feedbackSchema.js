import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    feedbackId: {
      type: String,
      unique: true,
      index: true,
    },
    userName: {
      type: String,
      default: "Guest Diner",
      trim: true,
      maxLength: [60, "Name cannot exceed 60 characters"],
    },
    userImage: {
      type: String,
      default: "/review_1.png",
      trim: true,
    },
    userExperience: {
      type: String,
      required: [true, "Experience feedback is required!"],
      trim: true,
      minLength: [5, "Experience feedback must contain at least 5 characters!"],
      maxLength: [2000, "Experience feedback cannot exceed 2000 characters!"],
    },
    improvementSuggestions: {
      type: String,
      trim: true,
      maxLength: [2000, "Improvement suggestions cannot exceed 2000 characters!"],
      default: "",
    },
    rating: {
      type: Number,
      required: [true, "Rating is required!"],
      min: [1, "Rating must be at least 1 star!"],
      max: [5, "Rating cannot exceed 5 stars!"],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate unique human-readable Feedback UID before saving
feedbackSchema.pre("save", function () {
  if (!this.feedbackId) {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const timeSuffix = Date.now().toString(36).slice(-4).toUpperCase();
    this.feedbackId = `FB-${timeSuffix}-${randomSuffix}`;
  }
});

export const Feedback = mongoose.model("Feedback", feedbackSchema);
