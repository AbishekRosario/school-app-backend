import { Status } from "../../models/MastersModels/statusModel.js";

export const createStatus = async (req, res) => {
  try {
    const newStatus = await Status.create(req.body);
    res.status(201).json({ message: "Status created", data: newStatus });
  } catch (error) {
    res.status(500).json({ message: "Failed to create status", error: error.message });
  }
};

export const fetchAllStatus = async (req, res) => {
  try {
    const statuses = await Status.getAll();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch status", error: error.message });
  }
};

export const getStatusById = async (req, res) => {
  try {
    const status = await Status.getById(req.params.id);
    if (!status) return res.status(404).json({ message: "Status not found" });
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch status", error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const updated = await Status.update(req.params.id, req.body);
    res.status(200).json({ message: "Status updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

export const deleteStatus = async (req, res) => {
  try {
    await Status.delete(req.params.id);
    res.status(200).json({ message: "Status deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete status", error: error.message });
  }
};
