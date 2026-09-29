import React from 'react';
import { Navigate } from 'react-router-dom';
import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function FollowedFandoms() {
  const { user } = useFanHub();

  if (!user || !localStorage.getItem('fh_token')) {
    return <Navigate to="/login" replace />;
  }

  const fandoms = user.favoriteFandoms || [];
  const interests = user.interests || [];

  return (
    <>
      <PageHeading
        title="Followed Fandoms"
        description="Your saved fandom preferences and categories of interest."
      />

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">FAVORITES</span>
            <h2>Favorite fandoms</h2>
          </div>
        </div>

        {fandoms.length === 0 ? (
          <p>No favorite fandoms added yet.</p>
        ) : (
          <div className="actions">
            {fandoms.map((fandom) => (
              <span className="ghost" key={fandom}>
                {fandom}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">INTERESTS</span>
            <h2>Categories of interest</h2>
          </div>
        </div>

        {interests.length === 0 ? (
          <p>No interests added yet.</p>
        ) : (
          <div className="actions">
            {interests.map((interest) => (
              <span className="ghost" key={interest}>
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
