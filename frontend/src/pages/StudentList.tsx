import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentForm from '../components/StudentForm';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
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

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:5000/api/students/${id}`);
    setStudents(students.filter(s => s.id !== id));
  };

  const downloadCSV = () => {
    const header = ['Name', 'Email', 'Phone', 'Codeforces Handle', 'Current Rating', 'Max Rating'];
    const rows = students.map(s => [s.name, s.email, s.phone, s.codeforcesHandle, s.currentRating, s.maxRating]);
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

  const handleAdd = () => {
    setEditStudent(null);
    setFormOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditStudent(student);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: Omit<Student, 'id'>, id?: number) => {
    if (id) {
      // Edit
      const res = await axios.put(`http://localhost:5000/api/students/${id}`, data);
      setStudents(students.map(s => (s.id === id ? res.data : s)));
    } else {
      // Add
      const res = await axios.post('http://localhost:5000/api/students', data);
      setStudents([...students, res.data]);
    }
    setFormOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <StudentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editStudent}
      />
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold mb-2">Student List</h2>
        <div className="flex gap-2 mb-2">
          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm sm:text-base" onClick={handleAdd}>Add Student</button>
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm sm:text-base" onClick={downloadCSV}>Download CSV</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full mb-8 border border-gray-300 dark:border-gray-700 text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="py-2 px-2 sm:px-4 border-b">Name</th>
              <th className="py-2 px-2 sm:px-4 border-b">Email</th>
              <th className="py-2 px-2 sm:px-4 border-b">Phone</th>
              <th className="py-2 px-2 sm:px-4 border-b">Codeforces Handle</th>
              <th className="py-2 px-2 sm:px-4 border-b">Current Rating</th>
              <th className="py-2 px-2 sm:px-4 border-b">Max Rating</th>
              <th className="py-2 px-2 sm:px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="text-center">
                <td className="py-2 px-2 sm:px-4 border-b">{student.name}</td>
                <td className="py-2 px-2 sm:px-4 border-b">{student.email}</td>
                <td className="py-2 px-2 sm:px-4 border-b">{student.phone}</td>
                <td className="py-2 px-2 sm:px-4 border-b">{student.codeforcesHandle}</td>
                <td className="py-2 px-2 sm:px-4 border-b">{student.currentRating}</td>
                <td className="py-2 px-2 sm:px-4 border-b">{student.maxRating}</td>
                <td className="py-2 px-2 sm:px-4 border-b flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs sm:text-sm w-full sm:w-auto" onClick={() => navigate(`/student/${student.id}`)}>View</button>
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded text-xs sm:text-sm w-full sm:w-auto" onClick={() => handleEdit(student)}>Edit</button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm w-full sm:w-auto" onClick={() => handleDelete(student.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;