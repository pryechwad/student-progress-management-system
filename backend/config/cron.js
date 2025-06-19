const cron = require('node-cron');
const axios = require('axios');
const Student = require('./models/Student');
const sendReminderEmail = require('./utils/sendReminderEmail');

// Example: runs every day at 2 AM
let cronExpression = '0 2 * * *'; // default 2 AM

const fetchAndUpdateCodeforcesData = async () => {
  console.log('Running Codeforces Data Sync...');

  const students = await Student.find();

  for (const student of students) {
    if (!student.codeforcesHandle) continue;

    try {
      // Fetch Codeforces user info
      const res = await axios.get(
        `https://codeforces.com/api/user.info?handles=${student.codeforcesHandle}`
      );
      const data = res.data.result[0];

      // Update rating info
      student.currentRating = data.rating;
      student.maxRating = data.maxRating;
      student.lastCFUpdate = new Date();

      // TODO: Fetch submissions & contests as needed for profile view

      // Save updated student
      await student.save();

      // Inactivity check: submissions in last 7 days?
      const submissions = await axios.get(
        `https://codeforces.com/api/user.status?handle=${student.codeforcesHandle}`
      );
      const recent = submissions.data.result.filter(
        (s) => new Date(s.creationTimeSeconds * 1000) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

      if (recent.length === 0 && student.autoReminderEnabled) {
        // Send reminder email
        await sendReminderEmail(student.email, student.name);
        student.reminderCount += 1;
        await student.save();
        console.log(`Reminder sent to ${student.name}`);
      }

    } catch (err) {
      console.error(`Failed to update ${student.name}:`, err.message);
    }
  }
};

// Schedule with cron
let job = cron.schedule(cronExpression, fetchAndUpdateCodeforcesData);

module.exports = {
  job,
  updateCronSchedule: (newExpression) => {
    job.stop();
    cronExpression = newExpression;
    job = cron.schedule(cronExpression, fetchAndUpdateCodeforcesData);
    console.log(`Cron schedule updated to: ${cronExpression}`);
  },
  fetchAndUpdateCodeforcesData, // export for on-demand use
};
