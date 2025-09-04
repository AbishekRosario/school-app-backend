import express from 'express';
import {
  createCity,
  fetchAllCities,
  getCityById,
  updateCity,
  deleteCity
} from '../../controllers/MastersController/cityController.js';

const router = express.Router();

router.post('/', createCity);
router.get('/', fetchAllCities);
router.get('/:id', getCityById);
router.put('/:id', updateCity);
router.delete('/:id', deleteCity);

export default router;
