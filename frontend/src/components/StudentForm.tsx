import React, { useState, useEffect } from 'react';

interface Student {
  id?: number;
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
}

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (student: Omit<Student, 'id'>, id?: number) => void;
  initialData?: Student | null;
}

const StudentForm: React.FC<StudentFormProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState<Omit<Student, 'id'>>({
    name: '',
    email: '',
    phone: '',
    codeforcesHandle: '',
    currentRating: 0,
    maxRating: 0,
  });
  const [errors, setErrors] = useState<{ phone?: string; email?: string }>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        codeforcesHandle: initialData.codeforcesHandle,
        currentRating: initialData.currentRating,
        maxRating: initialData.maxRating,
      });
    } else {
      setForm({ name: '', email: '', phone: '', codeforcesHandle: '', currentRating: 0, maxRating: 0 });
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const errs: { phone?: string; email?: string } = {};
    if (!/^\d{10}$/.test(form.phone)) {
      errs.phone = 'Phone must be exactly 10 digits';
    }
    if (!/^.+@gmail\.com$/.test(form.email)) {
      errs.email = 'Email must end with @gmail.com';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2 sm:px-0 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 sm:p-6 rounded shadow-lg w-full max-w-md mx-auto overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">{initialData ? 'Edit Student' : 'Add Student'}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (!validate()) return;
            onSubmit(form, initialData?.id);
          }}
          className="space-y-3"
        >
          <input className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <input className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          {errors.email && <div className="text-xs text-red-500">{errors.email}</div>}
          <input className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
          {errors.phone && <div className="text-xs text-red-500">{errors.phone}</div>}
          <input className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" placeholder="Codeforces Handle" value={form.codeforcesHandle} onChange={e => setForm(f => ({ ...f, codeforcesHandle: e.target.value }))} required />
          <input className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" type="number" placeholder="0 (default)" value={form.currentRating} onChange={e => setForm(f => ({ ...f, currentRating: Number(e.target.value) }))} required />
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">If unknown, leave as 0</div>
          <input className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" type="number" placeholder="0 (default)" value={form.maxRating} onChange={e => setForm(f => ({ ...f, maxRating: Number(e.target.value) }))} required />
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">If unknown, leave as 0</div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 w-full sm:w-auto" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white w-full sm:w-auto">{initialData ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
