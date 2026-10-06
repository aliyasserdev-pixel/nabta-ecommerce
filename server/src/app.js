import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import healthRoutes from "./routes/health.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { sanitizeInputs } from "./middleware/sanitize.js";

const app = express();

// إخفاء هوية الخادم
app.disable("x-powered-by");

// ===== رؤوس الأمان (Helmet) =====
app.use(
  helmet({
    contentSecurityPolicy: env.isProduction ? undefined : false,
    crossOriginEmbedderPolicy: false,
  }),
);

// ===== Body Parser =====
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ===== Cookie Parser =====
app.use(cookieParser());

// ===== CORS =====
const corsOptions = {
  origin: env.clientUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // 24 ساعة
};

app.use(sanitizeInputs);
app.use(cors(corsOptions));

// ===== Rate Limiting العام =====
app.use("/api", generalLimiter);

// ===== المسارات =====
app.use("/api/health", healthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ===== 404 =====
app.use(notFoundHandler);

// ===== معالج الأخطاء =====
app.use(errorHandler);

export default app;
