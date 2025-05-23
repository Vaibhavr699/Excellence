import React, { useState, useContext } from 'react';
import axios from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

export default function NewArticle({ history }) {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/articles', {
        title,
        content,
        tags: tags.split(',').map(t => t.trim()),
        createdBy: user.username,
      });
      alert('Article created!');
      window.location.href = '/dashboard';
    } catch (err) {
      alert('Failed to create article');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Article</h2>

      <label>Title</label>
      <input value={title} onChange={e => setTitle(e.target.value)} required />

      <label>Content</label>
      <textarea value={content} onChange={e => setContent(e.target.value)} required />

      <label>Tags (comma separated)</label>
      <input value={tags} onChange={e => setTags(e.target.value)} />

      <button type="submit">Create</button>
    </form>
  );
}
