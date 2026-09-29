import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PageHeading from '../components/PageHeading.jsx';
import { api } from '../services/api.js';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function FanSubmission() {
  const { user, addNotification } = useFanHub();
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('article');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  const [categories, setCategories] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadSubmissions = async () => {
    try {
      const data = await api.getMySubmissions();
      setSubmissions(data);
    } catch {
      setSubmissions([]);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);

        if (data.length) {
          setCategory(data[0].name);
        }
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
    loadSubmissions();
  }, []);

  if (!user || !localStorage.getItem('fh_token')) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !category || !content) {
      setMessage('Please fill all required fields.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      await api.createSubmission({
        title,
        contentType,
        category,
        content,
        image
      });

      setTitle('');
      setContent('');
      setImage('');
      setContentType('article');

      setMessage('Submission sent for admin approval.');
      addNotification('Submission sent for admin approval');

      await loadSubmissions();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeading
        title="Fan Submission"
        description="Submit your article, review or fan content for admin approval."
      />

      <form
        className="panel"
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gap: '16px',
          marginBottom: '30px'
        }}
      >
        <input
          type="text"
          placeholder="Submission title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
        />

        <select
          value={contentType}
          onChange={(event) =>
            setContentType(event.target.value)
          }
        >
          <option value="article">Article</option>
          <option value="review">Review</option>
          <option value="fan-content">
            Fan Content
          </option>
        </select>

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        >
          {categories.map((item) => (
            <option
              key={item._id}
              value={item.name}
            >
              {item.name}
            </option>
          ))}
        </select>

        <textarea
          rows="8"
          placeholder="Write your content..."
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
        />

        <input
          type="text"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(event) =>
            setImage(event.target.value)
          }
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Submitting...'
            : 'Submit for Approval'}
        </button>

        {message && <p>{message}</p>}
      </form>

      <PageHeading
        title="My Submissions"
        description="Track the approval status of your submitted content."
      />

      {submissions.length === 0 ? (
        <div className="empty-state panel">
          <h2>No submissions yet</h2>
          <p>Your submitted content will appear here.</p>
        </div>
      ) : (
        <div className="cards">
          {submissions.map((item) => (
            <article
              className="tile"
              key={item._id}
            >
              <div className="tilebody">
                <span className="tag">
                  {item.category}
                </span>

                <h3>{item.title}</h3>

                <p>{item.content}</p>

                <p>
                  <strong>Type:</strong>{' '}
                  {item.contentType}
                </p>

                <p>
                  <strong>Status:</strong>{' '}
                  {item.status}
                </p>

                {item.adminNote && (
                  <p>
                    <strong>Admin Note:</strong>{' '}
                    {item.adminNote}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}