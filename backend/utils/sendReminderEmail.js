const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReminderEmail = (to, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Keep solving, ${name}!`,
    text: `Hi ${name},\n\nWe noticed you haven't solved any problems recently. Keep practicing to improve your skills!\n\nHappy coding!`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendReminderEmail;
