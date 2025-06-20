import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    codeforcesHandle: "",
    currentRating: 0,
    maxRating: 0,
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/students/${id}`);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          codeforcesHandle: res.data.codeforcesHandle || "",
          currentRating: res.data.currentRating || 0,
          maxRating: res.data.maxRating || 0,
        });
      } catch (err) {
        console.error("Error fetching student:", err);
        alert("Failed to fetch student data");
      }
    };

    fetchStudent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/students/${id}`, form);
      navigate("/");
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Failed to update student");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Codeforces Handle"
          value={form.codeforcesHandle}
          onChange={(e) => setForm({ ...form, codeforcesHandle: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Current Rating"
          value={form.currentRating}
          onChange={(e) => setForm({ ...form, currentRating: Number(e.target.value) })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Max Rating"
          value={form.maxRating}
          onChange={(e) => setForm({ ...form, maxRating: Number(e.target.value) })}
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Student
        </button>
      </form>
    </div>
  );
}
