import { Router } from "express";

const router = Router();

// مسار فحص صحة الخادم
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "خادم نَبْتة يعمل",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
