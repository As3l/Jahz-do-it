"use client";

import { useEffect, useState } from "react";
import { getTodos, createTodo, deleteTodo, updateTodo } from "@/lib/api";

type Todo = {
  id: number;
  title: string;
  status: "active" | "completed";
  createdAt?: string;
};

type Filter = "all" | "active" | "done";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(iso?: string) {
  const d = iso ? new Date(iso) : new Date();
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  const loadTodos = async () => {
    const data = await getTodos();
    setTodos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    await createTodo(trimmed);
    setTitle("");
    loadTodos();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  const handleToggle = async (todo: Todo) => {
    await updateTodo(todo.id, {
      status: todo.status === "completed" ? "active" : "completed",
    });
    loadTodos();
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    loadTodos();
  };

  const now = new Date();
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const dateLabel = `${days[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;

  const isDone = (t: Todo) => t.status === "completed";

  const total = todos.length;
  const done = todos.filter(isDone).length;
  const remaining = total - done;

  const filtered = todos.filter((t) => {
    if (filter === "done") return isDone(t);
    if (filter === "active") return !isDone(t);
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900">Jahz Do It</h1>
          <p className="text-sm text-gray-400 mt-1">{dateLabel}</p>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task…"
          />
          <button
            onClick={handleAdd}
            className="h-10 px-4 bg-purple-600 hover:bg-purple-700 active:scale-95 text-purple-50 text-sm font-medium rounded-lg flex items-center gap-1.5 transition whitespace-nowrap"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Add task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: "Total", value: total },
            { label: "Done", value: done },
            { label: "Remaining", value: remaining },
          ].map((s) => (
            <div key={s.label} className="bg-gray-100 rounded-lg px-3 py-3">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className="text-xl font-medium text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {(["all", "active", "done"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-sm rounded-full border transition ${
                filter === f
                  ? "bg-purple-50 text-purple-700 border-purple-300 font-medium"
                  : "text-gray-400 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo list */}
        <div className="flex flex-col gap-2">
          {loading ? (
            <p className="text-center text-sm text-gray-400 py-12">Loading…</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 opacity-40" aria-hidden="true">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
              </svg>
              <p className="text-sm">
                {filter === "done"
                  ? "No completed tasks yet."
                  : filter === "active"
                  ? "All caught up!"
                  : "No tasks yet. Add one above."}
              </p>
            </div>
          ) : (
            filtered.map((todo) => (
              <div
                key={todo.id}
                className={`group bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 transition ${
                  isDone(todo) ? "opacity-60" : ""
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleToggle(todo)}
                  aria-label={isDone(todo) ? "Mark incomplete" : "Mark complete"}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                    isDone(todo)
                      ? "bg-purple-600 border-purple-600"
                      : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                  }`}
                >
                  {isDone(todo) && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm text-gray-900 truncate ${isDone(todo) ? "line-through text-gray-400" : ""}`}>
                    {todo.title}
                  </p>
                  <p className="text-xs text-gray-300 mt-0.5">{formatDate(todo.createdAt)}</p>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(todo.id)}
                  aria-label="Delete task"
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                    <path d="M2 3.5h10M5.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M3.5 3.5l.7 7.5a1 1 0 001 .9h3.6a1 1 0 001-.9l.7-7.5"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}