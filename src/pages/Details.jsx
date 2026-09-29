import React from 'react';
import { ArrowLeft, Bookmark, ExternalLink } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    items,
    bookmarks,
    toggleBookmark
  } = useFanHub();

  const item = items.find((record) => {
    const recordId = record.id || record._id;

    return String(recordId) === String(id);
  });

  const itemId = item?.id || item?._id;

  const isYouTubeVideo = (url) => {
    if (!url) {
      return false;
    }

    if (url.includes('youtube.com')) {
      return true;
    }

    if (url.includes('youtu.be')) {
      return true;
    }

    return false;
  };

  const getYouTubeUrl = (url) => {
    if (!url) {
      return '';
    }

    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  if (!item) {
    return (
      <>
        <button
          className="ghost"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="empty-state panel">
          <span className="eyebrow">
            ARCHIVE LOOKUP
          </span>

          <h2>Record not found</h2>

          <p>
            The requested archive node does not exist.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <button
        className="ghost"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="detail">
        <img
          src={item.image}
          alt={item.title}
        />

        <div>
          <span className="tag">
            {item.category}
          </span>

          <h1>
            {item.title}
          </h1>

          <p>
            {item.description}
          </p>

          {item.mediaUrl && (
            <div style={{ marginTop: '20px' }}>
              {isYouTubeVideo(item.mediaUrl) ? (
                <iframe
                  src={getYouTubeUrl(item.mediaUrl)}
                  title={item.title}
                  style={{
                    width: '100%',
                    height: '315px',
                    border: '0',
                    borderRadius: '16px'
                  }}
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  src={item.mediaUrl}
                  poster={item.image}
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    borderRadius: '16px'
                  }}
                />
              )}
            </div>
          )}

          <div
            className="actions"
            style={{ marginTop: '20px' }}
          >
            {(item.type === 'article' ||
              item.type === 'video') && (
              <button
                className="primary"
                onClick={() => toggleBookmark(itemId)}
              >
                <Bookmark size={18} />

                {bookmarks.includes(String(itemId))
                  ? 'Remove bookmark'
                  : 'Save bookmark'}
              </button>
            )}

            {item.mediaUrl && (
              <a
                className="ghost"
                href={item.mediaUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={18} />
                Watch Original
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}