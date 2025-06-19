const cron = require('node-cron');
const Student = require('../models/Student');
const cfController = require('../controllers/codeforcesController');
const emailController = require('../controllers/emailController');
const Submission = require('../models/Submission');

const runDailySync = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log('Running daily CF sync at 2 AM');
    const students = await Student.find();

    for (const student of students) {
      try {
        await cfController.syncStudentCF({ params: { id: student._id } }, { json: () => {} });
        
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const submissions = await Submission.find({
          student: student._id,
          date: { $gte: lastWeek }
        });

        if (submissions.length === 0 && !student.disableAutoEmail) {
          await emailController.sendInactivityReminder(student);
        }
      } catch (err) {
        console.error(err);
      }
    }
  });
};

module.exports = runDailySync;
