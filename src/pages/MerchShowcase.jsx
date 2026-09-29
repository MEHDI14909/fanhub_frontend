import React, { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import PageHeading from '../components/PageHeading.jsx';
import { api } from '../services/api.js';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function MerchShowcase() {
  const { isBookmarked, toggleItemBookmark } = useFanHub();
  const [merchandise, setMerchandise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMerchandise = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await api.getMerchandise();

        setMerchandise(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMerchandise();
  }, []);

  return (
    <>
      <PageHeading
        title="Merch Showcase"
        description="Discover fandom merchandise, collectibles and upcoming releases."
      />

      {loading && <p>Loading merchandise...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && merchandise.length === 0 && (
        <div className="empty-state panel">
          <span className="eyebrow">MERCHANDISE</span>
          <h2>No merchandise yet</h2>
          <p>New fandom merchandise will appear here.</p>
        </div>
      )}

      {!loading && !error && merchandise.length > 0 && (
        <div className="cards">
          {merchandise.map((item) => (
            <article className="tile" key={item._id}>
              <div className="card-media">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(event) => {
                      event.currentTarget.style.opacity = '.18';
                    }}
                  />
                )}
              </div>

              <div className="tilebody">
                <span className="tag">
                  {item.category}
                </span>

                <h3>{item.name}</h3>

                <p>{item.description}</p>

                <p>
                  <strong>Fandom:</strong> {item.fandom}
                </p>

                <p>
                  <strong>Price:</strong> Rs. {item.price}
                </p>

                <p>
                  <strong>Status:</strong> {item.status}
                </p>

                {item.releaseDate && (
                  <p>
                    <strong>Release:</strong>{' '}
                    {new Date(
                      item.releaseDate
                    ).toLocaleDateString()}
                  </p>
                )}

                <div className="actions">
                  <button
                    type="button"
                    className="ghost"
                    onClick={() =>
                      toggleItemBookmark('merchandise', item._id)
                    }
                  >
                    <Bookmark
                      size={16}
                      fill={
                        isBookmarked('merchandise', item._id)
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                    {isBookmarked('merchandise', item._id)
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