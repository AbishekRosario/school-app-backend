import db from "../../config/db.js";

export class Status {
  static async create(status) {
    const [result] = await db.query(
      "INSERT INTO m_status (name) VALUES (?)",
      [status.name]
    );
    return { id: result.insertId, ...status };
  }

  static async getAll() {
    const [rows] = await db.query("SELECT * FROM m_status ORDER BY id DESC");
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM m_status WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async update(id, status) {
    await db.query("UPDATE m_status SET name = ? WHERE id = ?", [
      status.name,
      id,
    ]);
    return { id, ...status };
  }

  static async delete(id) {
    await db.query("DELETE FROM m_status WHERE id = ?", [id]);
    return true;
  }
}
