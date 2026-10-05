import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages عامة
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

// Pages محمية (تحتاج تسجيل دخول)
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";

// Pages الإدارة
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminProductFormPage from "./pages/admin/AdminProductFormPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

// مكونات الحماية
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminRouteOnly from "./components/admin/AdminRouteOnly";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============ المسارات العامة (MainLayout) ============ */}
        <Route element={<MainLayout />}>
          {/* صفحات عامة */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* المصادقة */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* صفحات محمية (تحتاج تسجيل دخول) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ============ مسارات الإدارة (AdminLayout) ============ */}
        <Route element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route
              path="/admin/orders/:id"
              element={<AdminOrderDetailsPage />}
            />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route
              path="/admin/products/new"
              element={<AdminProductFormPage />}
            />
            <Route
              path="/admin/products/:id/edit"
              element={<AdminProductFormPage />}
            />

            {/* Admin فقط (ليس Assistant) */}
            <Route element={<AdminRouteOnly />}>
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
