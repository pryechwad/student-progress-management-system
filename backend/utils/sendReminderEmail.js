// utils/sendReminderEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendReminderEmail = async (to, name) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"SPMS Bot" <${process.env.EMAIL_USER}>`,
    to,
    subject: '⏰ Codeforces Inactivity Reminder',
    text: `Hi ${name},\n\nLooks like you've been inactive on Codeforces. Time to get back to solving problems!\n\n– SPMS`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendReminderEmail;
