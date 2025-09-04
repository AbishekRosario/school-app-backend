import db from '../../config/db.js';

export const StdMaster = {
  create: async ({ name }) => {
    const [result] = await db.query(
      'INSERT INTO std_master (name) VALUES (?)',
      [name]
    );
    return { id: result.insertId, name };
  },

  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM std_master ORDER BY id DESC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM std_master WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, { name }) => {
    await db.query(
      'UPDATE std_master SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, id]
    );
    return { id, name };
  },

  delete: async (id) => {
    await db.query('DELETE FROM std_master WHERE id = ?', [id]);
  }
};
