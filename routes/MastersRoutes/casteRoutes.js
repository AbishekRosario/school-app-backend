import express from "express";
import {
  createCaste,
  fetchAllCastes,
  getCasteById,
  updateCaste,
  deleteCaste
} from "../../controllers/MastersController/casteController.js";

const router = express.Router();

router.post("/", createCaste);
router.get("/", fetchAllCastes);
router.get("/:id", getCasteById);
router.put("/:id", updateCaste);
router.delete("/:id", deleteCaste);

export default router;
