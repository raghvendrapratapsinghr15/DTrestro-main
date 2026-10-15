import mongoose from "mongoose";
import validator from "validator";

const reservationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name must contain at least 3 characters!"],
      maxLength: [30, "First name cannot exceed 30 characters!"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "Last name must contain at least 3 characters!"],
      maxLength: [30, "Last name cannot exceed 30 characters!"],
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Provide a valid email!"],
    },
    phone: {
      type: String,
      required: true,
      minLength: [10, "Phone number must contain at least 10 digits!"],
      maxLength: [15, "Phone number cannot exceed 15 digits!"],
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      default: 1,
      min: [1, "At least 1 guest is required"],
      max: [20, "Maximum 20 guests allowed"],
    },
    specialMessage: {
      type: String,
      maxLength: [300, "Special message cannot exceed 300 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Reservation = mongoose.model("Reservation", reservationSchema);