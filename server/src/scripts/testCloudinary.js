import { testCloudinaryConnection } from "../config/cloudinary.js";

async function run() {
  console.log("⏳ جاري اختبار الاتصال بـ Cloudinary...");
  const success = await testCloudinaryConnection();
  if (success) {
    console.log("🎉 كل شيء جاهز");
  }
  process.exit(success ? 0 : 1);
}

run();
