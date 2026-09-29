import React, { useEffect, useState } from 'react';
import {
  Check,
  Edit,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import {
  Navigate,
  useNavigate
} from 'react-router-dom';

import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';
import { api } from '../services/api.js';

export default function AdminDashboard() {
  const {
    user,
    items,
    loadContent,
    setEditItem,
    removeContent,
    flash
  } = useFanHub();

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }

    const loadAdminData = async () => {
      try {
        setLoading(true);

        const categoryData = await api.getCategories();
        const feedbackData = await api.getAllFeedback();
        const submissionData = await api.getAllSubmissions();
        const userData = await api.getUsers();

        setCategories(categoryData);
        setFeedback(feedbackData);
        setSubmissions(submissionData);
        setUsers(userData);
      } catch (error) {
        flash(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [user]);

  if (user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) {
      return;
    }

    try {
      await removeContent(item.id || item._id);
      flash('Content deleted', true);
    } catch (error) {
      flash(error.message || 'Delete failed');
    }
  };

  const changeFeedbackStatus = async (id, status) => {
    try {
      const result = await api.updateFeedbackStatus(
        id,
        { status }
      );

      setFeedback((current) =>
        current.map((item) => {
          if (item._id === id) {
            return result.feedback;
          }

          return item;
        })
      );

      flash('Feedback status updated', true);
    } catch (error) {
      flash(error.message);
    }
  };

  const changeSubmissionStatus = async (id, status) => {
    try {
      const result = await api.updateSubmissionStatus(
        id,
        {
          status,
          adminNote:
            status === 'approved'
              ? 'Content approved for publishing'
              : 'Content rejected by admin'
        }
      );

      setSubmissions((current) =>
        current.map((item) => {
          if (item._id === id) {
            return result.submission;
          }

          return item;
        })
      );

      await loadContent();
      flash(`Submission ${status}`, true);
    } catch (error) {
      flash(error.message);
    }
  };

  const changeUserRole = async (id, role) => {
    try {
      const result = await api.updateUserRole(id, { role });

      setUsers((current) =>
        current.map((account) => {
          const accountId = account.id || account._id;

          if (String(accountId) === String(id)) {
            return {
              ...account,
              ...result.user,
              _id: account._id || result.user.id
            };
          }

          return account;
        })
      );

      flash('User role updated', true);
    } catch (error) {
      flash(error.message);
    }
  };

  const removeUser = async (account) => {
    const accountId = account.id || account._id;

    const confirmed = window.confirm(
      `Delete user "${account.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteUser(accountId);

      setUsers((current) =>
        current.filter((item) => {
          const itemId = item.id || item._id;
          return String(itemId) !== String(accountId);
        })
      );

      flash('User deleted', true);
    } catch (error) {
      flash(error.message);
    }
  };

  let activeUsers = 0;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  users.forEach((account) => {
    if (!account.lastLogin) {
      return;
    }

    const loginDate = new Date(account.lastLogin);

    if (loginDate >= thirtyDaysAgo) {
      activeUsers += 1;
    }
  });

  const categoryCounts = {};

  items.forEach((item) => {
    const category = item.category || 'Other';

    if (!categoryCounts[category]) {
      categoryCounts[category] = 0;
    }

    categoryCounts[category] += 1;
  });

  const popularCategories = [];

  for (const categoryName in categoryCounts) {
    popularCategories.push([categoryName, categoryCounts[categoryName]]);
  }

  popularCategories.sort((first, second) => {
    return second[1] - first[1];
  });

  return (
    <>
      <PageHeading
        title="Admin Dashboard"
        description="Manage FanHub Plus content, users, feedback and fan submissions."
      >
        <button
          className="primary"
          onClick={() => {
            setEditItem({});
            navigate('/admin/editor');
          }}
        >
          <Plus size={18} />
          Add content
        </button>
      </PageHeading>

      <div className="stats">
        <div>
          <b>{items.length}</b>
          <span>Content</span>
        </div>

        <div>
          <b>{categories.length}</b>
          <span>Categories</span>
        </div>

        <div>
          <b>{users.length}</b>
          <span>Users</span>
        </div>

        <div>
          <b>{activeUsers}</b>
          <span>Active users</span>
        </div>

        <div>
          <b>{feedback.length}</b>
          <span>Feedback</span>
        </div>

        <div>
          <b>{submissions.length}</b>
          <span>Submissions</span>
        </div>
      </div>

      {loading && <p>Loading admin data...</p>}

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">ARCHIVE CONTROL</span>
            <h2>Content management</h2>
          </div>

          <span className="tag">{items.length} records</span>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id || item._id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.type}</td>
                  <td>{item.views || 0}</td>
                  <td>
                    <button
                      className="ghost"
                      onClick={() => {
                        setEditItem({
                          ...item,
                          id: item.id || item._id
                        });

                        navigate('/admin/editor');
                      }}
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      className="ghost danger"
                      onClick={() => remove(item)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan="5">No content available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">USAGE ANALYTICS</span>
            <h2>Popular categories</h2>
          </div>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Content records</th>
              </tr>
            </thead>

            <tbody>
              {popularCategories.slice(0, 8).map((entry) => (
                <tr key={entry[0]}>
                  <td>{entry[0]}</td>
                  <td>{entry[1]}</td>
                </tr>
              ))}

              {popularCategories.length === 0 && (
                <tr>
                  <td colSpan="2">No analytics available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">USER MANAGEMENT</span>
            <h2>Registered users</h2>
          </div>

          <span className="tag">{users.length} users</span>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last login</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((account) => {
                const accountId = account.id || account._id;
                const isCurrentAdmin =
                  String(accountId) === String(user.id || user._id);

                return (
                  <tr key={accountId}>
                    <td>{account.name}</td>
                    <td>{account.email}</td>
                    <td>{account.role}</td>
                    <td>
                      {account.lastLogin
                        ? new Date(account.lastLogin).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td>
                      {!isCurrentAdmin && (
                        <>
                          <button
                            className="ghost"
                            onClick={() =>
                              changeUserRole(
                                accountId,
                                account.role === 'admin'
                                  ? 'user'
                                  : 'admin'
                              )
                            }
                          >
                            {account.role === 'admin'
                              ? 'Make User'
                              : 'Make Admin'}
                          </button>

                          <button
                            className="ghost danger"
                            onClick={() => removeUser(account)}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td colSpan="5">No users available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">USER FEEDBACK</span>
            <h2>Feedback management</h2>
          </div>

          <span className="tag">{feedback.length} records</span>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {feedback.map((item) => (
                <tr key={item._id}>
                  <td>{item.user?.name || 'User'}</td>
                  <td>{item.type}</td>
                  <td>{item.message}</td>
                  <td>{item.status}</td>
                  <td>
                    <button
                      className="ghost"
                      onClick={() =>
                        changeFeedbackStatus(item._id, 'reviewed')
                      }
                    >
                      Reviewed
                    </button>

                    <button
                      className="ghost"
                      onClick={() =>
                        changeFeedbackStatus(item._id, 'resolved')
                      }
                    >
                      Resolved
                    </button>
                  </td>
                </tr>
              ))}

              {feedback.length === 0 && (
                <tr>
                  <td colSpan="5">No feedback available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">FAN CONTENT</span>
            <h2>Submission approval</h2>
          </div>

          <span className="tag">{submissions.length} records</span>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Title</th>
                <th>Type</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((item) => (
                <tr key={item._id}>
                  <td>{item.user?.name || 'User'}</td>
                  <td>{item.title}</td>
                  <td>{item.contentType}</td>
                  <td>{item.category}</td>
                  <td>{item.status}</td>
                  <td>
                    <button
                      className="ghost"
                      onClick={() =>
                        changeSubmissionStatus(item._id, 'approved')
                      }
                    >
                      <Check size={16} />
                      Approve
                    </button>

                    <button
                      className="ghost danger"
                      onClick={() =>
                        changeSubmissionStatus(item._id, 'rejected')
                      }
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </td>
                </tr>
              ))}

              {submissions.length === 0 && (
                <tr>
                  <td colSpan="6">No fan submissions available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
