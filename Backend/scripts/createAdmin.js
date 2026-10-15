/**
 * DT Restro — Admin Account Setup Script
 * Run this script once to create or reset your admin credentials.
 *
 * Usage:
 *   cd Backend
 *   node scripts/createAdmin.js
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

// ── Connect to DB ─────────────────────────────────────────────
await mongoose.connect(process.env.MONGO_URL, { dbName: "dtrestro" });
console.log("\n✅  Connected to MongoDB\n");

// ── Prompt helper ─────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

// ── Collect inputs ────────────────────────────────────────────
console.log("══════════════════════════════════════");
console.log("   DT Restro — Admin Account Setup   ");
console.log("══════════════════════════════════════\n");

const name     = await ask("Enter admin name     : ");
const email    = await ask("Enter admin email    : ");
const password = await ask("Enter admin password : ");

if (!name || !email || !password) {
  console.error("\n❌  All fields are required. Exiting.\n");
  process.exit(1);
}

if (password.length < 6) {
  console.error("\n❌  Password must be at least 6 characters. Exiting.\n");
  process.exit(1);
}

// ── Check if admin already exists ─────────────────────────────
const existing = await Admin.findOne({ email });
if (existing) {
  const overwrite = await ask(`\n⚠️  Admin with email "${email}" already exists. Overwrite? (yes/no): `);
  if (overwrite.toLowerCase() !== "yes") {
    console.log("\n❌  Cancelled. No changes made.\n");
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  }
  await Admin.deleteOne({ email });
  console.log("🗑️   Old admin account deleted.\n");
}

// ── Create new admin ──────────────────────────────────────────
await Admin.create({ name, email, password });

console.log("\n══════════════════════════════════════");
console.log("✅  Admin account created successfully!");
console.log("══════════════════════════════════════");
console.log(`   Name  : ${name}`);
console.log(`   Email : ${email}`);
console.log(`   Pass  : ${"*".repeat(password.length)}`);
console.log("\n🔑  Login at: http://localhost:5173/admin/login\n");

rl.close();
await mongoose.disconnect();
