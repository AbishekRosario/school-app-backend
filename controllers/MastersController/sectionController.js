import { Section } from '../../models/MastersModels/sectionModel.js';

export const createSection = async (req, res) => {
  try {
    const newSection = await Section.create(req.body);
    res.status(201).json({ message: 'Section created', data: newSection });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create Section', error: error.message });
  }
};

export const fetchAllSections = async (req, res) => {
  try {
    const sections = await Section.getAll();
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Sections' });
  }
};

export const getSectionById = async (req, res) => {
  try {
    const section = await Section.getById(req.params.id);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Section' });
  }
};

export const updateSection = async (req, res) => {
  try {
    const updated = await Section.update(req.params.id, req.body);
    res.status(200).json({ message: 'Section updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update Section', error: error.message });
  }
};

export const deleteSection = async (req, res) => {
  try {
    await Section.delete(req.params.id);
    res.status(200).json({ message: 'Section deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Section' });
  }
};
