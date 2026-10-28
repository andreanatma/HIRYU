import bcrypt from "bcryptjs";
import { randomBytes, timingSafeEqual } from "crypto";
import { z } from "zod";

const COST = 12;
// Hash dummy untuk menyamakan waktu respons saat email tidak ditemukan.
const DUMMY_HASH = "$2a$12$CwTycUXWue0Thq9StjUM0uJ8.4m3Zk0lq3p0b7y0dQ0sQy5m0vH2K";

export const hashPassword = (p: string) => bcrypt.hash(p, COST);
export const verifyPassword = (p: string, hash: string | null | undefined) => bcrypt.compare(p, hash ?? DUMMY_HASH);

export const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/[0-9]/, "Password must contain a number");

export function generateTempPassword(): string {
  return randomBytes(12).toString("base64url") + "9a";
}

export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}
