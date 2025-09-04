import express from 'express';
import {
  addDropdownItem,
  updateDropdownItemName,
  getDropdownItemById,
  getAllDropdownItems,
  deleteDropdownItem,
  getDropdownValues  
} from '../../controllers/DropdownController/dropdownController.js';

const router = express.Router();

router.get('/', getDropdownValues);
router.post('/:tableName/add', addDropdownItem);
router.put('/:tableName/:id', updateDropdownItemName);
router.get('/:tableName/:id', getDropdownItemById);
router.get('/:tableName', getAllDropdownItems);
router.delete('/:tableName/:id', deleteDropdownItem);

export default router;