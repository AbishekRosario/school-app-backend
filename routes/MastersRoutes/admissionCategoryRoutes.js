import express from "express";
import {
  createAdmissionCategory,
  fetchAllAdmissionCategories,
  getAdmissionCategoryById,
  updateAdmissionCategory,
  deleteAdmissionCategory
} from "../../controllers/MastersController/admissionCategoryController.js";

const router = express.Router();

router.post("/", createAdmissionCategory);
router.get("/", fetchAllAdmissionCategories);
router.get("/:id", getAdmissionCategoryById);
router.put("/:id", updateAdmissionCategory);
router.delete("/:id", deleteAdmissionCategory);

export default router;
