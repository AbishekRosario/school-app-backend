import db from '../../config/db.js';

export const SubjectSpecialization = {
  create: async ({ name }) => {
    const [result] = await db.query(
      'INSERT INTO subject_specialization (name) VALUES (?)',
      [name]
    );
    return { id: result.insertId, name };
  },

  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM subject_specialization ORDER BY id ASC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM subject_specialization WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, { name }) => {
    await db.query(
      'UPDATE subject_specialization SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, id]
    );
    return { id, name };
  },

  delete: async (id) => {
    await db.query('DELETE FROM subject_specialization WHERE id = ?', [id]);
  }
};
