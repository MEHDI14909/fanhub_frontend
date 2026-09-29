import React from 'react';

import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function Notifications() {
  const {
    notifications,
    unreadNotifications,
    markAllNotificationsRead,
    clearNotifications
  } = useFanHub();

  return (
    <>
      <PageHeading
        title="Notifications"
        description="Recent FanHub Plus alerts and updates."
      />

      <div className="panel">
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          <>
            {notifications.map((item) => (
              <div className="notification-item" key={item.id}>
                <div>
                  <strong>{item.read ? 'Update' : 'New'}</strong>
                  <p>{item.message}</p>
                  <small>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : 'Recently'}
                  </small>
                </div>
              </div>
            ))}

            <div className="notification-actions">
              {unreadNotifications > 0 && (
                <button className="primary" onClick={markAllNotificationsRead}>
                  Mark all read
                </button>
              )}

              <button className="secondary" onClick={clearNotifications}>
                Clear notifications
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
