import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// إعدادات أساسية
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// قراءة Cookies
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

// المسارات
app.use("/api/health", healthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes); 

// 404
app.use(notFoundHandler);

// معالج الأخطاء
app.use(errorHandler);

export default app;
