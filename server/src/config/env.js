import dotenv from "dotenv";

dotenv.config();

// المتغيرات المطلوبة
const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "CLIENT_URL",
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`❌ متغير البيئة المطلوب غير موجود: ${key}`);
    process.exit(1);
  }
}

const isProduction = process.env.NODE_ENV === "production";

// ⚠️ تحقق أمني: JWT_SECRET يجب أن يكون قويًا في الإنتاج
if (isProduction && process.env.JWT_SECRET.length < 32) {
  console.error("❌ JWT_SECRET يجب أن يكون 32 حرفًا على الأقل في الإنتاج");
  process.exit(1);
}

// ⚠️ تحقق أمني: يجب استخدام HTTPS cookies في الإنتاج
if (isProduction && process.env.COOKIE_SECURE !== "true") {
  console.error("❌ COOKIE_SECURE يجب أن يكون true في الإنتاج");
  process.exit(1);
}

export const env = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
  isProduction,
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  cookie: {
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SAME_SITE || "lax",
  },
};
