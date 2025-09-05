import db from "../../config/db.js";

export class DocumentType {
  static async create(documentType) {
    const [result] = await db.query(
      "INSERT INTO m_document_types (name) VALUES (?)",
      [documentType.name]
    );
    return { id: result.insertId, ...documentType };
  }

  static async getAll() {
    const [rows] = await db.query("SELECT * FROM m_document_types ORDER BY id DESC");
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM m_document_types WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async update(id, documentType) {
    await db.query("UPDATE m_document_types SET name = ? WHERE id = ?", [
      documentType.name,
      id,
    ]);
    return { id, ...documentType };
  }

  static async delete(id) {
    await db.query("DELETE FROM m_document_types WHERE id = ?", [id]);
    return true;
  }
}
