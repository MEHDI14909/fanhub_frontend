import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import Cards from '../components/Cards.jsx';
import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const { items } = useFanHub();

  const results = [];
  const cleanQuery = query.trim().toLowerCase();

  items.forEach((item) => {
    const text = `${item.title} ${item.category} ${item.description}`.toLowerCase();

    if (!cleanQuery || text.includes(cleanQuery)) {
      results.push(item);
    }
  });

  const changeSearch = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <PageHeading title="Search the fandom" />

      <div className="searchbox">
        <Search />
        <input
          autoFocus
          placeholder="Search movies, anime, games and more..."
          value={query}
          onChange={changeSearch}
        />
      </div>

      <Cards data={results} />
    </>
  );
}
