import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

// إعداد Cloudinary بمفاتيح من .env
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
});

// اختبار الاتصال (اختياري)
export async function testCloudinaryConnection() {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary متصل:", result.status);
    return true;
  } catch (error) {
    console.error("❌ فشل الاتصال بـ Cloudinary:", error.message);
    return false;
  }
}

export default cloudinary;
