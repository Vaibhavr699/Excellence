import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom'; // or next/router for Next.js
import axios from '../utils/api'; // axios instance with auth
import { AuthContext } from '../context/AuthContext';

export default function ArticleView() {

  const canEdit = user?.role === 'admin' || user?.username === article.createdBy;
  const canDelete = user?.role === 'admin';
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await axios.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error('Failed to fetch article', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  const handleSummarize = async () => {
    if (!article) return;
    setSummarizing(true);
    try {
      const res = await axios.post(`/articles/${id}/summarize`);
      setArticle((prev) => ({ ...prev, summary: res.data.summary }));
    } catch (err) {
      console.error('Failed to summarize', err);
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) return <p>Loading article...</p>;
  if (!article) return <p>Article not found</p>;

  const isOwner = user?.username === article.createdBy;
  const isAdmin = user?.role === 'admin';

  return (
    <div>
      <h1>{article.title}</h1>
      <p><strong>By:</strong> {article.createdBy}</p>
      <p>{article.content}</p>
      <p><strong>Tags:</strong> {article.tags.join(', ')}</p>
      <p><strong>Summary:</strong> {article.summary || 'No summary yet.'}</p>

      <button onClick={handleSummarize} disabled={summarizing}>
        {summarizing ? 'Summarizing...' : 'Summarize'}
      </button>

      {(isOwner || isAdmin) && (
        <button onClick={() => window.location.href = `/articles/edit/${id}`}>
          Edit Article
        </button>
      )}

      {isAdmin && (
        <button onClick={async () => {
          if (window.confirm('Are you sure you want to delete this article?')) {
            try {
              await axios.delete(`/articles/${id}`);
              alert('Article deleted');
              window.location.href = '/dashboard';
            } catch (err) {
              alert('Delete failed');
            }
          }
        }}>
          Delete Article
        </button>
      )}
    </div>
  );
}
