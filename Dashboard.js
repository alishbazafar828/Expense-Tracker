import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const fetchExpenses = async () => {
    try {
      if (!token) return;
      const res = await api.get("/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.log("Fetch Error:", err?.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      if (!title || !amount || !category) return;
      await api.post(
        "/expenses",
        { title, amount: Number(amount), category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle(""); setAmount(""); setCategory("");
      fetchExpenses();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (err) {
      console.log("Delete Error:", err?.response?.data || err.message);
    }
  };

  const startEdit = (exp) => {
    setEditingId(exp._id);
    setEditTitle(exp.title);
    setEditAmount(exp.amount);
    setEditCategory(exp.category);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle(""); setEditAmount(""); setEditCategory("");
  };

  const saveEdit = async (id) => {
    try {
      await api.put(
        `/expenses/${id}`,
        { title: editTitle, amount: Number(editAmount), category: editCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      cancelEdit();
      fetchExpenses();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update expense");
    }
  };

  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">

        <div className="alert alert-primary">
          <h4 className="mb-0">Total Expense: ${total.toFixed(2)}</h4>
        </div>

        <div className="card p-3 mb-4 shadow-sm">
          <h5 className="mb-3">Add Expense</h5>
          <form onSubmit={addExpense}>
            <div className="row g-2">
              <div className="col-12 col-md">
                <input className="form-control" placeholder="Title" value={title}
                  onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="col-12 col-md">
                <input className="form-control" type="number" placeholder="Amount" value={amount}
                  onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <div className="col-12 col-md">
                <input className="form-control" placeholder="Category" value={category}
                  onChange={(e) => setCategory(e.target.value)} required />
              </div>
              <div className="col-12 col-md-auto">
                <button type="submit" className="btn btn-success w-100">Add</button>
              </div>
            </div>
          </form>
        </div>

        {expenses.length === 0 && (
          <p className="text-muted text-center">No expenses yet. Add one above!</p>
        )}

        {expenses.map((exp) => (
          <div key={exp._id} className="card mb-2 shadow-sm">
            {editingId === exp._id ? (
              <div className="card-body">
                <div className="row g-2">
                  <div className="col-12 col-md">
                    <input className="form-control" value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)} />
                  </div>
                  <div className="col-12 col-md">
                    <input className="form-control" type="number" value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)} />
                  </div>
                  <div className="col-12 col-md">
                    <input className="form-control" value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)} />
                  </div>
                  <div className="col-12 col-md-auto d-flex gap-2">
                    <button className="btn btn-primary" onClick={() => saveEdit(exp._id)}>Save</button>
                    <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <b>{exp.title}</b>
                  <span className="badge bg-secondary ms-2">{exp.category}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold">${Number(exp.amount).toFixed(2)}</span>
                  <button className="btn btn-warning btn-sm" onClick={() => startEdit(exp)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteExpense(exp._id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}