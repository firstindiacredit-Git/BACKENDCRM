import multer from "multer";
export const upload = multer({
  limits: { fileSize: 25 * 1024 * 1024 },
});
