import { StudentModel } from '../../models/Students_InfoModels/Students_InfoModels.js';

export const getAllStudents = async (req, res) => {
  try {
    const { standard, section, is_active } = req.query;
    const filters = {};
    
    if (standard) filters.standard = standard;
    if (section) filters.section = section;
    if (is_active !== undefined) filters.is_active = is_active === 'true';
    
    const students = await StudentModel.getAll(filters);
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await StudentModel.getById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
      error: error.message
    });
  }
};

export const createStudent = async (req, res) => {
  try {
    const studentId = await StudentModel.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { id: studentId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create student',
      error: error.message
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const updated = await StudentModel.update(req.params.id, req.body);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: error.message
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const deleted = await StudentModel.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: error.message
    });
  }
};