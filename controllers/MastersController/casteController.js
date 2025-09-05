import { Caste } from "../../models/MastersModels/casteModel.js";

export const createCaste = async (req, res) => {
  try {
    const newCaste = await Caste.create(req.body);
    res.status(201).json({ message: "Caste created", data: newCaste });
  } catch (error) {
    res.status(500).json({ message: "Failed to create caste", error: error.message });
  }
};

export const fetchAllCastes = async (req, res) => {
  try {
    const castes = await Caste.getAll();
    res.status(200).json(castes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch castes" });
  }
};

export const getCasteById = async (req, res) => {
  try {
    const caste = await Caste.getById(req.params.id);
    if (!caste) return res.status(404).json({ message: "Caste not found" });
    res.status(200).json(caste);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch caste" });
  }
};

export const updateCaste = async (req, res) => {
  try {
    const updated = await Caste.update(req.params.id, req.body);
    res.status(200).json({ message: "Caste updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update caste", error: error.message });
  }
};

export const deleteCaste = async (req, res) => {
  try {
    await Caste.delete(req.params.id);
    res.status(200).json({ message: "Caste deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete caste" });
  }
};
