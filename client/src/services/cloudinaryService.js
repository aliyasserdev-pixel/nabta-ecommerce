// خدمة رفع الصور إلى Cloudinary (unsigned)

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.warn("⚠️ Cloudinary غير مُعَدّ. تأكد من .env (VITE_CLOUDINARY_*)");
}

// حدود التحقق
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const cloudinaryService = {
  // رفع صورة واحدة
  async uploadImage(file) {
    // تحقق
    if (!file) throw new Error("لم يتم اختيار ملف");

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("نوع الملف غير مدعوم (JPG, PNG, WEBP فقط)");
    }

    if (file.size > MAX_SIZE) {
      throw new Error("حجم الملف كبير جدًا (5 MB كحد أقصى)");
    }

    // بناء الـ FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "nabta/products");

    // الرفع إلى Cloudinary
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "فشل رفع الصورة");
    }

    // أعد رابط الصورة
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    };
  },
};
