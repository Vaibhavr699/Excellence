import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

export default function EditArticle() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await axios.get(`/articles/${id}`);
        const art = res.data;
        setTitle(art.title);
        setContent(art.content);
        setTags(art.tags.join(', '));
      } catch (err) {
        alert('Failed to load article');
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/articles/${id}`, {
        title,
        content,
        tags: tags.split(',').map(t => t.trim()),
      });
      alert('Article updated!');
      window.location.href = `/articles/${id}`;
    } catch (err) {
      alert('Failed to update article');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Article</h2>

      <label>Title</label>
      <input value={title} onChange={e => setTitle(e.target.value)} required />

      <label>Content</label>
      <textarea value={content} onChange={e => setContent(e.target.value)} required />

      <label>Tags (comma separated)</label>
      <input value={tags} onChange={e => setTags(e.target.value)} />

      <button type="submit">Update</button>
    </form>
  );
}
