import Errorhandler from "../error/error.js";
import { Reservation } from "../models/reservationSchema.js";

export const sendReservation = async (req, res, next) => {
  const { firstName, lastName, email, phone, date, time, guests, specialMessage } = req.body;

  if (!firstName || !lastName || !email || !phone || !date || !time) {
    return next(new Errorhandler("Please fill full reservation form!", 400));
  }

  try {
    await Reservation.create({
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      guests: guests || 1,
      specialMessage: specialMessage || "",
      status: "Pending",
    });

    res.status(200).json({
      success: true,
      message: "Reservation Sent Successfully!",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return next(new Errorhandler(validationErrors.join(", "), 400));
    }
    return next(error);
  }
};