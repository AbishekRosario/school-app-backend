import { AdmissionCategory } from "../../models/MastersModels/admissionCategoryModel.js";

export const createAdmissionCategory = async (req, res) => {
  try {
    const newCategory = await AdmissionCategory.create(req.body);
    res.status(201).json({ message: "Admission Category created", data: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Failed to create admission category", error: error.message });
  }
};

export const fetchAllAdmissionCategories = async (req, res) => {
  try {
    const categories = await AdmissionCategory.getAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admission categories" });
  }
};

export const getAdmissionCategoryById = async (req, res) => {
  try {
    const category = await AdmissionCategory.getById(req.params.id);
    if (!category) return res.status(404).json({ message: "Admission Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admission category" });
  }
};

export const updateAdmissionCategory = async (req, res) => {
  try {
    const updated = await AdmissionCategory.update(req.params.id, req.body);
    res.status(200).json({ message: "Admission Category updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update admission category", error: error.message });
  }
};

export const deleteAdmissionCategory = async (req, res) => {
  try {
    await AdmissionCategory.delete(req.params.id);
    res.status(200).json({ message: "Admission Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete admission category" });
  }
};
