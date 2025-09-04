import { Gender } from '../../models/MastersModels/genderModel.js';

export const createGender = async (req, res) => {
  try {
    const newGender = await Gender.create(req.body);
    res.status(201).json({ message: 'Gender created', data: newGender });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create gender', error: error.message });
  }
};

export const fetchAllGenders = async (req, res) => {
  try {
    const genders = await Gender.getAll();
    res.status(200).json(genders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch genders' });
  }
};

export const getGenderById = async (req, res) => {
  try {
    const gender = await Gender.getById(req.params.id);
    if (!gender) return res.status(404).json({ message: 'Gender not found' });
    res.status(200).json(gender);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch gender' });
  }
};

export const updateGender = async (req, res) => {
  try {
    const updated = await Gender.update(req.params.id, req.body);
    res.status(200).json({ message: 'Gender updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update gender', error: error.message });
  }
};

export const deleteGender = async (req, res) => {
  try {
    await Gender.delete(req.params.id);
    res.status(200).json({ message: 'Gender deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete gender' });
  }
};
