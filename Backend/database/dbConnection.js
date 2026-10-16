import mongoose from "mongoose";
import dns from "node:dns";

// Ensure MongoDB Atlas SRV records resolve smoothly on Windows / local router DNS
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // ignore if restricted
}

import { initAdminAccount } from "../scripts/initAdmin.js";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "dtrestro",
    });
    console.log("Connected to database successfully!");
    await initAdminAccount();
  } catch (error) {
    console.log("Database connection error:", error);
  }
};

export default dbConnection;