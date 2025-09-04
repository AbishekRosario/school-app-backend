import { MotherOccupation } from '../../models/MastersModels/motherOccupationModel.js';

export const createMotherOccupation = async (req, res) => {
  try {
    const newItem = await MotherOccupation.create(req.body);
    res.status(201).json({ message: 'Mother occupation created', data: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create mother occupation', error: error.message });
  }
};

export const fetchAllMotherOccupations = async (req, res) => {
  try {
    const items = await MotherOccupation.getAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mother occupations' });
  }
};

export const getMotherOccupationById = async (req, res) => {
  try {
    const item = await MotherOccupation.getById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mother occupation' });
  }
};

export const updateMotherOccupation = async (req, res) => {
  try {
    const updated = await MotherOccupation.update(req.params.id, req.body);
    res.status(200).json({ message: 'Mother occupation updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update mother occupation', error: error.message });
  }
};

export const deleteMotherOccupation = async (req, res) => {
  try {
    await MotherOccupation.delete(req.params.id);
    res.status(200).json({ message: 'Mother occupation deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete mother occupation' });
  }
};
