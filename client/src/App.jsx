import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("جاري الاتصال بالخادم...");

  useEffect(() => {
    // بنطلب البيانات من السيرفر (لاحظ إننا ممكن نستخدم مسار تجريبي زي /api/health)
    // لكن حالياً السيرفر عندك مش فيه مسار جذر (/) عشان كده ممكن يضرب 404
    // عشان كده هنجرب نضرب على البورت نفسه ونشوف الرد
    axios
      .get("http://localhost:5000")
      .then((response) => {
        setMessage("تم الاتصال بالسيرفر بنجاح!");
      })
      .catch((error) => {
        console.error("حصل خطأ:", error);
        // لو ضرب 404، ده طبيعي لأن السيرفر مش فيه Route للجذر
        if (error.response && error.response.status === 404) {
          setMessage("السيرفر شغال، بس مفيش Route للصفحة الرئيسية (404).");
        } else {
          setMessage("فشل الاتصال بالخادم!");
        }
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontSize: "24px" }}>
      <h1>تجربة الربط:</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
