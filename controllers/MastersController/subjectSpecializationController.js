import { SubjectSpecialization } from '../../models/MastersModels/subjectSpecializationModel.js';

export const createSubjectSpecialization = async (req, res) => {
  try {
    const newSubject = await SubjectSpecialization.create(req.body);
    res.status(201).json({ message: 'Subject Specialization created', data: newSubject });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create Subject Specialization', error: error.message });
  }
};

export const fetchAllSubjectSpecializations = async (req, res) => {
  try {
    const subjects = await SubjectSpecialization.getAll();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Subject Specializations' });
  }
};

export const getSubjectSpecializationById = async (req, res) => {
  try {
    const subject = await SubjectSpecialization.getById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject Specialization not found' });
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Subject Specialization' });
  }
};

export const updateSubjectSpecialization = async (req, res) => {
  try {
    const updated = await SubjectSpecialization.update(req.params.id, req.body);
    res.status(200).json({ message: 'Subject Specialization updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update Subject Specialization', error: error.message });
  }
};

export const deleteSubjectSpecialization = async (req, res) => {
  try {
    await SubjectSpecialization.delete(req.params.id);
    res.status(200).json({ message: 'Subject Specialization deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Subject Specialization' });
  }
};
