const API_URL = "/api/v1.4";

export const TodoModel = {
  async fetchAll() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to load todos");
    return res.json();
  },

  async add(todo) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error("Failed to create todo");
    return res.json();
  },

  async toggle(id, done) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    });
    if (!res.ok) throw new Error("Failed to update todo");
    return res.json();
  },
};
