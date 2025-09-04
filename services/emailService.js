import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false 
  }
});

// Add email queue system
const emailQueue = [];
let isSending = false;

async function processQueue() {
  if (isSending || emailQueue.length === 0) return;
  
  isSending = true;
  const emailTask = emailQueue.shift();
  
  try {
    await transporter.sendMail(emailTask.options);
    console.log(`Email sent to ${emailTask.options.to}`);
    if (emailTask.onSuccess) emailTask.onSuccess();
  } catch (error) {
    console.error(`Email failed to ${emailTask.options.to}:`, error);
    if (emailTask.retries < 3) {
      emailTask.retries++;
      emailQueue.unshift(emailTask); 
      console.log(`Retrying email to ${emailTask.options.to} (attempt ${emailTask.retries})`);
    } else if (emailTask.onError) {
      emailTask.onError(error);
    }
  } finally {
    isSending = false;
    process.nextTick(processQueue);
  }
}

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"School Admin" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #3498db;">Email Verification</h2>
        <p>Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this link in your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
    text: `Please verify your email by visiting this link: ${verificationUrl}\nThis link expires in 24 hours.`
  };

  emailQueue.push({
    options: mailOptions,
    retries: 0
  });
  processQueue();
};

export const sendCredentialsEmail = async (student) => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;
  
  const mailOptions = {
    from: `"School Admin" <${process.env.EMAIL_FROM}>`,
    to: student.email,
    subject: 'Your Account Credentials',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2ecc71;">Account Verified Successfully</h2>
        <p>Dear ${student.name},</p>
        <p>Your account has been successfully verified. Here are your login credentials:</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Username:</strong> ${student.email}</p>
          <p><strong>Password:</strong> ${student.plain_password}</p>
        </div>
        
        <p>You can now log in using the button below:</p>
        <a href="${loginUrl}" 
           style="display: inline-block; padding: 10px 20px; background: #2ecc71; color: white; text-decoration: none; border-radius: 5px;">
          Login Now
        </a>
        
        <p style="margin-top: 20px; color: #e74c3c;">
          <strong>Important:</strong> For security reasons, please change your password after logging in.
        </p>
        
        <p>If you didn't request this, please contact support immediately.</p>
      </div>
    `,
    text: `Your account credentials:\n\nEmail: ${student.email}\nPassword: ${student.plain_password}\n\nLogin at: ${loginUrl}\n\nPlease change your password after logging in.`
  };

  return new Promise((resolve, reject) => {
    emailQueue.push({
      options: mailOptions,
      retries: 0,
      onSuccess: resolve,
      onError: reject
    });
    processQueue();
  });
};

// Add this to your emailService.js
export const sendLoginNotificationEmail = async ({ email, name, timestamp }) => {
  const formattedDate = new Date(timestamp).toLocaleString();
  
  const mailOptions = {
    from: `"Security Alert" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'New Login Detected',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #e67e22;">New Login Notification</h2>
        <p>Hello ${name},</p>
        <p>We detected a new login to your account:</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Time:</strong> ${formattedDate}</p>
        </div>
        
        <p>If this was you, you can safely ignore this email.</p>
        
        <p style="color: #e74c3c;">
          <strong>If this wasn't you:</strong> Please change your password immediately and contact support.
        </p>
      </div>
    `,
    text: `New login detected on your account at ${formattedDate}.\n\nIf this wasn't you, please secure your account.`
  };

  return new Promise((resolve, reject) => {
    emailQueue.push({
      options: mailOptions,
      retries: 0,
      onSuccess: resolve,
      onError: reject
    });
    processQueue();
  });
};

export const sendRoleSpecificEmail = (user, role) => {
  let subject, content;
  
  switch(role) {
    case 'student':
      subject = 'Welcome to Student Portal';
      content = `Dear ${user.name}, welcome to our student portal...`;
      break;
    case 'teacher':
      subject = 'Your Teacher Account';
      content = `Dear ${user.name}, your teacher account has been created...`;
      break;
    case 'admin':
      subject = 'Admin Account Details';
      content = `Dear ${user.name}, your admin account is ready...`;
      break;
    default:
      subject = 'Account Created';
      content = `Dear ${user.name}, your account has been created...`;
  }

  // Send email logic
  console.log(`Sending email to ${user.email} with subject: ${subject}`);
};