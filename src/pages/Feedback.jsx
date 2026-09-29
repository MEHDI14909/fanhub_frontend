import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PageHeading from '../components/PageHeading.jsx';
import { api } from '../services/api.js';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function Feedback() {
  const { user, addNotification } = useFanHub();
  const [type, setType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || !localStorage.getItem('fh_token')) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      setStatusMessage('Please enter your feedback.');
      return;
    }

    try {
      setLoading(true);
      setStatusMessage('');

      await api.submitFeedback({
        type,
        message
      });

      setMessage('');
      setType('suggestion');
      setStatusMessage('Feedback submitted successfully.');
      addNotification('Feedback submitted successfully');
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeading
        title="Feedback"
        description="Send a bug report, suggestion or question to FanHub Plus."
      />

      <form
        className="panel"
        onSubmit={handleSubmit}
        style={{
          maxWidth: '700px',
          display: 'grid',
          gap: '18px'
        }}
      >
        <div>
          <label>Feedback Type</label>

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
          >
            <option value="bug">Bug</option>
            <option value="suggestion">
              Suggestion
            </option>
            <option value="query">Query</option>
          </select>
        </div>

        <div>
          <label>Message</label>

          <textarea
            rows="6"
            placeholder="Write your feedback..."
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? 'Submitting...'
            : 'Submit Feedback'}
        </button>

        {statusMessage && (
          <p>{statusMessage}</p>
        )}
      </form>
    </>
  );
}