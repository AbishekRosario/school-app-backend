import express from 'express';
import {
  createSubjectSpecialization,
  fetchAllSubjectSpecializations,
  getSubjectSpecializationById,
  updateSubjectSpecialization,
  deleteSubjectSpecialization
} from '../../controllers/MastersController/subjectSpecializationController.js';

const router = express.Router();

router.post('/', createSubjectSpecialization);
router.get('/', fetchAllSubjectSpecializations);
router.get('/:id', getSubjectSpecializationById);
router.put('/:id', updateSubjectSpecialization);
router.delete('/:id', deleteSubjectSpecialization);

export default router;
