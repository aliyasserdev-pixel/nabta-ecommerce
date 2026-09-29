// 1. استدعاء المكتبات اللي ثبتناها
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// 2. إنشاء تطبيق Express
const app = express();
const PORT = process.env.PORT || 5000; // هنشتغل على بورت 5000

// 3. تفعيل الإعدادات الأساسية
app.use(cors()); // عشان نسمح للـ React إنه يتواصل معانا
app.use(express.json()); // عشان نقدر نقرأ البيانات اللي جاية بصيغة JSON

// 4. إنشاء مسار تجريبي (Test Route)
app.get("/", (req, res) => {
  res.send("الخادم يعمل بنجاح! 🚀");
});

// 5. تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
