import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Ticket } from 'lucide-react';
import PageHeading from '../components/PageHeading.jsx';
import { api } from '../services/api.js';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function EventsCalendar() {
  const { flash } = useFanHub();
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await api.getEvents();
        setEvents(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const findNearMe = () => {
    if (!navigator.geolocation) {
      flash('Location is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const mapUrl = `https://www.google.com/maps/search/fandom+events/@${latitude},${longitude},12z`;

        window.open(mapUrl, '_blank', 'noopener,noreferrer');
      },
      () => {
        flash('Location permission was not allowed');
      }
    );
  };

  const getMapLink = (event) => {
    if (event.locationLink) {
      return event.locationLink;
    }

    const place = encodeURIComponent(
      `${event.venue}, ${event.city}`
    );

    return `https://www.google.com/maps/search/?api=1&query=${place}`;
  };

  const filteredEvents = city
    ? events.filter(
        (event) =>
          event.city.toLowerCase() === city.toLowerCase()
      )
    : events;

  return (
    <>
      <PageHeading
        title="Events Calendar"
        description="Discover upcoming fandom conventions, meetups and screenings."
      />

      <div
        className="panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}
      >
        <Calendar size={20} />

        <input
          type="text"
          placeholder="Filter by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button
          type="button"
          className="ghost"
          onClick={findNearMe}
        >
          <Navigation size={16} />
          Find near me
        </button>
      </div>

      {loading && <p>Loading events...</p>}

      {error && <p>{error}</p>}

      {!loading &&
        !error &&
        filteredEvents.length === 0 && (
          <div className="empty-state panel">
            <span className="eyebrow">EVENTS</span>
            <h2>No events found</h2>
            <p>
              Upcoming fandom events will appear here.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        filteredEvents.length > 0 && (
          <div className="cards">
            {filteredEvents.map((event) => (
              <article
                className="tile"
                key={event._id}
              >
                <div className="card-media">
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      onError={(e) => {
                        e.currentTarget.style.opacity = '.18';
                      }}
                    />
                  )}
                </div>

                <div className="tilebody">
                  <span className="tag">
                    {event.category}
                  </span>

                  <h3>{event.title}</h3>

                  <p>{event.description}</p>

                  <p>
                    <MapPin size={16} />
                    {' '}
                    {event.venue}, {event.city}
                  </p>

                  <p>
                    <strong>Start:</strong>{' '}
                    {new Date(
                      event.startDate
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>End:</strong>{' '}
                    {new Date(
                      event.endDate
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Status:</strong>{' '}
                    {event.status}
                  </p>

                  <div className="actions">
                    <a
                      className="ghost"
                      href={getMapLink(event)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MapPin size={16} />
                      Map
                    </a>

                    {event.ticketLink && (
                      <a
                        className="ghost"
                        href={event.ticketLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Ticket size={16} />
                        Tickets
                      </a>
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