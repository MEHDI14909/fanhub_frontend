import React from 'react';
import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function VisualGalleries() {
  const { items } = useFanHub();

  const images = items.filter((item) => item.type === 'image');

  return (
    <>
      <PageHeading
        title="Visual Galleries"
        description="Browse image-based fandom archive records."
      />

      {images.length === 0 ? (
        <div className="empty-state panel">
          <span className="eyebrow">GALLERY</span>
          <h2>No gallery images available</h2>
          <p>Image records will appear here.</p>
        </div>
      ) : (
        <div className="cards">
          {images.map((item) => (
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
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
