import { BloodGroup } from '../../models/MastersModels/bloodGroupModel.js';

export const createBloodGroup = async (req, res) => {
  try {
    const newBloodGroup = await BloodGroup.create(req.body);
    res.status(201).json({ message: 'Blood group created', data: newBloodGroup });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blood group', error: error.message });
  }
};

export const fetchAllBloodGroups = async (req, res) => {
  try {
    const bloodGroups = await BloodGroup.getAll();
    res.status(200).json(bloodGroups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blood groups' });
  }
};

export const getBloodGroupById = async (req, res) => {
  try {
    const bloodGroup = await BloodGroup.getById(req.params.id);
    if (!bloodGroup) return res.status(404).json({ message: 'Blood group not found' });
    res.status(200).json(bloodGroup);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blood group' });
  }
};

export const updateBloodGroup = async (req, res) => {
  try {
    const updated = await BloodGroup.update(req.params.id, req.body);
    res.status(200).json({ message: 'Blood group updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update blood group', error: error.message });
  }
};

export const deleteBloodGroup = async (req, res) => {
  try {
    await BloodGroup.delete(req.params.id);
    res.status(200).json({ message: 'Blood group deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete blood group' });
  }
};
