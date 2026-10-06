# 🌱 نَبْتة — متجر الزراعة المنزلية

متجر إلكتروني عربي متخصص في مستلزمات الزراعة المنزلية.

---

## 📖 عن المشروع

**نَبْتة** متجر Full-Stack يهدف إلى تمكين الزراعة المنزلية في السودان والمنطقة العربية.

**التقنيات**:
- Frontend: React 19 + Vite + React Router
- Backend: Node.js + Express + Prisma
- Database: PostgreSQL (Neon)

---

## ✨ المميزات

### للعملاء
- تصفح المنتجات مع بحث وفلترة
- سلة تسوق محفوظة محليًا
- تسجيل حساب ودخول آمن
- إنشاء طلبات ومتابعتها

### للإدارة
- لوحة تحكم مع إحصائيات
- إدارة الطلبات والمنتجات
- إدارة المستخدمين والصلاحيات

### الأمان
- كلمات مرور مشفرة بـ bcrypt
- HttpOnly Cookies + JWT
- Rate Limiting + Input Sanitization
- Helmet Headers

---

## 🚀 التثبيت

### المتطلبات
- Node.js 18+
- PostgreSQL (محلي أو [Neon](https://neon.tech))

### 1) Backend

\`\`\`bash
cd server
npm install
cp .env.example .env
# عدّل .env
npx prisma migrate dev
npx prisma db seed
npm run dev
\`\`\`

### 2) Frontend

\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

---

## 👤 حسابات الاختبار

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| مدير | `admin@nabta.com` | `Admin@123` |
| مساعد | `assistant@nabta.com` | `Admin@123` |
| عميل | `customer@nabta.com` | `Admin@123` |

**⚠️ غيّر هذه الحسابات في الإنتاج.**

---

## 📡 API

### المصادقة
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### المنتجات
- `GET /api/products`
- `GET /api/products/:slug`
- `GET /api/products/featured`

### التصنيفات
- `GET /api/categories`
- `GET /api/categories/:slug`

### الطلبات
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders/:id/cancel`

### الإدارة
- `GET /api/admin/stats`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `GET /api/admin/users`

---

## 🔐 الصلاحيات

| الميزة | Customer | Assistant | Admin |
|--------|----------|-----------|-------|
| الشراء | ✅ | ✅ | ✅ |
| تحديث حالة طلب | ❌ | ✅ | ✅ |
| إضافة منتج | ❌ | ❌ | ✅ |
| تعديل منتج | ❌ | ✅ | ✅ |
| حذف منتج | ❌ | ❌ | ✅ |
| إدارة المستخدمين | ❌ | ❌ | ✅ |

---

## 🚀 Deploy

- **Frontend**: [Vercel](https://vercel.com)
- **Backend**: [Render](https://render.com)
- **Database**: [Neon](https://neon.tech)

---

## 📝 الترخيص

MIT License

---

**صُنع بـ ❤️ في السودان**