const Student = require('../models/Student');

exports.sendInactivityReminder = async (student) => {
  // TODO: replace with nodemailer or your email service
  console.log(`Sending inactivity email to ${student.email}`);

  student.inactivityRemindersSent += 1;
  await student.save();
};
