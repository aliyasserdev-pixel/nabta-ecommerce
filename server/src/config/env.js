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

export const env = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
  isProduction: process.env.NODE_ENV === "production",
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
