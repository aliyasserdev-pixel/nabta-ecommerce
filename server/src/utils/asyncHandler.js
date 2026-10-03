// يلتقط أي خطأ داخل دالة async ويُمرّره إلى errorHandler
// بدل ما نكتب try/catch في كل controller
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
