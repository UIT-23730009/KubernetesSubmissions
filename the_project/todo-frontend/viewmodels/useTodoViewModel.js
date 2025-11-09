import { useEffect, useState, useCallback } from "react";
import { TodoModel } from "../models/TodoModel";

export function useTodoViewModel() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await TodoModel.fetchAll();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = async (title) => {
    const newTodo = await TodoModel.add({ title, done: false });
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = async (id, done) => {
    const updated = await TodoModel.toggle(id, done);
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: updated.done } : t))
    );
  };

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return { todos, loading, error, addTodo, toggleTodo };
}
