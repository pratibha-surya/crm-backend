import express from "express";
import { getCategories, createCategory, deleteCategory } from "../controllers/category.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validateCategoryPayload } from "../validators/module.validators.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getCategories)
  .post(validateCategoryPayload, createCategory);

router.route("/:id")
  .delete(deleteCategory);

export default router;
