import express from 'express';
import {
  createStd,
  fetchAllStd,
  getStdById,
  updateStd,
  deleteStd
} from '../../controllers/MastersController/stdMasterController.js';

const router = express.Router();

router.post('/', createStd);
router.get('/', fetchAllStd);
router.get('/:id', getStdById);
router.put('/:id', updateStd);
router.delete('/:id', deleteStd);

export default router;
