import React from 'react';
import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function RatingsIndex() {
  const { items } = useFanHub();

  const ratedItems = items.filter((item) => item.ratingCount > 0);

  ratedItems.sort((first, second) => {
    const firstAverage = first.ratingTotal / first.ratingCount;
    const secondAverage = second.ratingTotal / second.ratingCount;

    return secondAverage - firstAverage;
  });

  return (
    <>
      <PageHeading
        title="Ratings Index"
        description="See ratings given to FanHub Plus multimedia records."
      />

      {ratedItems.length === 0 ? (
        <div className="empty-state panel">
          <span className="eyebrow">RATINGS</span>
          <h2>No ratings yet</h2>
          <p>Video and audio ratings will appear here.</p>
        </div>
      ) : (
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Rating</th>
                <th>Votes</th>
              </tr>
            </thead>

            <tbody>
              {ratedItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.type}</td>
                  <td>
                    {(item.ratingTotal / item.ratingCount).toFixed(1)} / 5
                  </td>
                  <td>{item.ratingCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
