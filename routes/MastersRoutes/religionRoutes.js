import express from 'express';
import {
  createReligion,
  fetchAllReligions,
  getReligionById,
  updateReligion,
  deleteReligion
} from '../../controllers/MastersController/religionController.js';

const router = express.Router();

router.post('/', createReligion);
router.get('/', fetchAllReligions);
router.get('/:id', getReligionById);
router.put('/:id', updateReligion);
router.delete('/:id', deleteReligion);

export default router;
