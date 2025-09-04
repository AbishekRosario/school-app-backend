import { DropdownValues } from '../../models/DropdownModles/dropdownModel.js';
import db from '../../config/db.js';

export const toggleDropdownItemStatus = async (req, res) => {
  try {
    const { tableName, id } = req.params;
    const validTables = [
            'm_city',
            'std_master',
            'subject_specialization',
            'm_qualification',
            'm_fatheroccupation',
            'm_motheroccupation',
            'm_bloodgroup',
            'm_gender',
            
    ];

    if (!validTables.includes(tableName)) {
      return res.status(400).json({ message: 'Invalid table name' });
    }

    const success = await DropdownValues.toggleStatus(tableName, id);
    if (!success) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

export const addDropdownItem = async (req, res) => {
  try {
    const { tableName } = req.params;
    const { name } = req.body;
    const validTables = [
            'm_city',
            'std_master',
            'subject_specialization',
            'm_qualification',
            'm_fatheroccupation',
            'm_motheroccupation',
            'm_bloodgroup',
            'm_gender',
           
    ];

    if (!validTables.includes(tableName)) {
      return res.status(400).json({ message: 'Invalid table name' });
    }

    const [result] = await db.query(
      `INSERT INTO ${tableName} (name) VALUES (?)`,
      [name]
    );

    res.status(201).json({ 
      message: 'Item added successfully',
      id: result.insertId,
      name
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item', error: error.message });
  }
};

export const updateDropdownItemName = async (req, res) => {
  try {
    const { tableName, id } = req.params;
    const { name } = req.body;

    const validTables = [
            'm_city',
            'std_master',
            'subject_specialization',
            'm_qualification',
            'm_fatheroccupation',
            'm_motheroccupation',
            'm_bloodgroup',
            'm_gender',
     
    ];

    if (!validTables.includes(tableName)) {
      return res.status(400).json({ message: 'Invalid table name' });
    }

    const success = await DropdownValues.updateNameById(tableName, id, name);
    if (!success) {
      return res.status(404).json({ message: 'Item not found or not updated' });
    }

    res.status(200).json({ message: 'Item name updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
};

export const getDropdownItemById = async (req, res) => {
  try {
    const { tableName, id } = req.params;

    const validTables = [
            'm_city',
            'std_master',
            'subject_specialization',
            'm_qualification',
            'm_fatheroccupation',
            'm_motheroccupation',
            'm_bloodgroup',
            'm_gender',
      
    ];

    if (!validTables.includes(tableName)) {
      return res.status(400).json({ message: 'Invalid table name' });
    }

    const item = await DropdownValues.getItemById(tableName, id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item', error: error.message });
  }
};

export const getAllDropdownItems = async (req, res) => {
  try {
    const { tableName } = req.params;

    const validTables = [
            'm_city',
            'std_master',
            'subject_specialization',
            'm_qualification',
            'm_fatheroccupation',
            'm_motheroccupation',
            'm_bloodgroup',
            'm_gender',
     
    ];

    if (!validTables.includes(tableName)) {
      return res.status(400).json({ message: 'Invalid table name' });
    }

    const items = await DropdownValues.getAllItems(tableName);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
};

export const deleteDropdownItem = async (req, res) => {
  try {
    const { tableName, id } = req.params;

    const validTables = [
            'm_city',
            'std_master',
            'subject_specialization',
            'm_qualification',
            'm_fatheroccupation',
            'm_motheroccupation',
            'm_bloodgroup',
            'm_gender',
      
    ];

    if (!validTables.includes(tableName)) {
      return res.status(400).json({ message: 'Invalid table name' });
    }

    const success = await DropdownValues.deleteItem(tableName, id);

    if (!success) {
      return res.status(404).json({ message: 'Item not found or already deleted' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};


const VALID_TABLES = [
            'm_city',
            'std_master',
            'subject_specialization',
            'm_qualification',
            'm_fatheroccupation',
            'm_motheroccupation',
            'm_bloodgroup',
            'm_gender',
 
];

export const getDropdownValues = async (req, res) => {
  try {
    const { tables } = req.query;
    const requestedTables = tables ? tables.split(',') : VALID_TABLES;

    const invalidTables = requestedTables.filter(t => !VALID_TABLES.includes(t));
    if (invalidTables.length > 0) {
      return res.status(400).json({
        message: `Invalid table(s): ${invalidTables.join(', ')}`,
        validTables: VALID_TABLES
      });
    }

    // fetch all items
    const fetchPromises = requestedTables.map(table =>
      DropdownValues.getAllItems(table)
    );

    const results = await Promise.all(fetchPromises);

    const responseData = {};
    requestedTables.forEach((table, index) => {
      // ✅ keep original table name as the key
      responseData[table] = results[index];
    });

    // ✅ add static dropdown
    responseData.onlineOfflineOptions = ['Online', 'Offline', 'Hybrid'];

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch dropdown values',
      error: error.message
    });
  }
};


