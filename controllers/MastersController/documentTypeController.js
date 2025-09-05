import { DocumentType } from "../../models/MastersModels/documentTypeModel.js";

export const createDocumentType = async (req, res) => {
  try {
    const newDocType = await DocumentType.create(req.body);
    res.status(201).json({ message: "Document Type created", data: newDocType });
  } catch (error) {
    res.status(500).json({ message: "Failed to create document type", error: error.message });
  }
};

export const fetchAllDocumentTypes = async (req, res) => {
  try {
    const docTypes = await DocumentType.getAll();
    res.status(200).json(docTypes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch document types", error: error.message });
  }
};

export const getDocumentTypeById = async (req, res) => {
  try {
    const docType = await DocumentType.getById(req.params.id);
    if (!docType) return res.status(404).json({ message: "Document Type not found" });
    res.status(200).json(docType);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch document type", error: error.message });
  }
};

export const updateDocumentType = async (req, res) => {
  try {
    const updated = await DocumentType.update(req.params.id, req.body);
    res.status(200).json({ message: "Document Type updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update document type", error: error.message });
  }
};

export const deleteDocumentType = async (req, res) => {
  try {
    await DocumentType.delete(req.params.id);
    res.status(200).json({ message: "Document Type deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete document type", error: error.message });
  }
};
