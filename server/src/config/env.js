import dotenv from "dotenv";

// تحميل متغيرات البيئة من ملف .env
dotenv.config();

// التحقق من وجود المتغيرات المطلوبة
const requiredEnvVars = ["PORT", "NODE_ENV", "CLIENT_URL"];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`❌ متغير البيئة المطلوب غير موجود: ${key}`);
    process.exit(1);
  }
}

export const env = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
  isProduction: process.env.NODE_ENV === "production",
};
