import React from 'react';
import { ArrowUpRight, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useFanHub } from '../context/FanHubContext.jsx';

export default function Cards({ data = [] }) {
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark } = useFanHub();

  if (data.length === 0) {
    return (
      <div className="empty-state panel">
        <span className="eyebrow">NO MATCHING NODES</span>
        <h2>Nothing here yet</h2>
        <p>Try another category or search term.</p>
      </div>
    );
  }

  return (
    <div className="cards">
      {data.map((item, index) => {
        const itemId = String(item.id || item._id);
        const saved = bookmarks.includes(itemId);
        const canBookmark = item.type === 'article' || item.type === 'video';

        return (
          <article
            className="tile"
            key={itemId}
            style={{ '--delay': `${Math.min(index, 8) * 55}ms` }}
          >
            <button
              className="card-media"
              type="button"
              onClick={() => navigate(`/details/${itemId}`)}
              aria-label={`Open ${item.title}`}
            >
              <img
                src={item.image}
                alt={item.title}
                onError={(event) => {
                  event.currentTarget.style.opacity = '.18';
                }}
              />
              <span>
                Open dossier <ArrowUpRight size={16} />
              </span>
            </button>

            <div className="tilebody">
              <span className="tag">{item.category}</span>
              <h3 onClick={() => navigate(`/details/${itemId}`)}>
                {item.title}
              </h3>
              <p>{item.description}</p>

              <div className="actions">
                <button onClick={() => navigate(`/details/${itemId}`)}>
                  Explore <ArrowUpRight size={16} />
                </button>

                {canBookmark && (
                  <button className="ghost" onClick={() => toggleBookmark(itemId)}>
                    <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
