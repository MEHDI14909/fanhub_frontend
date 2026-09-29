import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import Cards from '../components/Cards.jsx';
import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function UserDashboard() {
  const {
    user,
    items,
    bookmarks,
    bookmarkRecords
  } = useFanHub();

  const token = localStorage.getItem('fh_token');

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  const savedItems = [];

  items.forEach((item) => {
    const itemId = String(item.id || item._id);

    if (bookmarks.includes(itemId)) {
      savedItems.push(item);
    }
  });

  const favoriteFandoms = [];

  if (
    Array.isArray(user.favoriteFandoms) &&
    user.favoriteFandoms.length > 0
  ) {
    user.favoriteFandoms.forEach((fandom) => {
      favoriteFandoms.push(fandom);
    });
  } else {
    bookmarkRecords.forEach((bookmark) => {
      const savedItem = bookmark.item;

      if (!savedItem) {
        return;
      }

      let fandom = savedItem.fandom || savedItem.category;

      if (fandom && typeof fandom === 'object') {
        fandom = fandom.name;
      }

      if (fandom && !favoriteFandoms.includes(fandom)) {
        favoriteFandoms.push(fandom);
      }
    });
  }

  const recentActivity = [];

  bookmarkRecords.slice(0, 5).forEach((bookmark) => {
    const savedItem = bookmark.item;

    if (!savedItem) {
      return;
    }

    const title = savedItem.title || savedItem.name || 'Saved item';

    let fandom = savedItem.fandom || savedItem.category || bookmark.itemType;

    if (fandom && typeof fandom === 'object') {
      fandom = fandom.name;
    }

    recentActivity.push({
      id: bookmark._id,
      title,
      category: fandom,
      date: bookmark.createdAt
        ? new Date(bookmark.createdAt).toLocaleDateString()
        : 'Recently'
    });
  });

  const dashboardBookmarks = savedItems.slice(0, 3);

  return (
    <>
      <PageHeading
        title={`Welcome back, ${user.name || 'User'}`}
        description="Your personal FanHub Plus dashboard."
      />

      <div className="stats">
        <div>
          <b>{bookmarkRecords.length}</b>
          <span>Bookmarked items</span>
        </div>

        <div>
          <b>{favoriteFandoms.length}</b>
          <span>Favorite fandoms</span>
        </div>

        <div>
          <b>{items.length}</b>
          <span>Available content</span>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">YOUR INTERESTS</span>
            <h2>Favorite fandoms</h2>
          </div>
        </div>

        {favoriteFandoms.length > 0 ? (
          <div className="actions">
            {favoriteFandoms.map((fandom) => (
              <Link
                className="ghost"
                key={fandom}
                to="/explore"
              >
                {fandom}
              </Link>
            ))}
          </div>
        ) : (
          <p>Add favorite fandoms from your profile.</p>
        )}
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">RECENT ACTIVITY</span>
            <h2>Your latest saves</h2>
          </div>
        </div>

        {recentActivity.length > 0 ? (
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Fandom</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentActivity.map((activity) => (
                  <tr key={activity.id}>
                    <td>Bookmarked {activity.title}</td>
                    <td>{activity.category}</td>
                    <td>{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No recent activity yet.</p>
        )}
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">QUICK ACCESS</span>
            <h2>Explore FanHub Plus</h2>
          </div>
        </div>

        <div className="cards">
          <Link className="panel category-link" to="/explore">
            <span className="eyebrow">CONTENT</span>
            <h2>Explore</h2>
            <p>Browse fandom content.</p>
          </Link>

          <Link className="panel category-link" to="/multimedia-center">
            <span className="eyebrow">MEDIA</span>
            <h2>Multimedia</h2>
            <p>Open videos and media.</p>
          </Link>

          <Link className="panel category-link" to="/character-archive">
            <span className="eyebrow">CHARACTERS</span>
            <h2>Characters</h2>
            <p>Browse character profiles.</p>
          </Link>

          <Link className="panel category-link" to="/spotlight-dossiers">
            <span className="eyebrow">ARTICLES</span>
            <h2>Articles</h2>
            <p>Read featured stories.</p>
          </Link>

          <Link className="panel category-link" to="/merch-showcase">
            <span className="eyebrow">MERCH</span>
            <h2>Merchandise</h2>
            <p>View fandom merchandise.</p>
          </Link>

          <Link className="panel category-link" to="/events-calendar">
            <span className="eyebrow">EVENTS</span>
            <h2>Events</h2>
            <p>Find fandom events.</p>
          </Link>

          <Link className="panel category-link" to="/feedback">
            <span className="eyebrow">FEEDBACK</span>
            <h2>Feedback</h2>
            <p>Send feedback to the team.</p>
          </Link>

          <Link className="panel category-link" to="/ai-guide">
            <span className="eyebrow">GUIDE</span>
            <h2>AI Guide</h2>
            <p>Search the FanHub archive.</p>
          </Link>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">SAVED RECORDS</span>
            <h2>Your bookmarks</h2>
          </div>

          <Link className="primary compact" to="/bookmarks">
            View all
          </Link>
        </div>

        <Cards data={dashboardBookmarks} />
      </div>
    </>
  );
}
