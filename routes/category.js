import express from "express";
import {
  addProductToSubCategory,
  createMainCategory,
  createSubCategory,
  getMainCategories,
  getSubCategories,
} from "../controllers/category.js";
import multer from "multer";

const router = express.Router();

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/category");
  },
  filename: (req, file, cb) => {
    cb(null, "cat" + Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

router.get("/", getMainCategories);

router.post("/create", upload.single("image"), createMainCategory);

router.post("/sub", getSubCategories);

router.post("/sub/create", upload.single("image"), createSubCategory);

router.post("/sub/add", addProductToSubCategory);

export default router;
