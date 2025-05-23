import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../components/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get("/articles");
        setArticles(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArticles();
  }, []);

  const filtered = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await api.delete(`/articles/${id}`);
      setArticles(articles.filter((a) => a._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Dashboard</h1>

      <input
        type="search"
        placeholder="Search articles"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <ul>
        {filtered.map((article) => (
          <li
            key={article._id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <strong className="text-lg text-gray-900">{article.title}</strong>
              <p className="text-sm text-gray-600 mt-1">
                Tags:{" "}
                {article.tags.length > 0
                  ? article.tags.join(", ")
                  : "No tags"}
              </p>
            </div>

            {user?.role === "admin" && (
              <button
                onClick={() => handleDelete(article._id)}
                className="mt-3 sm:mt-0 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            )}
          </li>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No articles found.</p>
        )}
      </ul>
    </div>
  );
}
