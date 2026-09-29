import React, { useEffect, useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';
import { api } from '../services/api.js';

export default function ContentModeration() {
  const { user, flash } = useFanHub();

  const [merchandise, setMerchandise] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [merchEditingId, setMerchEditingId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [fandom, setFandom] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [tags, setTags] = useState('');
  const [merchStatus, setMerchStatus] = useState('available');

  const [eventEditingId, setEventEditingId] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [ticketLink, setTicketLink] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [eventStatus, setEventStatus] = useState('upcoming');

  const loadData = async () => {
    try {
      setLoading(true);

      const merchData = await api.getMerchandise();
      const eventData = await api.getEvents();

      setMerchandise(merchData);
      setEvents(eventData);
    } catch (error) {
      flash(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const resetMerchForm = () => {
    setMerchEditingId('');
    setName('');
    setDescription('');
    setPrice('');
    setImage('');
    setCategory('');
    setFandom('');
    setReleaseDate('');
    setTags('');
    setMerchStatus('available');
  };

  const handleMerchSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name,
      description,
      price: Number(price),
      image,
      category,
      fandom,
      releaseDate: releaseDate || undefined,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: merchStatus
    };

    try {
      if (merchEditingId) {
        await api.updateMerchandise(
          merchEditingId,
          payload
        );

        flash('Merchandise updated', true);
      } else {
        await api.createMerchandise(payload);
        flash('Merchandise created', true);
      }

      resetMerchForm();
      await loadData();
    } catch (error) {
      flash(error.message);
    }
  };

  const editMerchandise = (item) => {
    setMerchEditingId(item._id);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setImage(item.image || '');
    setCategory(item.category);
    setFandom(item.fandom);

    setReleaseDate(
      item.releaseDate
        ? item.releaseDate.slice(0, 10)
        : ''
    );

    setTags(
      Array.isArray(item.tags)
        ? item.tags.join(', ')
        : ''
    );

    setMerchStatus(item.status || 'available');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const removeMerchandise = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) {
      return;
    }

    try {
      await api.deleteMerchandise(item._id);
      flash('Merchandise deleted', true);
      await loadData();
    } catch (error) {
      flash(error.message);
    }
  };

  const resetEventForm = () => {
    setEventEditingId('');
    setEventTitle('');
    setEventDescription('');
    setEventCategory('');
    setStartDate('');
    setEndDate('');
    setVenue('');
    setCity('');
    setEventImage('');
    setTicketLink('');
    setLocationLink('');
    setEventStatus('upcoming');
  };

  const handleEventSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: eventTitle,
      description: eventDescription,
      category: eventCategory,
      startDate,
      endDate,
      venue,
      city,
      image: eventImage,
      ticketLink,
      locationLink,
      status: eventStatus
    };

    try {
      if (eventEditingId) {
        await api.updateEvent(
          eventEditingId,
          payload
        );

        flash('Event updated', true);
      } else {
        await api.createEvent(payload);
        flash('Event created', true);
      }

      resetEventForm();
      await loadData();
    } catch (error) {
      flash(error.message);
    }
  };

  const editEvent = (item) => {
    setEventEditingId(item._id);
    setEventTitle(item.title);
    setEventDescription(item.description);
    setEventCategory(item.category);
    setStartDate(
      item.startDate
        ? item.startDate.slice(0, 10)
        : ''
    );
    setEndDate(
      item.endDate
        ? item.endDate.slice(0, 10)
        : ''
    );
    setVenue(item.venue);
    setCity(item.city);
    setEventImage(item.image || '');
    setTicketLink(item.ticketLink || '');
    setLocationLink(item.locationLink || '');
    setEventStatus(item.status || 'upcoming');

    window.scrollTo({
      top: document.body.scrollHeight / 2,
      behavior: 'smooth'
    });
  };

  const removeEvent = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) {
      return;
    }

    try {
      await api.deleteEvent(item._id);
      flash('Event deleted', true);
      await loadData();
    } catch (error) {
      flash(error.message);
    }
  };

  return (
    <>
      <PageHeading
        title="Content Moderation"
        description="Manage FanHub Plus merchandise and events."
      />

      <form
        className="panel editor"
        onSubmit={handleMerchSubmit}
        style={{ marginBottom: '28px' }}
      >
        <span className="eyebrow">
          MERCHANDISE MANAGEMENT
        </span>

        <h2>
          {merchEditingId
            ? 'Edit merchandise'
            : 'Add merchandise'}
        </h2>

        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            rows="4"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            required
          />
        </label>

        <label>
          Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        <label>
          Category
          <input
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            required
          />
        </label>

        <label>
          Fandom
          <input
            value={fandom}
            onChange={(e) =>
              setFandom(e.target.value)
            }
            required
          />
        </label>

        <label>
          Image URL
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>

        <label>
          Release Date
          <input
            type="date"
            value={releaseDate}
            onChange={(e) =>
              setReleaseDate(e.target.value)
            }
          />
        </label>

        <label>
          Tags
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="anime, hoodie, collectible"
          />
        </label>

        <label>
          Status
          <select
            value={merchStatus}
            onChange={(e) =>
              setMerchStatus(e.target.value)
            }
          >
            <option value="available">
              Available
            </option>
            <option value="upcoming">
              Upcoming
            </option>
          </select>
        </label>

        <div className="actions">
          <button className="primary">
            <Plus size={18} />
            {merchEditingId
              ? 'Update Merchandise'
              : 'Add Merchandise'}
          </button>

          {merchEditingId && (
            <button
              type="button"
              className="ghost"
              onClick={resetMerchForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div
        className="panel"
        style={{ marginBottom: '40px' }}
      >
        <div className="panel-title">
          <div>
            <span className="eyebrow">
              MERCHANDISE
            </span>
            <h2>Merchandise records</h2>
          </div>

          <span className="tag">
            {merchandise.length} records
          </span>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Fandom</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {merchandise.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.fandom}</td>
                  <td>Rs. {item.price}</td>
                  <td>{item.status}</td>

                  <td>
                    <button
                      className="ghost"
                      onClick={() =>
                        editMerchandise(item)
                      }
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      className="ghost danger"
                      onClick={() =>
                        removeMerchandise(item)
                      }
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form
        className="panel editor"
        onSubmit={handleEventSubmit}
        style={{ marginBottom: '28px' }}
      >
        <span className="eyebrow">
          EVENT MANAGEMENT
        </span>

        <h2>
          {eventEditingId
            ? 'Edit event'
            : 'Add event'}
        </h2>

        <label>
          Title
          <input
            value={eventTitle}
            onChange={(e) =>
              setEventTitle(e.target.value)
            }
            required
          />
        </label>

        <label>
          Description
          <textarea
            rows="4"
            value={eventDescription}
            onChange={(e) =>
              setEventDescription(e.target.value)
            }
            required
          />
        </label>

        <label>
          Category
          <input
            value={eventCategory}
            onChange={(e) =>
              setEventCategory(e.target.value)
            }
            placeholder="Anime"
            required
          />
        </label>

        <label>
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
            required
          />
        </label>

        <label>
          End Date
          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
            required
          />
        </label>

        <label>
          Venue
          <input
            value={venue}
            onChange={(e) =>
              setVenue(e.target.value)
            }
            required
          />
        </label>

        <label>
          City
          <input
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
            required
          />
        </label>

        <label>
          Image URL
          <input
            value={eventImage}
            onChange={(e) =>
              setEventImage(e.target.value)
            }
          />
        </label>

        <label>
          Ticket Link
          <input
            value={ticketLink}
            onChange={(e) =>
              setTicketLink(e.target.value)
            }
            placeholder="https://..."
          />
        </label>

        <label>
          Location Link
          <input
            value={locationLink}
            onChange={(e) =>
              setLocationLink(e.target.value)
            }
            placeholder="https://maps.google.com/..."
          />
        </label>

        <label>
          Status
          <select
            value={eventStatus}
            onChange={(e) =>
              setEventStatus(e.target.value)
            }
          >
            <option value="upcoming">
              Upcoming
            </option>

            <option value="ongoing">
              Ongoing
            </option>

            <option value="completed">
              Completed
            </option>
          </select>
        </label>

        <div className="actions">
          <button className="primary">
            <Plus size={18} />

            {eventEditingId
              ? 'Update Event'
              : 'Add Event'}
          </button>

          {eventEditingId && (
            <button
              type="button"
              className="ghost"
              onClick={resetEventForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">
              EVENTS
            </span>

            <h2>Event records</h2>
          </div>

          <span className="tag">
            {events.length} records
          </span>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>City</th>
                  <th>Start</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {events.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.city}</td>

                    <td>
                      {new Date(
                        item.startDate
                      ).toLocaleDateString()}
                    </td>

                    <td>{item.status}</td>

                    <td>
                      <button
                        className="ghost"
                        onClick={() =>
                          editEvent(item)
                        }
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      <button
                        className="ghost danger"
                        onClick={() =>
                          removeEvent(item)
                        }
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {events.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      No events available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}