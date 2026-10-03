import { prisma } from "../config/prisma.js";

async function testConnection() {
  try {
    console.log("⏳ جاري الاتصال بقاعدة البيانات...");
    await prisma.$connect();
    console.log("✅ الاتصال بقاعدة البيانات ناجح");

    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();

    console.log(`📊 المستخدمون: ${userCount}`);
    console.log(`📦 المنتجات: ${productCount}`);
  } catch (error) {
    console.error("❌ فشل الاتصال:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
