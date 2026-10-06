import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts — تُحمّل مباشرة (لأنها أساسية)
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// مكونات الحماية
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminRouteOnly from "./components/admin/AdminRouteOnly";

// صفحات عامة — Lazy Loading
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// صفحات محمية — Lazy
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));

// صفحات الإدارة — Lazy
const AdminDashboardPage = lazy(
  () => import("./pages/admin/AdminDashboardPage"),
);
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const AdminOrderDetailsPage = lazy(
  () => import("./pages/admin/AdminOrderDetailsPage"),
);
const AdminProductsPage = lazy(() => import("./pages/admin/AdminProductsPage"));
const AdminProductFormPage = lazy(
  () => import("./pages/admin/AdminProductFormPage"),
);
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));

// شاشة تحميل بسيطة
function PageLoader() {
  return (
    <div style={{ padding: "4rem", textAlign: "center", color: "#666" }}>
      ⏳ جاري التحميل...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* المسارات العامة */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* مسارات الإدارة */}
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
                path="/admin/products/:id/edit"
                element={<AdminProductFormPage />}
              />

              <Route element={<AdminRouteOnly />}>
                <Route
                  path="/admin/products/new"
                  element={<AdminProductFormPage />}
                />
                <Route path="/admin/users" element={<AdminUsersPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
