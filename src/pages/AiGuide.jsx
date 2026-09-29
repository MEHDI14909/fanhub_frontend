import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function AiGuide() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState([]);

  const { items } = useFanHub();

  const submit = (event) => {
    event.preventDefault();

    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      setAnswer('Type a fandom, character or topic to search.');
      setResults([]);
      return;
    }

    const words = cleanQuery.split(' ');
    const matches = [];

    items.forEach((item) => {
      const itemText = `
        ${item.title || ''}
        ${item.description || ''}
        ${item.category?.name || item.category || ''}
        ${item.genre || ''}
        ${(item.tags || []).join(' ')}
      `.toLowerCase();

      let matched = false;

      words.forEach((word) => {
        if (word && itemText.includes(word)) {
          matched = true;
        }
      });

      if (matched) {
        matches.push(item);
      }
    });

    setResults(matches);

    if (matches.length > 0) {
      setAnswer(
        `Found ${matches.length} matching FanHub archive record${
          matches.length === 1 ? '' : 's'
        }.`
      );
    } else {
      setAnswer(
        'No exact local match found. Try Anime, Gaming, K-Pop, Comics, Cosplay, Music or Events.'
      );
    }
  };

  return (
    <>
      <PageHeading
        title="AI Guide"
        description="Search the local FanHub Plus archive with a simple assistant-style interface."
      />

      <form className="panel" onSubmit={submit}>
        <div className="searchbox">
          <Search />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask about a fandom, character or archive..."
          />
        </div>

        <button className="primary" type="submit">
          Search archive
        </button>

        {answer && <p>{answer}</p>}
      </form>

      {results.length > 0 && (
        <div
          className="cards"
          style={{ marginTop: '24px' }}
        >
          {results.map((item) => {
            const itemId = item._id || item.id;

            return (
              <div
                className="panel"
                key={itemId}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '220px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      marginBottom: '16px'
                    }}
                  />
                )}

                <span className="tag">
                  {item.category?.name ||
                    item.category ||
                    item.type ||
                    'Archive'}
                </span>

                <h2>{item.title}</h2>

                <p>
                  {item.description ||
                    'No description available.'}
                </p>

                {item.genre && (
                  <p>
                    <strong>Genre:</strong> {item.genre}
                  </p>
                )}

                {item._id && (
                  <Link
                    className="primary compact"
                    to={`/details/${item._id}`}
                  >
                    View Details
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}