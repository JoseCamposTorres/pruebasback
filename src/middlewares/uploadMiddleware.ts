import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const uniqueId = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, `${uniqueId}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = /jpg|jpeg|png|webp/;
    const isValid = allowedExtensions.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (!isValid) {
      return cb(new Error("Formato de archivo no válido. Use JPG, PNG o WebP."));
    }

    cb(null, true);
  },
});
