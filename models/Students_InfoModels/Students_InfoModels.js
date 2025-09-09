import db from "../../config/db.js";

export const StudentModel = {
  // Get all students with joined data
  getAll: async (filters = {}) => {
    let query = `
      SELECT 
        sr.*, 
        si.roll_number, si.profile_photo, si.section, si.caste, si.status, si.religion,
        sg.guardian_name, sg.relation, sg.phone as guardian_phone, sg.email as guardian_email, 
        sg.occupation as guardian_occupation,
        smi.allergies, smi.medical_history, smi.emergency_contact,
        spe.school_name, spe.board_university, spe.year_of_passing, spe.percentage_grade,
        ac.name as admission_category_name,
        dt.name as document_type_name,
        sd.document_number, sd.document_path, sd.file_name, sd.issue_date, sd.expiry_date, sd.is_verified
      FROM students_register sr
      LEFT JOIN students_info si ON sr.id = si.student_id
      LEFT JOIN student_guardians sg ON sr.id = sg.student_id
      LEFT JOIN student_medical_info smi ON sr.id = smi.student_id
      LEFT JOIN student_previous_education spe ON sr.id = spe.student_id
      LEFT JOIN student_documents sd ON sr.id = sd.student_id
      LEFT JOIN m_admission_categories ac ON si.admission_category = ac.id
      LEFT JOIN m_document_types dt ON sd.document_type = dt.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.standard) {
      query += ' AND sr.standard = ?';
      params.push(filters.standard);
    }
    
    if (filters.section) {
      query += ' AND si.section = ?';
      params.push(filters.section);
    }
    
    if (filters.is_active !== undefined) {
      query += ' AND sr.is_active = ?';
      params.push(filters.is_active);
    }
    
    query += ' ORDER BY sr.standard, si.section, si.roll_number';
    
    const [rows] = await db.query(query, params);
    return rows;
  },

  // Get student by ID with all joined data
  getById: async (id) => {
    const query = `
      SELECT 
        sr.*, 
        si.roll_number, si.profile_photo, si.section, si.caste, si.status, si.religion, si.admission_category,
        sg.guardian_name, sg.relation, sg.phone as guardian_phone, sg.email as guardian_email, 
        sg.occupation as guardian_occupation, sg.address as guardian_address,
        smi.allergies, smi.medical_history, smi.emergency_contact,
        spe.school_name, spe.board_university, spe.year_of_passing, spe.percentage_grade,
        ac.name as admission_category_name,
        dt.name as document_type_name,
        sd.document_number, sd.document_path, sd.file_name, sd.issue_date, sd.expiry_date, sd.is_verified
      FROM students_register sr
      LEFT JOIN students_info si ON sr.id = si.student_id
      LEFT JOIN student_guardians sg ON sr.id = sg.student_id
      LEFT JOIN student_medical_info smi ON sr.id = smi.student_id
      LEFT JOIN student_previous_education spe ON sr.id = spe.student_id
      LEFT JOIN student_documents sd ON sr.id = sd.student_id
      LEFT JOIN m_admission_categories ac ON si.admission_category = ac.id
      LEFT JOIN m_document_types dt ON sd.document_type = dt.id
      WHERE sr.id = ?
    `;
    
    const [rows] = await db.query(query, [id]);
    return rows[0];
  },

  // Create a new student with all related information
  create: async (studentData) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert into students_register
      const [registerResult] = await connection.query(
        `INSERT INTO students_register 
        (register_number, name, phone_number, email, password_hash, plain_password, 
         address, pincode, date_of_birth, standard, blood_group, father_name, 
         mother_name, father_occupation, mother_occupation, role_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          studentData.register_number,
          studentData.name,
          studentData.phone_number,
          studentData.email,
          studentData.password_hash,
          studentData.plain_password,
          studentData.address,
          studentData.pincode,
          studentData.date_of_birth,
          studentData.standard,
          studentData.blood_group,
          studentData.father_name,
          studentData.mother_name,
          studentData.father_occupation,
          studentData.mother_occupation,
          studentData.role_id || 1
        ]
      );
      
      const studentId = registerResult.insertId;
      
      // Insert into students_info
      if (studentData.students_info) {
        await connection.query(
          `INSERT INTO students_info 
          (student_id, roll_number, profile_photo, section, caste, status, religion, admission_category) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            studentId,
            studentData.students_info.roll_number,
            studentData.students_info.profile_photo,
            studentData.students_info.section,
            studentData.students_info.caste,
            studentData.students_info.status,
            studentData.students_info.religion,
            studentData.students_info.admission_category
          ]
        );
      }
      
      // Insert into student_guardians
      if (studentData.guardian) {
        await connection.query(
          `INSERT INTO student_guardians 
          (student_id, guardian_name, relation, phone, email, occupation, address) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            studentId,
            studentData.guardian.guardian_name,
            studentData.guardian.relation,
            studentData.guardian.phone,
            studentData.guardian.email,
            studentData.guardian.occupation,
            studentData.guardian.address
          ]
        );
      }
      
      // Insert into student_medical_info
      if (studentData.medical_info) {
        await connection.query(
          `INSERT INTO student_medical_info 
          (student_id, allergies, medical_history, emergency_contact) 
          VALUES (?, ?, ?, ?)`,
          [
            studentId,
            studentData.medical_info.allergies,
            studentData.medical_info.medical_history,
            studentData.medical_info.emergency_contact
          ]
        );
      }
      
      // Insert into student_previous_education
      if (studentData.previous_education) {
        await connection.query(
          `INSERT INTO student_previous_education 
          (student_id, school_name, board_university, year_of_passing, percentage_grade) 
          VALUES (?, ?, ?, ?, ?)`,
          [
            studentId,
            studentData.previous_education.school_name,
            studentData.previous_education.board_university,
            studentData.previous_education.year_of_passing,
            studentData.previous_education.percentage_grade
          ]
        );
      }
      
      // Insert into student_documents
      if (studentData.documents && studentData.documents.length > 0) {
        for (const doc of studentData.documents) {
          await connection.query(
            `INSERT INTO student_documents 
            (student_id, document_type, document_number, document_path, file_name, 
             file_type, file_size, issue_date, expiry_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              studentId,
              doc.document_type,
              doc.document_number,
              doc.document_path,
              doc.file_name,
              doc.file_type,
              doc.file_size,
              doc.issue_date,
              doc.expiry_date
            ]
          );
        }
      }
      
      await connection.commit();
      connection.release();
      
      return studentId;
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  },

  // Update student information
  update: async (id, studentData) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update students_register
      await connection.query(
        `UPDATE students_register 
        SET register_number=?, name=?, phone_number=?, email=?, address=?, pincode=?, 
            date_of_birth=?, standard=?, blood_group=?, father_name=?, mother_name=?, 
            father_occupation=?, mother_occupation=?, is_active=?, role_id=?
        WHERE id=?`,
        [
          studentData.register_number,
          studentData.name,
          studentData.phone_number,
          studentData.email,
          studentData.address,
          studentData.pincode,
          studentData.date_of_birth,
          studentData.standard,
          studentData.blood_group,
          studentData.father_name,
          studentData.mother_name,
          studentData.father_occupation,
          studentData.mother_occupation,
          studentData.is_active,
          studentData.role_id,
          id
        ]
      );
      
      // Update students_info
      if (studentData.students_info) {
        await connection.query(
          `UPDATE students_info 
          SET roll_number=?, profile_photo=?, section=?, caste=?, status=?, religion=?, admission_category=?
          WHERE student_id=?`,
          [
            studentData.students_info.roll_number,
            studentData.students_info.profile_photo,
            studentData.students_info.section,
            studentData.students_info.caste,
            studentData.students_info.status,
            studentData.students_info.religion,
            studentData.students_info.admission_category,
            id
          ]
        );
      }
      
      // Update student_guardians
      if (studentData.guardian) {
        await connection.query(
          `UPDATE student_guardians 
          SET guardian_name=?, relation=?, phone=?, email=?, occupation=?, address=?
          WHERE student_id=?`,
          [
            studentData.guardian.guardian_name,
            studentData.guardian.relation,
            studentData.guardian.phone,
            studentData.guardian.email,
            studentData.guardian.occupation,
            studentData.guardian.address,
            id
          ]
        );
      }
      
      // Update student_medical_info
      if (studentData.medical_info) {
        await connection.query(
          `UPDATE student_medical_info 
          SET allergies=?, medical_history=?, emergency_contact=?
          WHERE student_id=?`,
          [
            studentData.medical_info.allergies,
            studentData.medical_info.medical_history,
            studentData.medical_info.emergency_contact,
            id
          ]
        );
      }
      
      // Update student_previous_education
      if (studentData.previous_education) {
        await connection.query(
          `UPDATE student_previous_education 
          SET school_name=?, board_university=?, year_of_passing=?, percentage_grade=?
          WHERE student_id=?`,
          [
            studentData.previous_education.school_name,
            studentData.previous_education.board_university,
            studentData.previous_education.year_of_passing,
            studentData.previous_education.percentage_grade,
            id
          ]
        );
      }
      
      await connection.commit();
      connection.release();
      
      return true;
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  },

  // Delete a student (soft delete by setting is_active to false)
  delete: async (id) => {
    const [result] = await db.query(
      'UPDATE students_register SET is_active = FALSE WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};