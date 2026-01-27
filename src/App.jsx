import React, { useState, useEffect } from "react";
import './index.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null); // edit ke liye

  // Fetch todos from backend
  const fetchTodos = async () => {
    const res = await fetch("http://localhost:3000/todos");
    const data = await res.json();
    setTodos(data.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add or Edit todo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    if (editId) {
      // EDIT
      const res = await fetch(`http://localhost:3000/todo/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      setTodos(todos.map(todo => todo.id === editId ? data.data : todo));
      setEditId(null);
    } else {
      // ADD
      const res = await fetch("http://localhost:3000/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      setTodos([...todos, data.data]);
    }

    setTitle("");
    setDescription("");
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:3000/todo/${id}`, { method: "DELETE" });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Set todo for editing
  const editTodo = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setEditId(todo.id);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>📋 Todo App</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "10px", borderRadius: "5px", backgroundColor: editId ? "#f39c12" : "#3498db", color: "white", fontWeight: "bold", border: "none", cursor: "pointer" }}>
          {editId ? "Update Todo" : "Add Todo"}
        </button>
      </form>

      {/* Todo List */}
      <ul style={{ listStyle: "none", padding: "0", marginTop: "30px" }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ backgroundColor: "#ecf0f1", padding: "15px", borderRadius: "5px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{todo.title}</strong> <br />
              <span style={{ color: "#7f8c8d" }}>{todo.description}</span>
            </div>
            <div>
              <button
                onClick={() => editTodo(todo)}
                style={{ backgroundColor: "#f39c12", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", marginRight: "5px" }}
              >
                Edit
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{ backgroundColor: "#e74c3c", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
