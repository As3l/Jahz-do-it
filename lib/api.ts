const BASE_URL = "http://localhost:3008/api/todos";

export const getTodos = async () => {
  const res = await fetch(`${BASE_URL}`, {
    cache: "no-store",
  });
  return res.json();
};

export const createTodo = async (title: string, description: string) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  return res.json();
};

export const deleteTodo = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE", 
  });
  return res.text();
};

export const updateTodo = async (id: number, data: any) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};