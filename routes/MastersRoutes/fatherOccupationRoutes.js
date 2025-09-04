import express from 'express';
import {
  createFatherOccupation,
  fetchAllFatherOccupations,
  getFatherOccupationById,
  updateFatherOccupation,
  deleteFatherOccupation
} from '../../controllers/MastersController/fatherOccupationController.js';

const router = express.Router();

router.post('/', createFatherOccupation);
router.get('/', fetchAllFatherOccupations);
router.get('/:id', getFatherOccupationById);
router.put('/:id', updateFatherOccupation);
router.delete('/:id', deleteFatherOccupation);

export default router;
