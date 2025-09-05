import { Religion } from '../../models/MastersModels/religionModel.js';

export const createReligion = async (req, res) => {
  try {
    const newReligion = await Religion.create(req.body);
    res.status(201).json({ message: 'Religion created', data: newReligion });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create Religion', error: error.message });
  }
};

export const fetchAllReligions = async (req, res) => {
  try {
    const religions = await Religion.getAll();
    res.status(200).json(religions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Religions' });
  }
};

export const getReligionById = async (req, res) => {
  try {
    const religion = await Religion.getById(req.params.id);
    if (!religion) return res.status(404).json({ message: 'Religion not found' });
    res.status(200).json(religion);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Religion' });
  }
};

export const updateReligion = async (req, res) => {
  try {
    const updated = await Religion.update(req.params.id, req.body);
    res.status(200).json({ message: 'Religion updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update Religion', error: error.message });
  }
};

export const deleteReligion = async (req, res) => {
  try {
    await Religion.delete(req.params.id);
    res.status(200).json({ message: 'Religion deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Religion' });
  }
};
