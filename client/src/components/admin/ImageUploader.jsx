import { useState, useRef } from "react";
import { cloudinaryService } from "../../services/cloudinaryService";
import styles from "./ImageUploader.module.css";

export default function ImageUploader({ currentUrl, onUploaded, disabled }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const result = await cloudinaryService.uploadImage(file);
      onUploaded(result.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      // صفّر input حتى يمكن اختيار نفس الملف مرة أخرى
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={styles.wrap}>
      {currentUrl ? (
        <div className={styles.preview}>
          <img src={currentUrl} alt="صورة المنتج" className={styles.image} />
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.changeBtn}
              onClick={() => inputRef.current?.click()}
              disabled={uploading || disabled}
            >
              {uploading ? "⏳ جاري الرفع..." : "تغيير الصورة"}
            </button>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => onUploaded(null)}
              disabled={uploading || disabled}
            >
              حذف
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.placeholder}>
          <div className={styles.icon}>📷</div>
          <p className={styles.text}>لا توجد صورة</p>
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => inputRef.current?.click()}
            disabled={uploading || disabled}
          >
            {uploading ? "⏳ جاري الرفع..." : "اختر صورة"}
          </button>
          <p className={styles.hint}>JPG, PNG, WEBP — حجم أقصى 5 MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className={styles.fileInput}
        disabled={disabled}
      />

      {error && <div className={styles.error}>⚠️ {error}</div>}
    </div>
  );
}
