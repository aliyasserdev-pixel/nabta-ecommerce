import { useEffect } from "react";

// Hook لتغيير عنوان الصفحة (tab) + meta description
export function useDocumentTitle(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title
      ? `${title} | نَبْتة`
      : "نَبْتة | متجر الزراعة المنزلية";

    let metaEl = document.querySelector('meta[name="description"]');
    const prevDescription = metaEl?.getAttribute("content");

    if (description && metaEl) {
      metaEl.setAttribute("content", description);
    }

    return () => {
      document.title = prevTitle;
      if (metaEl && prevDescription) {
        metaEl.setAttribute("content", prevDescription);
      }
    };
  }, [title, description]);
}
