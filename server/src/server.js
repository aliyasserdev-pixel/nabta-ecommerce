import app from "./app.js";
import { env } from "./config/env.js";

// بدء تشغيل الخادم
const server = app.listen(env.port, () => {
  console.log(`🌱 خادم نَبْتة يعمل على المنفذ ${env.port}`);
  console.log(`   البيئة: ${env.nodeEnv}`);
  console.log(`   الرابط: http://localhost:${env.port}`);
});

// إغلاق الخادم بأمان عند إيقاف العملية
process.on("SIGTERM", () => {
  console.log("🛑 إيقاف الخادم...");
  server.close(() => {
    console.log("✅ تم إيقاف الخادم بنجاح");
    process.exit(0);
  });
});
