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
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(res => {
        setStudents(res.data);
        setFilteredStudents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch students');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.codeforcesHandle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      switch (ratingFilter) {
        case 'beginner':
          filtered = filtered.filter(s => s.currentRating < 1200);
          break;
        case 'pupil':
          filtered = filtered.filter(s => s.currentRating >= 1200 && s.currentRating < 1400);
          break;
        case 'specialist':
          filtered = filtered.filter(s => s.currentRating >= 1400 && s.currentRating < 1600);
          break;
        case 'expert':
          filtered = filtered.filter(s => s.currentRating >= 1600);
          break;
      }
    }

    // Status filter
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'active':
          filtered = filtered.filter(s => s.currentRating > 0);
          break;
        case 'inactive':
          filtered = filtered.filter(s => (s.inactivityRemindersSent || 0) > 0);
          break;
        case 'no-rating':
          filtered = filtered.filter(s => s.currentRating === 0);
          break;
      }
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, ratingFilter, statusFilter]);

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
    <div className="p-2 md:p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Student Progress Management</h1>
        <p className="text-blue-100 mb-4">Track, analyze, and improve your students' competitive programming journey</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>Real-time Codeforces sync</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
            <span>Automated progress tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
            <span>Inactivity alerts</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{filteredStudents.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Showing Students</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{filteredStudents.filter(s => s.currentRating > 0).length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Coders</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{Math.round(filteredStudents.reduce((sum, s) => sum + (s.currentRating || 0), 0) / filteredStudents.length) || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{filteredStudents.filter(s => (s.inactivityRemindersSent || 0) > 0).length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Need Attention</div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, or handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rating Level</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner (&lt;1200)</option>
              <option value="pupil">Pupil (1200-1399)</option>
              <option value="specialist">Specialist (1400-1599)</option>
              <option value="expert">Expert (1600+)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active (Has Rating)</option>
              <option value="inactive">Needs Attention</option>
              <option value="no-rating">No Rating</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setRatingFilter('all');
                setStatusFilter('all');
              }}
              className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-1">Student Directory</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage and monitor student progress</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm md:text-base transition-colors flex items-center gap-2"
              onClick={() => navigate('/add')}
            >
              <span>+</span> Add Student
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm md:text-base transition-colors flex items-center gap-2"
              onClick={downloadCSV}
            >
              <span>↓</span> Export CSV
            </button>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm md:text-base transition-colors flex items-center gap-2"
              onClick={() => navigate('/settings')}
            >
              <span>⚙️</span> Settings
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full mb-8 border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Name</th>
              <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Email</th>
              <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Phone</th>
              <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">CF Handle</th>
              <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Rating</th>
              <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Max</th>
              <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Updated</th>
              <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Reminders</th>
              <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Auto</th>
              <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Actions</th>
            </tr>
          </thead>
        <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id} className="text-center">
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">{student.name || 'N/A'}</td>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">{student.email || 'N/A'}</td>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">{student.phone || 'N/A'}</td>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm font-mono">{student.codeforcesHandle || 'N/A'}</td>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">{student.currentRating || 0}</td>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">{student.maxRating || 0}</td>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">
                  {student.lastCFUpdate
                    ? new Date(student.lastCFUpdate).toLocaleDateString()
                    : 'Never'}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">{student.inactivityRemindersSent || 0}</td>
                <td className="py-2 px-2 md:px-4 border-b">
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
                <td className="py-2 px-2 md:px-4 border-b">
                  <div className="flex flex-col md:flex-row gap-1">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => navigate(`/student/${student.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => navigate(`/edit/${student.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Last updated: {new Date().toLocaleString()} | Showing: {filteredStudents.length} of {students.length} students</p>
      </div>
    </div>
  );
};

export default StudentList;