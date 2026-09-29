import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useFanHub } from '../context/FanHubContext.jsx';
import { api } from '../services/api.js';

export default function AdminEditor() {
  const { user, editItem, setEditItem, saveContent, flash } = useFanHub();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState(editItem?.title || '');
  const [categoryId, setCategoryId] = useState(editItem?.categoryId || '');
  const [type, setType] = useState(editItem?.type || 'article');
  const [genre, setGenre] = useState(editItem?.genre || '');
  const [releaseYear, setReleaseYear] = useState(editItem?.releaseYear || '');
  const [image, setImage] = useState(editItem?.image || '');
  const [mediaUrl, setMediaUrl] = useState(editItem?.mediaUrl || '');
  const [description, setDescription] = useState(editItem?.description || '');
  const [tags, setTags] = useState(
    Array.isArray(editItem?.tags) ? editItem.tags.join(', ') : ''
  );
  const [popularityScore, setPopularityScore] = useState(
    editItem?.popularityScore ?? 0
  );
  const [status, setStatus] = useState(editItem?.status || 'active');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);

        if (editItem?.categoryId) {
          setCategoryId(editItem.categoryId);
          return;
        }

        if (editItem?.category) {
          const foundCategory = data.find((item) => {
            return item.name.toLowerCase() === editItem.category.toLowerCase();
          });

          if (foundCategory) {
            setCategoryId(foundCategory._id);
            return;
          }
        }

        if (data.length > 0) {
          setCategoryId(data[0]._id);
        }
      } catch (error) {
        flash(error.message);
      }
    };

    loadCategories();
  }, [editItem]);

  if (user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const makeTagList = () => {
    const tagList = [];
    const parts = tags.split(',');

    parts.forEach((tag) => {
      const cleanTag = tag.trim();

      if (cleanTag) {
        tagList.push(cleanTag);
      }
    });

    return tagList;
  };

  const save = async (event) => {
    event.preventDefault();

    const payload = {
      title,
      category: categoryId,
      type,
      description,
      genre,
      releaseYear: releaseYear ? Number(releaseYear) : undefined,
      image,
      mediaUrl,
      tags: makeTagList(),
      popularityScore: Number(popularityScore) || 0,
      status
    };

    if (editItem?.id) {
      payload.id = editItem.id;
    }

    try {
      await saveContent(payload);
      setEditItem(null);
      flash('Content saved', true);
      navigate('/admin');
    } catch (error) {
      flash(error.message || 'Save failed');
    }
  };

  return (
    <form className="panel editor" onSubmit={save}>
      <span className="eyebrow">ADMIN / CONTENT EDITOR</span>

      <h1>{editItem?.id ? 'Edit content' : 'Add content'}</h1>

      <label>
        Title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </label>

      <label>
        Category
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          required
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Content Type
        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="article">Article</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="image">Image</option>
        </select>
      </label>

      <label>
        Genre
        <input
          value={genre}
          onChange={(event) => setGenre(event.target.value)}
          placeholder="Action"
        />
      </label>

      <label>
        Release Year
        <input
          type="number"
          value={releaseYear}
          onChange={(event) => setReleaseYear(event.target.value)}
          placeholder="2026"
        />
      </label>

      <label>
        Image URL
        <input
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://..."
        />
      </label>

      <label>
        Media URL
        <input
          value={mediaUrl}
          onChange={(event) => setMediaUrl(event.target.value)}
          placeholder="https://..."
        />
      </label>

      <label>
        Description
        <textarea
          rows="6"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </label>

      <label>
        Tags
        <input
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="anime, naruto, action"
        />
      </label>

      <label>
        Popularity Score
        <input
          type="number"
          value={popularityScore}
          onChange={(event) => setPopularityScore(event.target.value)}
        />
      </label>

      <label>
        Status
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>

      <div className="actions">
        <button className="primary">Save content</button>

        <button
          type="button"
          className="ghost"
          onClick={() => navigate('/admin')}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
