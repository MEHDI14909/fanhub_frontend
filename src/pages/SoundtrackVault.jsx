import React from 'react';
import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function SoundtrackVault() {
  const { items } = useFanHub();
  const audioItems = items.filter((item) => item.type === 'audio');

  return (
    <>
      <PageHeading
        title="Soundtrack Vault"
        description="Fandom soundtracks, podcasts and audio records."
      />

      {audioItems.length === 0 ? (
        <div className="empty-state panel">
          <h2>No audio records available</h2>
          <p>Audio records will appear here.</p>
        </div>
      ) : (
        <div className="cards">
          {audioItems.map((item) => (
            <article className="tile" key={item.id}>
              <div className="card-media">
                {item.image && (
                  <img src={item.image} alt={item.title} />
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
                    style={{ width: '100%' }}
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
