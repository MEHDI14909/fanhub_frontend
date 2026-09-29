import React from 'react';
import Cards from '../components/Cards.jsx';
import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function Trending() {
  const { items } = useFanHub();
  const trendingItems = [...items];

  trendingItems.sort((first, second) => {
    const firstScore =
      (first.popularityScore || 0) + (first.views || 0);
    const secondScore =
      (second.popularityScore || 0) + (second.views || 0);

    return secondScore - firstScore;
  });

  return (
    <>
      <PageHeading
        title="Trending"
        description="Popular fandom records from across the archive."
      />
      <Cards data={trendingItems.slice(0, 12)} />
    </>
  );
}
