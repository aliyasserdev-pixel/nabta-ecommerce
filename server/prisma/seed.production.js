import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء إعداد حسابك...");

  // ⚠️ غيّر هذه القيم
  const YOUR_NAME = "aliyasser";
  const YOUR_EMAIL = "aliyasser.dev@gmail.com";
  const YOUR_PHONE = "+249128742152";
  const YOUR_PASSWORD = "V7#qL2@zN9!rX4$k"; // ⚠️ غيّرها

  // 1. التحقق: هل الحساب موجود؟
  const existing = await prisma.user.findUnique({
    where: { email: YOUR_EMAIL },
  });

  if (existing) {
    console.log("ℹ️ الحساب موجود بالفعل:", existing.email);
    console.log("   الدور:", existing.role);
    process.exit(0);
  }

  // 2. تشفير كلمة المرور
  const passwordHash = await bcrypt.hash(YOUR_PASSWORD, 12);

  // 3. إنشاء الأدمن
  const admin = await prisma.user.create({
    data: {
      name: YOUR_NAME,
      email: YOUR_EMAIL,
      phone: YOUR_PHONE,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("✅ تم إنشاء حسابك:");
  console.log("   Name:  ", admin.name);
  console.log("   Email: ", admin.email);
  console.log("   Role:  ", admin.role);
  console.log("");
  console.log("🔐 كلمة المرور: ما وضعتها في الكود");
  console.log("⚠️  احتفظ بها في مكان آمن");
}

main()
  .catch((e) => {
    console.error("❌ خطأ:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
