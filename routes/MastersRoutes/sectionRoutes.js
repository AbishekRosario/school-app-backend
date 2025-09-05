import express from 'express';
import {
  createSection,
  fetchAllSections,
  getSectionById,
  updateSection,
  deleteSection
} from '../../controllers/MastersController/sectionController.js';

const router = express.Router();

router.post('/', createSection);
router.get('/', fetchAllSections);
router.get('/:id', getSectionById);
router.put('/:id', updateSection);
router.delete('/:id', deleteSection);

export default router;
