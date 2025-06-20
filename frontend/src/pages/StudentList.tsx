import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastSyncedAt?: string;
  lastCFUpdate?: string;
  inactivityRemindersSent: number;
  disableAutoEmail?: boolean;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(res => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch students');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/students/${id}`);
    setStudents(students.filter(s => s.id !== id));
  };

  const updateStudent = async (updatedStudent: Student) => {
    await axios.put(`http://localhost:5000/api/students/${updatedStudent.id}`, updatedStudent);
    setStudents(prev =>
      prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const downloadCSV = () => {
    const header = [
      'Name',
      'Email',
      'Phone',
      'Codeforces Handle',
      'Current Rating',
      'Max Rating',
      'Last Synced At',
      'Auto Reminder Enabled'
    ];
    const rows = students.map(s => [
      s.name,
      s.email,
      s.phone,
      s.codeforcesHandle,
      s.currentRating,
      s.maxRating,
      s.lastSyncedAt || '',
      s.disableAutoEmail ? 'No' : 'Yes'
    ]);
    let csv = header.join(',') + '\n';
    csv += rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Student List</h2>
        <div>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded mr-2"
            onClick={() => navigate('/add')}
          >
            Add Student
          </button>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={downloadCSV}
          >
            Download CSV
          </button>
        </div>
      </div>
      <table className="min-w-full mb-8 border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800">
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Codeforces Handle</th>
            <th className="py-2 px-4 border-b">Current Rating</th>
            <th className="py-2 px-4 border-b">Max Rating</th>
            <th className="py-2 px-4 border-b">Last CF Update</th>
            <th className="py-2 px-4 border-b">Reminders Sent</th>
            <th className="py-2 px-4 border-b">Auto Reminder</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id} className="text-center">
              <td className="py-2 px-4 border-b">{student.name}</td>
              <td className="py-2 px-4 border-b">{student.email}</td>
              <td className="py-2 px-4 border-b">{student.phone}</td>
              <td className="py-2 px-4 border-b">{student.codeforcesHandle}</td>
              <td className="py-2 px-4 border-b">{student.currentRating}</td>
              <td className="py-2 px-4 border-b">{student.maxRating}</td>
              <td className="py-2 px-4 border-b">
                {student.lastCFUpdate
                  ? new Date(student.lastCFUpdate).toLocaleString()
                  : 'Never'}
              </td>
              <td className="py-2 px-4 border-b">{student.inactivityRemindersSent || 0}</td>
              <td className="py-2 px-4 border-b">
                <input
                  type="checkbox"
                  checked={!student.disableAutoEmail}
                  onChange={e =>
                    updateStudent({
                      ...student,
                      disableAutoEmail: !e.target.checked
                    })
                  }
                />
              </td>
              <td className="py-2 px-4 border-b flex gap-2 justify-center">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => navigate(`/student/${student.id}`)}
                >
                  View
                </button>
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => navigate(`/edit/${student.id}`)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;