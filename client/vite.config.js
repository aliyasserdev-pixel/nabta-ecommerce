import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },

  build: {
    // حجم التنبيه (KB)
    chunkSizeWarningLimit: 1000,

    // تقسيم الـ bundle لتحسين التحميل
    rollupOptions: {
      output: {
        manualChunks: {
          // React في chunk منفصل
          "react-vendor": ["react", "react-dom", "react-router-dom"],
        },
      },
    },

    // تحسين الإنتاج
    minify: "esbuild",
    sourcemap: false,
  },

  // تحسين الأداء في التطوير
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
