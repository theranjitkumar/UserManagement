const nodemailer = require('nodemailer');
const winston = require('../config/logger');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  // For development with services like Mailtrap
  ...(process.env.NODE_ENV === 'development' && {
    logger: true,
    debug: true,
  }),
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    winston.error('Error with email configuration:', error);
  } else {
    winston.info('Server is ready to take our messages');
  }
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message (text)
 * @param {string} [options.html] - HTML version of the message
 * @returns {Promise}
 */
const sendEmail = async (options) => {
  try {
    // 1) Define email options
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      ...(options.html && { html: options.html }),
    };

    // 2) Send the email
    await transporter.sendMail(mailOptions);
    
    winston.info(`Email sent to ${options.email}`);
  } catch (error) {
    winston.error('Error sending email:', error);
    throw new Error('There was an error sending the email. Try again later!');
  }
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} resetToken - Password reset token
 * @param {string} resetUrl - Password reset URL
 * @returns {Promise}
 */
const sendPasswordResetEmail = async (to, resetToken, resetUrl) => {
  const subject = 'Your password reset token (valid for 10 minutes)';
  const resetURL = resetUrl || `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  
  const message = `Forgot your password? Submit a PATCH request with your new password to: \n${resetURL}\n\nIf you didn't forget your password, please ignore this email!`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d3748;">Password Reset Request</h2>
      <p>You recently requested to reset your password. Click the button below to reset it:</p>
      <div style="margin: 25px 0;">
        <a href="${resetURL}" 
           style="background-color: #4299e1; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If you didn't request this, please ignore this email.</p>
      <p style="font-size: 0.8em; color: #718096;">
        This link will expire in 10 minutes.
      </p>
    </div>
  `;

  return sendEmail({
    email: to,
    subject,
    message,
    html,
  });
};

/**
 * Send welcome email
 * @param {string} to - Recipient email
 * @param {string} name - User's name
 * @returns {Promise}
 */
const sendWelcomeEmail = async (to, name) => {
  const subject = 'Welcome to Our Platform!';
  const message = `Welcome to our platform, ${name}! We're excited to have you on board.`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d3748;">Welcome to Our Platform, ${name}!</h2>
      <p>Thank you for joining us. We're excited to have you on board.</p>
      <p>Start exploring our platform and let us know if you have any questions.</p>
      <div style="margin: 25px 0;">
        <a href="${process.env.CLIENT_URL}" 
           style="background-color: #4299e1; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Get Started
        </a>
      </div>
    </div>
  `;

  return sendEmail({
    email: to,
    subject,
    message,
    html,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  transporter,
};
