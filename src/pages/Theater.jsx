import React from 'react';
import { Bookmark, Star } from 'lucide-react';
import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';
import { api } from '../services/api.js';

export default function Theater() {
  const {
    items,
    setItems,
    bookmarks,
    toggleBookmark,
    flash
  } = useFanHub();

  const videos = items.filter((item) => item.type === 'video');

  const isYouTube = (url) => {
    if (!url) {
      return false;
    }

    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeUrl = (url) => {
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

  const rateVideo = async (id, rating) => {
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
        title="4K Multimedia Theater"
        description="Trailer streams, video breakdowns and premium fandom media."
      />

      {videos.length === 0 ? (
        <div className="empty-state panel">
          <span className="eyebrow">VIDEO</span>
          <h2>No videos available</h2>
          <p>Admin can add video content from the content editor.</p>
        </div>
      ) : (
        <div className="cards">
          {videos.map((video) => (
            <article className="tile" key={video.id}>
              <div className="card-media">
                {video.mediaUrl ? (
                  isYouTube(video.mediaUrl) ? (
                    <iframe
                      src={getYouTubeUrl(video.mediaUrl)}
                      title={video.title}
                      style={{ width: '100%', height: '215px', border: 0 }}
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      src={video.mediaUrl}
                      poster={video.image}
                      style={{ width: '100%', height: '215px' }}
                    />
                  )
                ) : (
                  video.image && (
                    <img src={video.image} alt={video.title} />
                  )
                )}
              </div>

              <div className="tilebody">
                <span className="tag">{video.category}</span>
                <h3>{video.title}</h3>
                <p>{video.description}</p>

                <p>
                  <strong>Rating:</strong>{' '}
                  {getAverageRating(video)}
                  {video.ratingCount > 0
                    ? ` (${video.ratingCount})`
                    : ''}
                </p>

                <div className="actions">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="ghost"
                      type="button"
                      onClick={() => rateVideo(video.id, rating)}
                    >
                      <Star size={15} />
                      {rating}
                    </button>
                  ))}
                </div>

                <div className="actions">
                  <button
                    className="ghost"
                    type="button"
                    onClick={() => toggleBookmark(video.id)}
                  >
                    <Bookmark
                      size={17}
                      fill={
                        bookmarks.includes(String(video.id))
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                    {bookmarks.includes(String(video.id))
                      ? 'Saved'
                      : 'Save'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
