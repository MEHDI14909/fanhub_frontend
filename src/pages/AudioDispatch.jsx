import React from 'react';
import { Star } from 'lucide-react';
import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';
import { api } from '../services/api.js';

export default function AudioDispatch() {
  const { items, setItems, flash } = useFanHub();

  const audioItems = items.filter((item) => item.type === 'audio');

  const rateAudio = async (id, rating) => {
    try {
      const result = await api.rateContent(id, { rating });

      setItems((current) =>
        current.map((item) => {
          if (String(item.id) === String(id)) {
            return {
              ...item,
              ratingCount: result.ratingCount,
              averageRating: result.averageRating
            };
          }

          return item;
        })
      );

      flash('Rating saved', true);
    } catch (error) {
      flash(error.message);
    }
  };

  const getAverageRating = (item) => {
    if (item.averageRating !== undefined) {
      return item.averageRating;
    }

    if (item.ratingCount > 0) {
      return (item.ratingTotal / item.ratingCount).toFixed(1);
    }

    return 'Not rated';
  };

  return (
    <>
      <PageHeading
        title="Audio Dispatch"
        description="Podcasts, commentary tracks and fandom audio archives."
      />

      {audioItems.length === 0 ? (
        <div className="empty-state panel">
          <span className="eyebrow">AUDIO</span>
          <h2>No audio available</h2>
          <p>Admin can add audio content from the content editor.</p>
        </div>
      ) : (
        <div className="cards">
          {audioItems.map((item) => (
            <article className="tile" key={item.id}>
              <div className="card-media">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(event) => {
                      event.currentTarget.style.opacity = '.18';
                    }}
                  />
                )}
              </div>

              <div className="tilebody">
                <span className="tag">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>

             {item.mediaUrl && (
  <audio
    controls
    src={item.mediaUrl}
    style={{ width: '100%', marginBottom: '14px' }}
    onPlay={(e) => {
      document.querySelectorAll('audio').forEach((audio) => {
        if (audio !== e.currentTarget) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    }}
  />
)}

                <p>
                  <strong>Rating:</strong>{' '}
                  {getAverageRating(item)}
                  {item.ratingCount > 0
                    ? ` (${item.ratingCount})`
                    : ''}
                </p>

                <div className="actions">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="ghost"
                      type="button"
                      onClick={() => rateAudio(item.id, rating)}
                    >
                      <Star size={15} />
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
