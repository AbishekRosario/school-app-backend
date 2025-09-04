import { Qualification } from '../../models/MastersModels/qualificationModel.js';

export const createQualification = async (req, res) => {
  try {
    const newQualification = await Qualification.create(req.body);
    res.status(201).json({ message: 'Qualification created', data: newQualification });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create Qualification', error: error.message });
  }
};

export const fetchAllQualifications = async (req, res) => {
  try {
    const qualifications = await Qualification.getAll();
    res.status(200).json(qualifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Qualifications' });
  }
};

export const getQualificationById = async (req, res) => {
  try {
    const qualification = await Qualification.getById(req.params.id);
    if (!qualification) return res.status(404).json({ message: 'Qualification not found' });
    res.status(200).json(qualification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Qualification' });
  }
};

export const updateQualification = async (req, res) => {
  try {
    const updated = await Qualification.update(req.params.id, req.body);
    res.status(200).json({ message: 'Qualification updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update Qualification', error: error.message });
  }
};

export const deleteQualification = async (req, res) => {
  try {
    await Qualification.delete(req.params.id);
    res.status(200).json({ message: 'Qualification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Qualification' });
  }
};
