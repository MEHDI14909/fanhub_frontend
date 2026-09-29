import React, { useEffect, useState } from 'react';
import { Bookmark, Edit, Plus, Search, Trash2 } from 'lucide-react';

import PageHeading from '../components/PageHeading.jsx';
import { api } from '../services/api.js';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function CharacterArchive() {
  const {
    user,
    flash,
    isBookmarked,
    toggleItemBookmark
  } = useFanHub();

  const [characters, setCharacters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [fandom, setFandom] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('active');

  const loadCharacters = async () => {
    try {
      setLoading(true);

      const data = await api.getCharacters({
        search
      });

      setCharacters(data);
    } catch (error) {
      flash(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();

      setCategories(data);

      if (data.length && !category) {
        setCategory(data[0]._id);
      }
    } catch (error) {
      flash(error.message);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadCharacters();
  }, [search]);

  const resetForm = () => {
    setEditingId('');
    setName('');
    setFandom('');
    setBio('');
    setImage('');
    setTags('');
    setStatus('active');

    if (categories.length) {
      setCategory(categories[0]._id);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      category,
      name,
      fandom,
      bio,
      image,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      status
    };

    try {
      if (editingId) {
        await api.updateCharacter(
          editingId,
          payload
        );

        flash('Character updated', true);
      } else {
        await api.createCharacter(payload);

        flash('Character created', true);
      }

      resetForm();
      await loadCharacters();
    } catch (error) {
      flash(error.message);
    }
  };

  const editCharacter = (character) => {
    setEditingId(character._id);

    setCategory(
      typeof character.category === 'object'
        ? character.category._id
        : character.category
    );

    setName(character.name);
    setFandom(character.fandom);
    setBio(character.bio);
    setImage(character.image || '');

    setTags(
      Array.isArray(character.tags)
        ? character.tags.join(', ')
        : ''
    );

    setStatus(character.status || 'active');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const deleteCharacter = async (character) => {
    const confirmed = window.confirm(
      `Delete "${character.name}"?`
    );

    if (!confirmed) return;

    try {
      await api.deleteCharacter(character._id);

      flash('Character deleted', true);

      await loadCharacters();
    } catch (error) {
      flash(error.message);
    }
  };

  return (
    <>
      <PageHeading
        title="Character Archive"
        description="Explore characters from your favourite fandoms."
      />

      <div
        className="panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px'
        }}
      >
        <Search size={18} />

        <input
          type="text"
          placeholder="Search characters or fandom..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      {user?.role === 'admin' && (
        <form
          className="panel editor"
          onSubmit={handleSubmit}
          style={{ marginBottom: '30px' }}
        >
          <span className="eyebrow">
            CHARACTER MANAGEMENT
          </span>

          <h2>
            {editingId
              ? 'Edit character'
              : 'Add character'}
          </h2>

          <label>
            Character Name
            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              required
            >
              {categories.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fandom
            <input
              value={fandom}
              onChange={(event) =>
                setFandom(event.target.value)
              }
              required
            />
          </label>

          <label>
            Biography
            <textarea
              rows="5"
              value={bio}
              onChange={(event) =>
                setBio(event.target.value)
              }
              required
            />
          </label>

          <label>
            Image URL
            <input
              value={image}
              onChange={(event) =>
                setImage(event.target.value)
              }
              placeholder="https://..."
            />
          </label>

          <label>
            Tags
            <input
              value={tags}
              onChange={(event) =>
                setTags(event.target.value)
              }
              placeholder="naruto, anime, ninja"
            />
          </label>

          <label>
            Status
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </label>

          <div className="actions">
            <button
              className="primary"
              type="submit"
            >
              <Plus size={18} />

              {editingId
                ? 'Update Character'
                : 'Add Character'}
            </button>

            {editingId && (
              <button
                type="button"
                className="ghost"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading characters...</p>
      ) : characters.length === 0 ? (
        <div className="empty-state panel">
          <h2>No characters found</h2>
          <p>
            Character records will appear here.
          </p>
        </div>
      ) : (
        <div className="cards">
          {characters.map((character) => (
            <article
              className="tile"
              key={character._id}
            >
              <div className="card-media">
                {character.image && (
                  <img
                    src={character.image}
                    alt={character.name}
                    onError={(event) => {
                      event.currentTarget.style.opacity =
                        '.2';
                    }}
                  />
                )}
              </div>

              <div className="tilebody">
                <span className="tag">
                  {typeof character.category ===
                  'object'
                    ? character.category.name
                    : character.category}
                </span>

                <h3>{character.name}</h3>

                <p>
                  <strong>Fandom:</strong>{' '}
                  {character.fandom}
                </p>

                <p>{character.bio}</p>

                {character.tags?.length > 0 && (
                  <p>
                    <strong>Tags:</strong>{' '}
                    {character.tags.join(', ')}
                  </p>
                )}

                <div className="actions">
                  <button
                    type="button"
                    className="ghost"
                    onClick={() =>
                      toggleItemBookmark(
                        'character',
                        character._id
                      )
                    }
                  >
                    <Bookmark
                      size={16}
                      fill={
                        isBookmarked(
                          'character',
                          character._id
                        )
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                    {
                      isBookmarked(
                        'character',
                        character._id
                      )
                        ? 'Saved'
                        : 'Save'
                    }
                  </button>

                  {user?.role === 'admin' && (
                    <>
                      <button
                        type="button"
                        className="ghost"
                        onClick={() =>
                          editCharacter(character)
                        }
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="ghost danger"
                        onClick={() =>
                          deleteCharacter(character)
                        }
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}