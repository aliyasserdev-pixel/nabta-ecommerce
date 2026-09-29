import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

// إعدادات أساسية
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// إعداد CORS: نسمح فقط للـ Frontend بالاتصال
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

// المسارات
app.use("/api/health", healthRoutes);

// معالج المسارات غير الموجودة (يجب أن يكون بعد كل المسارات)
app.use(notFoundHandler);

// معالج الأخطاء العام (يجب أن يكون في النهاية)
app.use(errorHandler);

export default app;
