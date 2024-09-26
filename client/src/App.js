import React, { useState, useEffect } from "react";
import './index.css';

const API_BASE = "http://localhost:4000";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const response = await fetch(`${API_BASE}/todos`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  const completeTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/todo/complete/${id}`, { method: "PUT" });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setTodos(todos.map(todo => todo._id === data._id ? { ...todo, completed: data.completed } : todo));
    } catch (err) {
      console.error("Error completing todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/todo/delete/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setTodos(todos.filter(todo => todo._id !== data._id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const addTodo = async () => {
    try {
      const response = await fetch(`${API_BASE}/todos/new`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo }),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodo("");
      setPopupActive(false);
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  return (
    <div className="App">
      <h1>Welcome Daniyal</h1>
      <h4>Your Tasks</h4>

      <div className="todos">
        {todos.map((todo) => (
          <div
            className={`todo${todo.completed ? " is-complete" : ""}`}
            key={todo._id}
            onClick={() => completeTodo(todo._id)}
          >
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
            <div className="delete-todo" onClick={(e) => { e.stopPropagation(); deleteTodo(todo._id); }}>X</div>
          </div>
        ))}
        <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>
        {popupActive && (
          <div className="popup">
            <div className="closePopup" onClick={() => setPopupActive(false)}>X</div>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="New Todo"
            />
            <button onClick={addTodo}>Add</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
