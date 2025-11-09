import React, { useState } from "react";
import { useTodoViewModel } from "../viewmodels/useTodoViewModel";

export default function TodoListView() {
  const { todos, loading, error, addTodo, toggleTodo } = useTodoViewModel();
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await addTodo(newTitle);
    setNewTitle("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="todo-list">
      <h1>Todo List (MVVM)</h1>
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="New todo"
      />
      <button onClick={handleAdd}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id, !todo.done)}
              />
              {todo.title}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
