import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { serializeUser } from "../utils/serializeUser.js";

export async function login(req, res) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email: String(email).trim().toLowerCase() } });
  const valid = user && (await bcrypt.compare(String(password), user.password));

  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ role: user.role }, env.jwtSecret, { subject: user.id, expiresIn: "8h" });
  res.json({ token, user: serializeUser(user) });
}

export function currentUser(req, res) {
  res.json({ user: serializeUser(req.user) });
}
