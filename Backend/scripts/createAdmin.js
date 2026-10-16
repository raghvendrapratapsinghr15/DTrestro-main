/**
 * DT Restro — Admin Account Setup Script
 * Run this script to create or reset your admin credentials using .env or manual input.
 *
 * Usage:
 *   cd Backend
 *   npm run create-admin
 */

import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

import dns from "node:dns";
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

import mongoose from "mongoose";
import readline from "readline";
import { Admin } from "../models/adminSchema.js";

await mongoose.connect(process.env.MONGO_URL, { dbName: "dtrestro" });
console.log("\n✅ Connected to MongoDB\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

console.log("══════════════════════════════════════");
console.log("   DT Restro — Admin Account Setup    ");
console.log("══════════════════════════════════════\n");

const defaultId = process.env.ADMIN_ID || "admin";
const defaultPass = process.env.ADMIN_PASSWORD || "Admin@12345";

const useEnv = await ask(`Use credentials configured in .env (ID: "${defaultId}")? (yes/no) [yes]: `);

let adminId = defaultId;
let password = defaultPass;

if (useEnv.trim().toLowerCase() === "no") {
  adminId = (await ask(`Enter Admin ID [${defaultId}]: `)).trim() || defaultId;
  password = (await ask(`Enter Admin Password: `)).trim();
}

if (!adminId || !password) {
  console.error("\n❌ Admin ID and Password are required. Exiting.\n");
  rl.close();
  await mongoose.disconnect();
  process.exit(1);
}

if (password.length < 6) {
  console.error("\n❌ Password must be at least 6 characters. Exiting.\n");
  rl.close();
  await mongoose.disconnect();
  process.exit(1);
}

// Remove any existing admin accounts so only the single authorized owner exists
const existingCount = await Admin.countDocuments();
if (existingCount > 0) {
  const confirm = await ask(`\n⚠️  ${existingCount} existing admin account(s) found. Reset to this authorized owner? (yes/no) [yes]: `);
  if (confirm.trim().toLowerCase() !== "no") {
    await Admin.deleteMany({});
    console.log("🗑️  Previous admin records cleared.\n");
  }
}

const admin = new Admin({
  adminId,
  name: "Authorized Admin",
  email: adminId.includes("@") ? adminId : `${adminId}@dtrestro.com`,
  password,
});
await admin.save();

console.log("\n══════════════════════════════════════");
console.log("✅ Admin account configured successfully!");
console.log("══════════════════════════════════════");
console.log(`   Admin ID : ${adminId}`);
console.log(`   Pass     : ${"*".repeat(password.length)}`);
console.log("\n🔑 Login at: http://localhost:5173/admin/login\n");

rl.close();
await mongoose.disconnect();
