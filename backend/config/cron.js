const cron = require('node-cron');
const axios = require('axios');
const Student = require('../models/Student');
const Contest = require('../models/Contest');
const Submission = require('../models/Submission');
const sendReminderEmail = require('../utils/sendReminderEmail');

// Example: runs every day at 2 AM
let cronExpression = '0 2 * * *'; // default 2 AM

const fetchAndUpdateCodeforcesData = async () => {
  console.log('Running Codeforces Data Sync...');

  const students = await Student.find();

  for (const student of students) {
    if (!student.cfHandle) continue;

    try {
      // Fetch Codeforces user info
      const userRes = await axios.get(
        `https://codeforces.com/api/user.info?handles=${student.cfHandle}`
      );
      const userData = userRes.data.result[0];

      // Update rating info
      student.currentRating = userData.rating || 0;
      student.maxRating = userData.maxRating || 0;
      student.lastCFUpdate = new Date();
      student.lastSyncedAt = new Date();

      // Fetch contest history
      const contestRes = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${student.cfHandle}`
      );
      
      // Store contest data
      for (const contest of contestRes.data.result) {
        await Contest.findOneAndUpdate(
          { studentId: student._id, contestId: contest.contestId },
          {
            studentId: student._id,
            contestId: contest.contestId,
            contestName: contest.contestName,
            rank: contest.rank,
            oldRating: contest.oldRating,
            newRating: contest.newRating,
            ratingChange: contest.newRating - contest.oldRating,
            participationTimeSeconds: contest.ratingUpdateTimeSeconds
          },
          { upsert: true }
        );
      }

      // Fetch submissions
      const submissionRes = await axios.get(
        `https://codeforces.com/api/user.status?handle=${student.cfHandle}`
      );
      
      // Store submission data
      for (const sub of submissionRes.data.result.slice(0, 1000)) { // Limit to recent 1000
        await Submission.findOneAndUpdate(
          { submissionId: sub.id },
          {
            studentId: student._id,
            submissionId: sub.id,
            contestId: sub.contestId,
            problemIndex: sub.problem.index,
            problemName: sub.problem.name,
            problemRating: sub.problem.rating,
            verdict: sub.verdict,
            creationTimeSeconds: sub.creationTimeSeconds,
            programmingLanguage: sub.programmingLanguage
          },
          { upsert: true }
        );
      }

      // Inactivity check: submissions in last 7 days?
      const recent = submissionRes.data.result.filter(
        (s) =>
          new Date(s.creationTimeSeconds * 1000) >=
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

      if (recent.length === 0 && !student.disableAutoEmail) {
        await sendReminderEmail(student.email, student.name);
        student.inactivityRemindersSent += 1;
        console.log(`Reminder sent to ${student.name} (Total: ${student.inactivityRemindersSent})`);
      }

      // Save updated student
      await student.save();

    } catch (err) {
      console.error(`Failed to update ${student.name}:`, err.message);
    }
  }
};

// Schedule with cron
let job = cron.schedule(cronExpression, fetchAndUpdateCodeforcesData);

// Function to update single student's CF data (for real-time updates)
const updateSingleStudentCFData = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student || !student.cfHandle) return;

  try {
    const res = await axios.get(
      `https://codeforces.com/api/user.info?handles=${student.cfHandle}`
    );
    const data = res.data.result[0];

    student.currentRating = data.rating || 0;
    student.maxRating = data.maxRating || 0;
    student.lastCFUpdate = new Date();
    student.lastSyncedAt = new Date();

    await student.save();
    console.log(`Updated CF data for ${student.name}`);
  } catch (err) {
    console.error(`Failed to update CF data for ${student.name}:`, err.message);
  }
};

module.exports = {
  job,
  updateCronSchedule: (newExpression) => {
    job.stop();
    cronExpression = newExpression;
    job = cron.schedule(cronExpression, fetchAndUpdateCodeforcesData);
    console.log(`Cron schedule updated to: ${cronExpression}`);
  },
  fetchAndUpdateCodeforcesData,
  updateSingleStudentCFData,
  getCurrentCronExpression: () => cronExpression
};
