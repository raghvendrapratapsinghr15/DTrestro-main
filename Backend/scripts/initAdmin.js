import { Admin } from "../models/adminSchema.js";

/**
 * Initializes the authorized admin account using ADMIN_ID and ADMIN_PASSWORD configured in .env.
 * If an admin with adminId already exists, it is preserved so changes made via the dashboard remain permanent.
 */
export const initAdminAccount = async () => {
  try {
    const adminId = (process.env.ADMIN_ID || "admin").trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

    // Check if an authorized admin account already exists
    const existingAdmin = await Admin.findOne({
      adminId: { $exists: true, $ne: null, $ne: "" },
    });

    if (existingAdmin) {
      // Admin account already configured; preserve existing credentials (including any dashboard updates)
      return;
    }

    // Clean up any old unkeyed/legacy public signups
    const totalAdmins = await Admin.countDocuments();
    if (totalAdmins > 0) {
      await Admin.deleteMany({});
      console.log("🧹 Cleared legacy public admin accounts for security.");
    }

    // Create the initial admin account with fixed credentials from .env
    const initialAdmin = new Admin({
      adminId,
      name: "Owner Admin",
      email: adminId.includes("@") ? adminId : `${adminId}@dtrestro.com`,
      password: adminPassword,
    });

    await initialAdmin.save();
    console.log(`\n======================================================`);
    console.log(`✅ Initial Admin Account Initialized:`);
    console.log(`   Admin ID : ${adminId}`);
    console.log(`   Password : [configured in .env]`);
    console.log(`======================================================\n`);
  } catch (error) {
    console.error("⚠️ Failed to initialize admin account:", error.message);
  }
};
