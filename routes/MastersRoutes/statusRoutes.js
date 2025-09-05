import express from "express";
import {
  createStatus,
  fetchAllStatus,
  getStatusById,
  updateStatus,
  deleteStatus
} from "../../controllers/MastersController/statusController.js";

const router = express.Router();

router.post("/", createStatus);
router.get("/", fetchAllStatus);
router.get("/:id", getStatusById);
router.put("/:id", updateStatus);
router.delete("/:id", deleteStatus);

export default router;
