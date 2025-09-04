import express from 'express';
import {
  createMotherOccupation,
  fetchAllMotherOccupations,
  getMotherOccupationById,
  updateMotherOccupation,
  deleteMotherOccupation
} from '../../controllers/MastersController/motherOccupationController.js';

const router = express.Router();

router.post('/', createMotherOccupation);
router.get('/', fetchAllMotherOccupations);
router.get('/:id', getMotherOccupationById);
router.put('/:id', updateMotherOccupation);
router.delete('/:id', deleteMotherOccupation);

export default router;
