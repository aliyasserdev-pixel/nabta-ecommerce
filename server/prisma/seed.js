import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء إدخال البيانات التجريبية...");

  // 1. حذف البيانات القديمة (لإعادة التشغيل النظيف)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️ تم حذف البيانات القديمة");

  // 2. المستخدمين
  const passwordHash = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "مدير نبتة",
      email: "admin@nabta.com",
      phone: "+249900000001",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "مساعد نبتة",
      email: "assistant@nabta.com",
      phone: "+249900000002",
      passwordHash,
      role: "ASSISTANT",
    },
  });

  await prisma.user.create({
    data: {
      name: "عميل تجريبي",
      email: "customer@nabta.com",
      phone: "+249900000003",
      passwordHash,
      role: "CUSTOMER",
    },
  });

  console.log("👤 تم إنشاء 3 مستخدمين");

  // 3. التصنيفات
  const categoriesData = [
    {
      slug: "seedlings",
      name: "شتول",
      description: "شتول جاهزة للزراعة",
      icon: "🌿",
      color: "#d8f3dc",
      sortOrder: 1,
    },
    {
      slug: "seeds",
      name: "بذور",
      description: "بذور متنوعة عالية الجودة",
      icon: "🌱",
      color: "#fef3c7",
      sortOrder: 2,
    },
    {
      slug: "soil",
      name: "تربة",
      description: "تربة معدة للزراعة المنزلية",
      icon: "🪴",
      color: "#e0e7ff",
      sortOrder: 3,
    },
    {
      slug: "fertilizers",
      name: "أسمدة",
      description: "أسمدة عضوية وآمنة",
      icon: "💧",
      color: "#cffafe",
      sortOrder: 4,
    },
    {
      slug: "tools",
      name: "أدوات",
      description: "أدوات زراعة منزلية",
      icon: "🛠️",
      color: "#fce7f3",
      sortOrder: 5,
    },
    {
      slug: "pots",
      name: "أصص",
      description: "أصص وأوعية زراعة",
      icon: "🏺",
      color: "#fed7aa",
      sortOrder: 6,
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.create({ data: cat });
  }

  console.log(`📂 تم إنشاء ${Object.keys(categories).length} تصنيفات`);

  // 4. المنتجات
  const productsData = [
    {
      slug: "tomato-seeds",
      name: "بذور طماطم بلدي",
      categorySlug: "seeds",
      price: 1500,
      oldPrice: 2000,
      stock: 50,
      rating: 4.8,
      isFeatured: true,
    },
    {
      slug: "mint-seedling",
      name: "شتلة نعناع طازج",
      categorySlug: "seedlings",
      price: 2500,
      stock: 20,
      rating: 4.6,
      isFeatured: true,
    },
    {
      slug: "organic-soil-5kg",
      name: "تربة عضوية 5 كجم",
      categorySlug: "soil",
      price: 3500,
      oldPrice: 4000,
      stock: 15,
      rating: 4.9,
      isFeatured: true,
    },
    {
      slug: "organic-fertilizer-1kg",
      name: "سماد عضوي 1 كجم",
      categorySlug: "fertilizers",
      price: 2800,
      stock: 30,
      rating: 4.7,
      isFeatured: true,
    },
    {
      slug: "watering-can",
      name: "مرش ماء يدوي",
      categorySlug: "tools",
      price: 4500,
      oldPrice: 5500,
      stock: 8,
      rating: 4.5,
    },
    {
      slug: "clay-pot-medium",
      name: "أصيص فخار متوسط",
      categorySlug: "pots",
      price: 3200,
      stock: 25,
      rating: 4.4,
    },
    {
      slug: "cucumber-seeds",
      name: "بذور خيار هجين",
      categorySlug: "seeds",
      price: 1800,
      oldPrice: 2200,
      stock: 40,
      rating: 4.6,
    },
    {
      slug: "basil-seedling",
      name: "شتلة ريحان",
      categorySlug: "seedlings",
      price: 2200,
      stock: 0,
      rating: 4.8,
    },
  ];

  for (const p of productsData) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        description: `منتج عالي الجودة من نبتة — ${p.name} مناسب للزراعة المنزلية.`,
        shortDesc: p.name,
        price: p.price,
        oldPrice: p.oldPrice || null,
        stock: p.stock,
        rating: p.rating,
        isFeatured: p.isFeatured || false,
        categoryId: categories[p.categorySlug].id,
      },
    });
  }

  console.log(`📦 تم إنشاء ${productsData.length} منتجات`);
  console.log("✅ تم إدخال البيانات التجريبية بنجاح");
  console.log("");
  console.log("📧 حسابات تجريبية:");
  console.log("   Admin:     admin@nabta.com / Admin@123");
  console.log("   Assistant: assistant@nabta.com / Admin@123");
  console.log("   Customer:  customer@nabta.com / Admin@123");
}

main()
  .catch((e) => {
    console.error("❌ خطأ في Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
