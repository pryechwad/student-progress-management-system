import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddStudent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    codeforcesHandle: "",
    currentRating: 0,
    maxRating: 0,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Sending data:', form);
      const response = await axios.post("http://localhost:5000/api/students", form);
      console.log('Response:', response.data);
      navigate("/");
    } catch (err: any) {
      console.error("Error adding student:", err);
      const errorMsg = err.response?.data?.error || err.message || "Failed to add student";
      alert(`Failed to add student: ${errorMsg}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="text"
          placeholder="Codeforces Handle"
          value={form.codeforcesHandle}
          onChange={(e) => setForm({ ...form, codeforcesHandle: e.target.value })}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="number"
          placeholder="Current Rating"
          value={form.currentRating}
          onChange={(e) => setForm({ ...form, currentRating: Number(e.target.value) })}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="number"
          placeholder="Max Rating"
          value={form.maxRating}
          onChange={(e) => setForm({ ...form, maxRating: Number(e.target.value) })}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Student
        </button>
      </form>
    </div>
  );
}
