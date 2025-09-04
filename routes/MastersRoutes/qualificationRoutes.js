import express from 'express';
import {
  createQualification,
  fetchAllQualifications,
  getQualificationById,
  updateQualification,
  deleteQualification
} from '../../controllers/MastersController/qualificationController.js';

const router = express.Router();

router.post('/', createQualification);
router.get('/', fetchAllQualifications);
router.get('/:id', getQualificationById);
router.put('/:id', updateQualification);
router.delete('/:id', deleteQualification);

export default router;
