import { FatherOccupation } from '../../models/MastersModels/fatherOccupationModel.js';

export const createFatherOccupation = async (req, res) => {
  try {
    const newOccupation = await FatherOccupation.create(req.body);
    res.status(201).json({ message: 'Father Occupation created', data: newOccupation });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create father occupation', error: error.message });
  }
};

export const fetchAllFatherOccupations = async (req, res) => {
  try {
    const occupations = await FatherOccupation.getAll();
    res.status(200).json(occupations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch father occupations' });
  }
};

export const getFatherOccupationById = async (req, res) => {
  try {
    const occupation = await FatherOccupation.getById(req.params.id);
    if (!occupation) return res.status(404).json({ message: 'Father Occupation not found' });
    res.status(200).json(occupation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch father occupation' });
  }
};

export const updateFatherOccupation = async (req, res) => {
  try {
    const updated = await FatherOccupation.update(req.params.id, req.body);
    res.status(200).json({ message: 'Father Occupation updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update father occupation', error: error.message });
  }
};

export const deleteFatherOccupation = async (req, res) => {
  try {
    await FatherOccupation.delete(req.params.id);
    res.status(200).json({ message: 'Father Occupation deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete father occupation' });
  }
};
