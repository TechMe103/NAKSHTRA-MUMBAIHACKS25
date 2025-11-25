import multer from "multer";
import path from "path";
import fs from "fs";

// ensure upload dir exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

// FILE TYPE VALIDATION (explicit lists)
const allowedExt = [".jpeg", ".jpg", ".png", ".pdf"];
const allowedMime = ["image/jpeg", "image/png", "application/pdf"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const extValid = allowedExt.includes(ext);
  const mimeValid = allowedMime.includes(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, PNG, JPG, JPEG files allowed"));
  }
};

// MULTER INSTANCE
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// convenience exports for route usage, e.g. router.post('/upload', uploadSingle, ...)
export const uploadSingle = (fieldName = "file") => upload.single(fieldName);
