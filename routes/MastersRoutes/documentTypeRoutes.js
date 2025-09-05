import express from "express";
import {
  createDocumentType,
  fetchAllDocumentTypes,
  getDocumentTypeById,
  updateDocumentType,
  deleteDocumentType
} from "../../controllers/MastersController/documentTypeController.js";

const router = express.Router();

router.post("/", createDocumentType);
router.get("/", fetchAllDocumentTypes);
router.get("/:id", getDocumentTypeById);
router.put("/:id", updateDocumentType);
router.delete("/:id", deleteDocumentType);

export default router;
