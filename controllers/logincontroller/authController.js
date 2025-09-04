import db from '../../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { generateTokens, generateVerificationToken } from '../../utils/authUtils.js';
import { sendVerificationEmail, sendCredentialsEmail, sendLoginNotificationEmail } from '../../services/emailService.js';

const invalidatedRefresh = new Set();

const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const validatePhone = (p) => /^\d{10,15}$/.test(p);
const validatePincode = (p) => /^\d{6}$/.test(p);

const buildUserResponse = (row, role) => {
  const base = { id: row.id, name: row.name, email: row.email, role, last_login: row.last_login || null };
  if (role === 'student') return { ...base, register_number: row.register_number, standard: row.standard };
  if (role === 'teacher') { return { ...base,employee_id: row.employee_id, subject_specialization: row.subject_specialization || null };
}

  return base;
};

export const registerStudent = async (req, res) => {
  try {
    const {
      register_number, name, phone_number, email, password,
      address, pincode, date_of_birth, gender, standard,
      blood_group, father_name, mother_name,
      father_occupation, mother_occupation,
    } = req.body;

    if (!register_number || !name || !phone_number || !email || !password || !address || !pincode || !date_of_birth || !gender || !standard || !father_name || !mother_name) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (!validateEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format' });
    if (!validatePhone(phone_number)) return res.status(400).json({ success: false, message: 'Invalid phone format' });
    if (!validatePincode(pincode)) return res.status(400).json({ success: false, message: 'Pincode must be 6 digits' });

    const [exists] = await db.query(
      `SELECT id,email,phone_number,register_number FROM students_register
       WHERE email=? OR phone_number=? OR register_number=?`,
      [email, phone_number, register_number]
    );
    if (exists.length) {
      return res.status(400).json({ success: false, message: 'Email/Phone/Register number already in use' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const { token, expiresAt } = generateVerificationToken();

    const [result] = await db.query(
      `INSERT INTO students_register
      (register_number,name,phone_number,email,password_hash,address,pincode,date_of_birth,gender,standard,blood_group,
       father_name,mother_name,father_occupation,mother_occupation,is_active,is_verified,verification_token,token_expires_at,plain_password)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [register_number, name, phone_number, email, password_hash, address, pincode, date_of_birth, gender, standard, blood_group || null,
       father_name, mother_name, father_occupation || null, mother_occupation || null, 1, 0, token, expiresAt, password]
    );

    await sendVerificationEmail(email, token);

    return res.status(201).json({ success: true, message: 'Student registered. Please verify your email.', studentId: result.insertId });
  } catch (e) {
    console.error('registerStudent error:', e);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

export const registerTeacher = async (req, res) => {
  try {
    const { employee_id, name, phone_number, email, password, address, pincode, date_of_birth, gender, subject_specialization, qualification } = req.body;

    if (!employee_id || !name || !email || !password || !subject_specialization) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }
    if (!validateEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format' });
    if (phone_number && !validatePhone(phone_number)) return res.status(400).json({ success: false, message: 'Invalid phone format' });
    if (pincode && !validatePincode(pincode)) return res.status(400).json({ success: false, message: 'Pincode must be 6 digits' });

    const [exists] = await db.query(
      `SELECT id FROM teachers WHERE email=? OR phone_number=? OR employee_id=?`,
      [email, phone_number || null, employee_id]
    );
    if (exists.length) return res.status(400).json({ success: false, message: 'Email/Phone/Employee ID already in use' });

    const password_hash = await bcrypt.hash(password, 10);
    const { token, expiresAt } = generateVerificationToken();

    const [result] = await db.query(
      `INSERT INTO teachers
      (employee_id,name,phone_number,email,password_hash,address,pincode,date_of_birth,gender,subject_specialization,qualification,
       is_active,is_verified,verification_token,token_expires_at,plain_password)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [employee_id, name, phone_number || null, email, password_hash, address || null, pincode || null, date_of_birth || null, gender,
       subject_specialization, qualification || null, 1, 0, token, expiresAt, password]
    );

    await sendVerificationEmail(email, token);

    return res.status(201).json({ success: true, message: 'Teacher registered. Please verify your email.', teacherId: result.insertId });
  } catch (e) {
    console.error('registerTeacher error:', e);
    return res.status(500).json({ success: false, message: 'Teacher registration failed' });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    if (!username || !name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }
    if (!validateEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format' });

    const [exists] = await db.query(
      `SELECT id FROM admins WHERE email=? OR username=?`,
      [email, username]
    );
    if (exists.length) return res.status(400).json({ success: false, message: 'Email/Username already in use' });

    const password_hash = await bcrypt.hash(password, 10);
    const { token, expiresAt } = generateVerificationToken();

    const [result] = await db.query(
      `INSERT INTO admins (username,name,email,password_hash,is_verified,verification_token,token_expires_at,plain_password) 
       VALUES (?,?,?,?,?,?,?,?)`,
      [username, name, email, password_hash, 0, token, expiresAt, password]
    );

    await sendVerificationEmail(email, token);

    return res.status(201).json({ success: true, message: 'Admin registered. Please verify your email.', adminId: result.insertId });
  } catch (e) {
    console.error('registerAdmin error:', e);
    return res.status(500).json({ success: false, message: 'Admin registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email_or_register, password } = req.body;
    if (!email_or_register || !password) {
      return res.status(400).json({ success: false, message: 'Email/Register and password are required' });
    }

    let user = null;
    let role = null;

    // Students
    const [students] = await db.query(
      `SELECT id,register_number,name,email,password_hash,is_verified,is_active,standard,last_login
       FROM students_register WHERE email=? OR register_number=?`,
      [email_or_register, email_or_register]
    );
    if (students.length) {
      const s = students[0];
      if (!s.is_verified) return res.status(403).json({ success: false, message: 'Account not verified. Please check your email.' });
      if (!s.is_active)   return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact support.' });
      user = s; role = 'student';
    }

    // Teachers
    if (!user) {
      const [teachers] = await db.query(
        `SELECT id,employee_id,name,email,password_hash,is_verified,is_active,last_login,subject_specialization
         FROM teachers WHERE email=? OR employee_id=?`,
        [email_or_register, email_or_register]
      );
      if (teachers.length) {
        const t = teachers[0];
        if (!t.is_verified) return res.status(403).json({ success: false, message: 'Account not verified. Please check your email.' });
        if (!t.is_active)   return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact support.' });
        user = t; role = 'teacher';
      }
    }

    // Admins
    if (!user) {
      const [admins] = await db.query(
        `SELECT id,name,email,password_hash,last_login FROM admins WHERE email=? OR username=?`,
        [email_or_register, email_or_register]
      );
      if (admins.length) {
        user = admins[0]; role = 'admin';
      }
    }

    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const tokens = generateTokens({ id: user.id, email: user.email, role });

    const table = role === 'student' ? 'students_register' : role === 'teacher' ? 'teachers' : 'admins';
    await db.query(`UPDATE ${table} SET last_login = CURRENT_TIMESTAMP WHERE id = ?`, [user.id]);

    const userData = buildUserResponse(user, role);

    // Cookies (also returning in body for your axios)
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Optional notification (students+teachers+admins)
    sendLoginNotificationEmail({
      email: user.email,
      name: user.name,
      timestamp: new Date(),
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userData,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (e) {
    console.error('login error:', e);
    return res.status(500).json({ success: false, message: 'Login failed. Please try again later.' });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  if (!token) return res.status(400).json({ success: false, message: 'Token is required' });

  try {
    await db.query('START TRANSACTION');

    // Try students first
    const [students] = await db.query(
      `SELECT id, email, name, plain_password FROM students_register 
       WHERE verification_token=? AND token_expires_at > NOW() LIMIT 1 FOR UPDATE`,
      [token]
    );
    
    if (students.length) {
      const student = students[0];
      
      await db.query(
        `UPDATE students_register SET is_verified=1, verification_token=NULL, 
         token_expires_at=NULL, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
        [student.id]
      );
      
      try {
        await sendCredentialsEmail({
          email: student.email,
          name: student.name,
          plain_password: student.plain_password
        }, 'student');
        
        await db.query(
          `UPDATE students_register SET plain_password=NULL WHERE id=?`,
          [student.id]
        );
        
        await db.query('COMMIT');
        return res.json({ success: true, message: 'Student email verified successfully. Credentials have been sent to your email.' });
      } catch (emailError) {
        await db.query('ROLLBACK');
        console.error('Email sending failed:', emailError);
        
        await db.query(
          `INSERT INTO failed_emails 
           (user_id, email_type, error, created_at) 
           VALUES (?, ?, ?, NOW())`,
          [student.id, 'credentials', emailError.message]
        );
        
        return res.status(200).json({
          success: true,
          message: 'Verification successful but we couldn\'t send your credentials. Please contact support.',
          contactEmail: process.env.SUPPORT_EMAIL
        });
      }
    }

    // Try teachers next
    const [teachers] = await db.query(
      `SELECT id, email, name, plain_password FROM teachers 
       WHERE verification_token=? AND token_expires_at > NOW() LIMIT 1 FOR UPDATE`,
      [token]
    );
    
    if (teachers.length) {
      const teacher = teachers[0];
      
      await db.query(
        `UPDATE teachers SET is_verified=1, verification_token=NULL, 
         token_expires_at=NULL, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
        [teacher.id]
      );
      
      try {
        await sendCredentialsEmail({
          email: teacher.email,
          name: teacher.name,
          plain_password: teacher.plain_password
        }, 'teacher');
        
        await db.query(
          `UPDATE teachers SET plain_password=NULL WHERE id=?`,
          [teacher.id]
        );
        
        await db.query('COMMIT');
        return res.json({ success: true, message: 'Teacher email verified successfully. Credentials have been sent to your email.' });
      } catch (emailError) {
        await db.query('ROLLBACK');
        console.error('Email sending failed:', emailError);
        
        await db.query(
          `INSERT INTO failed_emails 
           (user_id, email_type, error, created_at) 
           VALUES (?, ?, ?, NOW())`,
          [teacher.id, 'credentials', emailError.message]
        );
        
        return res.status(200).json({
          success: true,
          message: 'Verification successful but we couldn\'t send your credentials. Please contact support.',
          contactEmail: process.env.SUPPORT_EMAIL
        });
      }
    }

    // Finally try admins
    const [admins] = await db.query(
      `SELECT id, email, name, plain_password FROM admins 
       WHERE verification_token=? AND token_expires_at > NOW() LIMIT 1 FOR UPDATE`,
      [token]
    );
    
    if (admins.length) {
      const admin = admins[0];
      
      await db.query(
        `UPDATE admins SET is_verified=1, verification_token=NULL, 
         token_expires_at=NULL, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
        [admin.id]
      );
      
      try {
        await sendCredentialsEmail({
          email: admin.email,
          name: admin.name,
          plain_password: admin.plain_password
        }, 'admin');
        
        await db.query(
          `UPDATE admins SET plain_password=NULL WHERE id=?`,
          [admin.id]
        );
        
        await db.query('COMMIT');
        return res.json({ success: true, message: 'Admin email verified successfully. Credentials have been sent to your email.' });
      } catch (emailError) {
        await db.query('ROLLBACK');
        console.error('Email sending failed:', emailError);
        
        await db.query(
          `INSERT INTO failed_emails 
           (user_id, email_type, error, created_at) 
           VALUES (?, ?, ?, NOW())`,
          [admin.id, 'credentials', emailError.message]
        );
        
        return res.status(200).json({
          success: true,
          message: 'Verification successful but we couldn\'t send your credentials. Please contact support.',
          contactEmail: process.env.SUPPORT_EMAIL
        });
      }
    }

    await db.query('ROLLBACK');
    return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
  } catch (e) {
    await db.query('ROLLBACK');
    console.error('verifyEmail error:', e);
    return res.status(500).json({ success: false, message: 'Verification process failed' });
  }
};
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token is required' });
    if (invalidatedRefresh.has(refreshToken)) return res.status(401).json({ success: false, message: 'Refresh token invalidated' });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); // { id, role, iat, exp }
    const role = decoded.role;

    // Optional: ensure user still exists & active
    const table = role === 'student' ? 'students_register' : role === 'teacher' ? 'teachers' : 'admins';
    const [rows] = await db.query(`SELECT id,email FROM ${table} WHERE id=?`, [decoded.id]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'User not found' });

    const accessToken = jwt.sign({ id: decoded.id, email: rows[0].email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ id: decoded.id, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    invalidatedRefresh.add(refreshToken);
    if (invalidatedRefresh.size > 1000) invalidatedRefresh.clear();

    return res.status(200).json({ success: true, accessToken, refreshToken: newRefreshToken });
  } catch (e) {
    if (e.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Refresh token expired' });
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) invalidatedRefresh.add(refreshToken);
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch {
    return res.status(500).json({ success: false, message: 'Logout failed' });
  }
};
