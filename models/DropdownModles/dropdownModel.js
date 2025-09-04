import db from "../../config/db.js";

export const DropdownValues = {
  // ✅ City
  getCitys: async () => {
    const [rows] = await db.query("SELECT id, name FROM m_city ORDER BY name");
    return rows;
  },

  // ✅ Standard
  getStandards: async () => {
    const [rows] = await db.query("SELECT id, name FROM std_master ORDER BY name");
    return rows;
  },

  // ✅ Subject Specialization
  getSubjectSpecializations: async () => {
    const [rows] = await db.query("SELECT id, name FROM subject_specialization ORDER BY name");
    return rows;
  },

  // ✅ Qualification
  getQualifications: async () => {
    const [rows] = await db.query("SELECT id, name FROM m_qualification ORDER BY name");
    return rows;
  },

  // ✅ Father Occupation
  getFatherOccupations: async () => {
    const [rows] = await db.query("SELECT id, name FROM m_fatheroccupation ORDER BY name");
    return rows;
  },

  // ✅ Mother Occupation
  getMotherOccupations: async () => {
    const [rows] = await db.query("SELECT id, name FROM m_motheroccupation ORDER BY name");
    return rows;
  },

  // ✅ Blood Group
  getBloodGroups: async () => {
    const [rows] = await db.query("SELECT id, name FROM m_bloodgroup ORDER BY name");
    return rows;
  },

  // ✅ Gender
  getGenders: async () => {
    const [rows] = await db.query("SELECT id, name FROM m_gender ORDER BY name");
    return rows;
  },



  updateNameById: async (tableName, id, name) => {
    const [result] = await db.query(
      `UPDATE ${tableName} SET name = ? WHERE id = ?`,
      [name, id]
    );
    return result.affectedRows > 0;
  },

  getItemById: async (tableName, id) => {
    const [rows] = await db.query(
      `SELECT id, name FROM ${tableName} WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  getAllItems: async (tableName) => {
    const [rows] = await db.query(
      `SELECT id, name FROM ${tableName} ORDER BY name`
    );
    return rows;
  },

  deleteItem: async (tableName, id) => {
    const [result] = await db.query(
      `DELETE FROM ${tableName} WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

};