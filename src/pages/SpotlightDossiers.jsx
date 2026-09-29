import React, { useEffect, useState } from 'react';
import Cards from '../components/Cards.jsx';
import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';
import { api } from '../services/api.js';

export default function SpotlightDossiers() {
  const { items } = useFanHub();
  const [events, setEvents] = useState([]);

  const articles = items.filter((item) => item.type === 'article');

  articles.sort((first, second) => {
    const firstScore = first.popularityScore || 0;
    const secondScore = second.popularityScore || 0;

    return secondScore - firstScore;
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await api.getEvents();
        setEvents(data.slice(0, 5));
      } catch {
        setEvents([]);
      }
    };

    loadEvents();
  }, []);

  return (
    <>
      <PageHeading
        title="Spotlight Dossiers"
        description="Featured deep-dive files selected from the FanHub Plus archive."
      />

      <div style={{ marginBottom: '34px' }}>
        <Cards data={articles.slice(0, 6)} />
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">EVENT HIGHLIGHTS</span>
            <h2>Upcoming timeline</h2>
          </div>
        </div>

        {events.length === 0 ? (
          <p>No event highlights available.</p>
        ) : (
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Event</th>
                  <th>City</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td>
                      {new Date(event.startDate).toLocaleDateString()}
                    </td>
                    <td>{event.title}</td>
                    <td>{event.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
