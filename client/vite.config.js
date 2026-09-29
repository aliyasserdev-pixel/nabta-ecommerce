import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// إعدادات Vite للـ Frontend
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // توجيه طلبات API إلى الـ Backend أثناء التطوير
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
