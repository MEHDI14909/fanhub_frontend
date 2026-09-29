import React, { useEffect, useState } from 'react';

import Cards from './Cards.jsx';
import PageHeading from './PageHeading.jsx';
import { api } from '../services/api.js';

export default function CategoryPage({ title, category }) {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('');

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setError('');

        const result = await api.getCategories();

        setCategories(result);

        if (category) {
          const foundCategory = result.find((item) => {
            return item.name.toLowerCase() === category.toLowerCase();
          });

          if (foundCategory) {
            setSelectedCategory(foundCategory._id);
          }
        }

        setCategoriesLoaded(true);
      } catch (error) {
        setError(error.message);
        setCategoriesLoaded(true);
      }
    };

    loadCategories();
  }, [category]);

  useEffect(() => {
    const loadContent = async () => {
      if (!categoriesLoaded) {
        return;
      }

      if (category && !selectedCategory) {
        return;
      }

      try {
        setLoading(true);
        setError('');

        const result = await api.getContent({
          search: search,
          category: selectedCategory,
          genre: genre,
          releaseYear: releaseYear,
          type: type,
          sort: sort
        });

        const formattedData = [];

        result.forEach((item) => {
          let categoryName = item.category;

          if (item.category && typeof item.category === 'object') {
            categoryName = item.category.name;
          }

          formattedData.push({
            ...item,
            id: item._id,
            category: categoryName
          });
        });

        setData(formattedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [
    categoriesLoaded,
    category,
    selectedCategory,
    search,
    genre,
    releaseYear,
    type,
    sort
  ]);

  return (
    <>
      <PageHeading title={title} />

      <div
        className="panel"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '28px',
          padding: '18px'
        }}
      >
        <input
          type="text"
          placeholder="Search content..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {!category && (
          <select
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
            }}
          >
            <option value="">All Categories</option>

            {categories.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(event) => {
            setGenre(event.target.value);
          }}
        />

        <input
          type="number"
          placeholder="Release Year"
          value={releaseYear}
          onChange={(event) => {
            setReleaseYear(event.target.value);
          }}
        />

        <select
          value={type}
          onChange={(event) => {
            setType(event.target.value);
          }}
        >
          <option value="">All Types</option>
          <option value="article">Article</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="image">Image</option>
        </select>

        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);
          }}
        >
          <option value="">Latest</option>
          <option value="popular">Most Popular</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      {loading && <p>Loading content...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <Cards data={data} />
      )}
    </>
  );
}