import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeading from '../components/PageHeading.jsx';
import { slug } from '../context/FanHubContext.jsx';
import { api } from '../services/api.js';

export default function CategoryBrowse() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.getCategories();

        setCategories(
          data.filter((category) => category.status === 'active')
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <>
      <PageHeading
        title="Category Browse"
        description="Browse every FanHub Plus category from one place."
      />

      {loading && <p>Loading categories...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="cards">
          {categories.map((category) => (
            <Link
              className="panel category-link"
              key={category._id}
            to={
  category.name === 'Music'
    ? '/audio-dispatch'
    : '/' + slug(category.name)
}
            >
              <span className="tag">CATEGORY</span>

              <h2>{category.name}</h2>

              <p>
                {category.description ||
                  `Open ${category.name} and discover matching fandom content.`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}