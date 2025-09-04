import express from 'express';
import {
  createBloodGroup,
  fetchAllBloodGroups,
  getBloodGroupById,
  updateBloodGroup,
  deleteBloodGroup
} from '../../controllers/MastersController/bloodGroupController.js';

const router = express.Router();

router.post('/', createBloodGroup);
router.get('/', fetchAllBloodGroups);
router.get('/:id', getBloodGroupById);
router.put('/:id', updateBloodGroup);
router.delete('/:id', deleteBloodGroup);

export default router;
