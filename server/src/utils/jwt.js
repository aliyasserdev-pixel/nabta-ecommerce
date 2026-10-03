import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// توليد توكن JWT
export function generateToken(payload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

// التحقق من التوكن
export function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch (error) {
    return null;
  }
}
