🎓 Student Progress Management System

A full-stack web application to manage student details and track their Codeforces competitive programming progress.
Built with Node.js, Express, MongoDB, React, TypeScript, and Tailwind CSS.

Demo video Link :https://drive.google.com/file/d/1G9WBI1Kzu7hiOvBWIatDuq1okPQLabvX/view?usp=sharing

✨ Features

📋 Student Table View

✅ View all enrolled students in a responsive table.

✅ Display:
Name

Email

Phone Number

Codeforces Handle

Current Rating

Max Rating


✅ Actions:

Add, Edit, Delete student records

Download student data as CSV

View Profile with detailed progress

👤 Student Profile View

Click on a student to view:

📈 1. Contest History

Filter by last 30, 90, or 365 days

Display:

Rating graph

List of contests with:

Rating changes

Ranks

Number of unsolved problems till date

🧩 2. Problem Solving Data

Filter by last 7, 30, or 90 days

Show:

Most difficult problem solved (by rating)

Total problems solved

Average problem rating

Average problems solved per day

Bar chart of solved problems per rating bucket

Submission heat map

🔄 Codeforces Data Sync
Daily sync via cron job (default: 2 AM)

Sync time & frequency configurable

Show last sync timestamp for each student in the table

If a student’s CF handle is updated, their data re-syncs immediately
![image](https://github.com/user-attachments/assets/205325b4-f046-491c-aa9c-697f2bd75f24)


📧 Inactivity Detection

After each sync, detect students with no submissions in the last 7 days

Auto-send reminder emails encouraging them to resume solving

Track the number of reminders sent per student

Option to disable automatic reminders per student

🎁 Bonus Features

✅ Fully responsive UI (mobile & tablet)

✅ Light & Dark mode with toggle

✅ Clean, well-documented codebase for easy maintenance

⚙️ Tech Stack
Frontend: React, TypeScript, Tailwind CSS, react-hook-form

Backend: Node.js, Express, MongoDB

Charts & Visuals: Chart.js, react-calendar-heatmap (or similar)

Email: Nodemailer + cron job for reminders

Deployment: Easily deployable on Vercel / Heroku / Railway

🚀 Getting Started

1️⃣ Clone the repository:

git clone 

cd student-progress-management-system

2️⃣ Install dependencies:
Backend:


cd backend

npm install

Frontend:


cd ../frontend

npm install

3️⃣ Setup environment variables:

Add .env in backend with:


MONGODB_URI=<your_mongodb_uri>

EMAIL_USER=<your_email>

EMAIL_PASS=<your_email_password>

4️⃣ Run locally:

# In backend folder
npm run dev

# In frontend folder (new terminal)
npm run dev
5️⃣ Build for production:

# In frontend

npm run build

📅 Cron Job

Uses node-cron to fetch Codeforces data daily.

You can adjust the schedule in cron.js:


cron.schedule('0 2 * * *', fetchData); // 2 AM daily

Feel free to fork, improve, and share!

🙌 Contributing
Pull requests are welcome!
For major changes, please open an issue first to discuss what you’d like to change.

💡 TODO / Future Improvements

User authentication & roles (Admin, Student)

Export more formats (Excel, PDF)

Notifications in UI for reminders

More advanced Codeforces analytics
