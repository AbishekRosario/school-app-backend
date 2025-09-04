import db from '../../config/db.js';

export const City = {
  create: async ({ name }) => {
    const [result] = await db.query(
      'INSERT INTO m_city (name) VALUES (?)',
      [name]
    );
    return { id: result.insertId, name };
  },

  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM m_city ORDER BY id DESC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM m_city WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, { name }) => {
    await db.query(
      'UPDATE m_city SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, id]
    );
    return { id, name };
  },

  delete: async (id) => {
    await db.query('DELETE FROM m_city WHERE id = ?', [id]);
  }
};
