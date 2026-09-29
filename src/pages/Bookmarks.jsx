import React from 'react';
import { Bookmark } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import Cards from '../components/Cards.jsx';
import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function Bookmarks() {
  const {
    user,
    items,
    bookmarkRecords,
    toggleItemBookmark
  } = useFanHub();

  if (!user || !localStorage.getItem('fh_token')) {
    return <Navigate to="/login" replace />;
  }

  const savedContent = [];
  const savedCharacters = [];
  const savedMerchandise = [];

  bookmarkRecords.forEach((bookmark) => {
    if (
      bookmark.itemType === 'article' ||
      bookmark.itemType === 'video'
    ) {
      const contentItem = items.find(
        (item) =>
          String(item.id || item._id) ===
          String(bookmark.itemId)
      );

      if (contentItem) {
        savedContent.push(contentItem);
      }
    }

    if (bookmark.itemType === 'character' && bookmark.item) {
      savedCharacters.push(bookmark.item);
    }

    if (bookmark.itemType === 'merchandise' && bookmark.item) {
      savedMerchandise.push(bookmark.item);
    }
  });

  const nothingSaved =
    savedContent.length === 0 &&
    savedCharacters.length === 0 &&
    savedMerchandise.length === 0;

  return (
    <>
      <PageHeading
        title="Your bookmarks"
        description="View all the fandom content you saved."
      />

      {nothingSaved && (
        <div className="empty-state panel">
          <span className="eyebrow">BOOKMARKS</span>
          <h2>No saved items yet</h2>
          <p>Your saved fandom records will appear here.</p>
        </div>
      )}

      {savedContent.length > 0 && (
        <div style={{ marginBottom: '34px' }}>
          <h2>Articles and videos</h2>
          <Cards data={savedContent} />
        </div>
      )}

      {savedCharacters.length > 0 && (
        <div style={{ marginBottom: '34px' }}>
          <h2>Characters</h2>

          <div className="cards">
            {savedCharacters.map((character) => (
              <article className="tile" key={character._id}>
                <div className="card-media">
                  {character.image && (
                    <img
                      src={character.image}
                      alt={character.name}
                      onError={(event) => {
                        event.currentTarget.style.opacity = '.18';
                      }}
                    />
                  )}
                </div>

                <div className="tilebody">
                  <span className="tag">Character</span>
                  <h3>{character.name}</h3>
                  <p>{character.bio}</p>

                  <div className="actions">
                    <button
                      className="ghost"
                      onClick={() =>
                        toggleItemBookmark(
                          'character',
                          character._id
                        )
                      }
                    >
                      <Bookmark size={18} fill="currentColor" />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {savedMerchandise.length > 0 && (
        <div>
          <h2>Merchandise</h2>

          <div className="cards">
            {savedMerchandise.map((item) => (
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
                  <span className="tag">Merchandise</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>

                  <div className="actions">
                    <button
                      className="ghost"
                      onClick={() =>
                        toggleItemBookmark(
                          'merchandise',
                          item._id
                        )
                      }
                    >
                      <Bookmark size={18} fill="currentColor" />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
