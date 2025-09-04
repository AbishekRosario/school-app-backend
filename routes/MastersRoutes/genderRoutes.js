import express from 'express';
import {
  createGender,
  fetchAllGenders,
  getGenderById,
  updateGender,
  deleteGender
} from '../../controllers/MastersController/genderController.js';

const router = express.Router();

router.post('/', createGender);
router.get('/', fetchAllGenders);
router.get('/:id', getGenderById);
router.put('/:id', updateGender);
router.delete('/:id', deleteGender);

export default router;
