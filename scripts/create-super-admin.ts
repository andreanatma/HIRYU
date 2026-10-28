import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createInterface } from "readline/promises";

// Penggunaan: npm run admin:create  (interaktif; kata sandi tidak masuk riwayat shell)
async function main() {
  const prisma = new PrismaClient();
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const name = (await rl.question("Name: ")).trim();
  const email = (await rl.question("Email: ")).trim().toLowerCase();
  const pw = await rl.question("Password (min. 10 characters, letters+numbers): ");
  rl.close();
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || pw.length < 10 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) throw new Error("Invalid input.");
  if (await prisma.user.findUnique({ where: { email } })) throw new Error("Email already registered.");
  await prisma.user.create({ data: { name, email, passwordHash: await bcrypt.hash(pw, 12), role: "SUPER_ADMIN" } });
  console.log("Super Admin created:", email);
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e.message); process.exit(1); });
