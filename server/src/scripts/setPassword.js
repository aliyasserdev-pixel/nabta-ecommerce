import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";

// ⚠️ غيّر هذه القيم
const EMAIL = "aliyasser.dev@gmail.com";
const NEW_PASSWORD = "Ali_BigBoss#47Dev!92";

async function updatePassword() {
  try {
    // تحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { email: EMAIL },
    });

    if (!user) {
      console.error("❌ المستخدم غير موجود:", EMAIL);
      process.exit(1);
    }

    // تشفير كلمة المرور الجديدة
    const passwordHash = await bcrypt.hash(NEW_PASSWORD, 10);

    // تحديث
    await prisma.user.update({
      where: { email: EMAIL },
      data: { passwordHash },
    });

    console.log("✅ تم تحديث كلمة المرور بنجاح لـ:", EMAIL);
    console.log("🔑 كلمة المرور الجديدة:", NEW_PASSWORD);
  } catch (error) {
    console.error("❌ خطأ:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();
