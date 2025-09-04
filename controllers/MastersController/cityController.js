import { City } from '../../models/MastersModels/cityModel.js';

export const createCity = async (req, res) => {
  try {
    const newCity = await City.create(req.body);
    res.status(201).json({ message: 'City created', data: newCity });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create city', error: error.message });
  }
};

export const fetchAllCities = async (req, res) => {
  try {
    const cities = await City.getAll();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cities' });
  }
};

export const getCityById = async (req, res) => {
  try {
    const city = await City.getById(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.status(200).json(city);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch city' });
  }
};

export const updateCity = async (req, res) => {
  try {
    const updated = await City.update(req.params.id, req.body);
    res.status(200).json({ message: 'City updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update city', error: error.message });
  }
};

export const deleteCity = async (req, res) => {
  try {
    await City.delete(req.params.id);
    res.status(200).json({ message: 'City deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete city' });
  }
};
