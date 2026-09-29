import React, { useEffect, useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';
import { api } from '../services/api.js';

export default function MetadataTaxonomies() {
  const { user, flash } = useFanHub();

  const [categories, setCategories] = useState([]);

  const [editingId, setEditingId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('active');

  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const data = await api.getCategories();

      setCategories(data);
    } catch (error) {
      flash(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadCategories();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const resetForm = () => {
    setEditingId('');
    setName('');
    setDescription('');
    setImage('');
    setStatus('active');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      flash('Category name is required');
      return;
    }

    const payload = {
      name,
      description,
      image,
      status
    };

    try {
      if (editingId) {
        await api.updateCategory(
          editingId,
          payload
        );

        flash('Category updated', true);
      } else {
        await api.createCategory(payload);

        flash('Category created', true);
      }

      resetForm();

      await loadCategories();
    } catch (error) {
      flash(error.message);
    }
  };

  const editCategory = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setDescription(category.description || '');
    setImage(category.image || '');
    setStatus(category.status || 'active');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const deleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}" category?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteCategory(category._id);

      flash('Category deleted', true);

      await loadCategories();
    } catch (error) {
      flash(error.message);
    }
  };

  return (
    <>
      <PageHeading
        title="Metadata Taxonomies"
        description="Manage FanHub Plus categories and category metadata."
      />

      <form
        className="panel editor"
        onSubmit={handleSubmit}
        style={{ marginBottom: '28px' }}
      >
        <span className="eyebrow">
          CATEGORY MANAGEMENT
        </span>

        <h2>
          {editingId
            ? 'Edit category'
            : 'Add category'}
        </h2>

        <label>
          Category Name
          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Gaming"
            required
          />
        </label>

        <label>
          Description
          <textarea
            rows="4"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Gaming news, reviews and fan content"
          />
        </label>

        <label>
          Image URL
          <input
            type="text"
            value={image}
            onChange={(event) =>
              setImage(event.target.value)
            }
            placeholder="https://..."
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
              ? 'Update Category'
              : 'Add Category'}
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

      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">
              TAXONOMIES
            </span>

            <h2>Categories</h2>
          </div>

          <span className="tag">
            {categories.length} categories
          </span>
        </div>

        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td>
                      {category.name}
                    </td>

                    <td>
                      {category.description}
                    </td>

                    <td>
                      {category.status}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="ghost"
                        onClick={() =>
                          editCategory(category)
                        }
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="ghost danger"
                        onClick={() =>
                          deleteCategory(category)
                        }
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {categories.length === 0 && (
                  <tr>
                    <td colSpan="4">
                      No categories available.
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