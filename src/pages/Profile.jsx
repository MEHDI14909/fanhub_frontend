import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';
import { api } from '../services/api.js';

export default function Profile() {
  const { user, setUser, bookmarks, addNotification } = useFanHub();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [favoriteFandoms, setFavoriteFandoms] = useState('');
  const [interests, setInterests] = useState('');
  const [displayPreference, setDisplayPreference] = useState('dark');
  const [fontSize, setFontSize] = useState('normal');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('fh_token');

      if (!token) {
        return;
      }

      try {
        const profile = await api.getProfile();

        setUser(profile);
        setName(profile.name || '');
        setEmail(profile.email || '');
        setAvatar(profile.avatar || '');
        setFavoriteFandoms(
          Array.isArray(profile.favoriteFandoms)
            ? profile.favoriteFandoms.join(', ')
            : ''
        );
        setInterests(
          Array.isArray(profile.interests)
            ? profile.interests.join(', ')
            : ''
        );
        setDisplayPreference(
          profile.displayPreference || 'dark'
        );
        setFontSize(profile.fontSize || 'normal');
      } catch (error) {
        setMessage(error.message);
      }
    };

    loadProfile();
  }, [setUser]);

  if (!user || !localStorage.getItem('fh_token')) {
    return <Navigate to="/login" replace />;
  }

  const uploadAvatar = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const makeList = (text) => {
    const values = [];
    const parts = text.split(',');

    parts.forEach((part) => {
      const value = part.trim();

      if (value && !values.includes(value)) {
        values.push(value);
      }
    });

    return values;
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await api.updateProfile({
        name,
        email,
        avatar,
        favoriteFandoms: makeList(favoriteFandoms),
        interests: makeList(interests),
        displayPreference,
        fontSize
      });

      setUser(result.user);
      setMessage('Profile updated successfully');
      addNotification('Profile updated successfully');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeading
        title={user?.name || 'My Profile'}
        description="FanHub Plus archivist profile."
      />

      <div className="stats">
        <div>
          <b>{bookmarks.length}</b>
          <span>Saved records</span>
        </div>

        <div>
          <b>{user.favoriteFandoms?.length || 0}</b>
          <span>Followed fandoms</span>
        </div>

        <div>
          <b>{user.interests?.length || 0}</b>
          <span>Interests</span>
        </div>
      </div>

      <div className="panel">
        <h2>Profile</h2>

        {avatar && (
          <img
            src={avatar}
            alt={name}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginTop: '16px'
            }}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        )}

        <form className="editor" onSubmit={updateProfile}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Avatar URL
            <input
              type="text"
              value={avatar}
              onChange={(event) => setAvatar(event.target.value)}
              placeholder="https://..."
            />
          </label>

          <label>
            Upload Avatar
            <input
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
            />
          </label>

          <label>
            Favorite fandoms
            <input
              type="text"
              value={favoriteFandoms}
              onChange={(event) =>
                setFavoriteFandoms(event.target.value)
              }
              placeholder="Anime, Gaming, K-Pop"
            />
          </label>

          <label>
            Categories of interest
            <input
              type="text"
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
              placeholder="Articles, Characters, Events"
            />
          </label>

          <label>
            Display theme
            <select
              value={displayPreference}
              onChange={(event) =>
                setDisplayPreference(event.target.value)
              }
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>

          <label>
            Font size
            <select
              value={fontSize}
              onChange={(event) => setFontSize(event.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="large">Large</option>
            </select>
          </label>

          <button
            className="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          {message && <p>{message}</p>}
        </form>
      </div>
    </>
  );
}
