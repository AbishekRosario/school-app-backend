import { StdMaster } from '../../models/MastersModels/stdMasterModel.js';

export const createStd = async (req, res) => {
  try {
    const newStd = await StdMaster.create(req.body);
    res.status(201).json({ message: 'Student created', data: newStd });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create student', error: error.message });
  }
};

export const fetchAllStd = async (req, res) => {
  try {
    const stds = await StdMaster.getAll();
    res.status(200).json(stds);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};

export const getStdById = async (req, res) => {
  try {
    const std = await StdMaster.getById(req.params.id);
    if (!std) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(std);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student' });
  }
};

export const updateStd = async (req, res) => {
  try {
    const updated = await StdMaster.update(req.params.id, req.body);
    res.status(200).json({ message: 'Student updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student', error: error.message });
  }
};

export const deleteStd = async (req, res) => {
  try {
    await StdMaster.delete(req.params.id);
    res.status(200).json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student' });
  }
};
