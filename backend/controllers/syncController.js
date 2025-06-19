import cron from 'node-cron';
import Student from '../models/Student';
import Submission from '../models/Submission';
import { syncStudentCF } from './codeforcesController';
import { sendReminder } from './emailController';

export async function syncAllStudents() {
  const students = await Student.find();
  for (let s of students) {
    await syncStudentCF(s._id);

    const oneWeekAgo = new Date(Date.now() - 7 * 24*60*60*1000);
    const recent = await Submission.exists({ student: s._id, date: { $gt: oneWeekAgo }, verdict: 'OK' });

    if (!recent && !s.disableReminders) {
      await sendReminder(s);
      s.reminderCount++;
      await s.save();
    }
  }
}

// Run at 2 AM daily
cron.schedule('0 2 * * *', () => {
  console.log('[Cron] Starting daily CF sync + inactivity checks');
  syncAllStudents().catch(console.error);
});
