import React from 'react';
import Cards from '../components/Cards.jsx';
import PageHeading from '../components/PageHeading.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function LatestArchives() {
  const { items } = useFanHub();
  const latestItems = [...items];

  latestItems.sort((first, second) => {
    return new Date(second.createdAt) - new Date(first.createdAt);
  });

  return (
    <>
      <PageHeading
        title="Latest Archives"
        description="Recently added fandom records from FanHub Plus."
      />
      <Cards data={latestItems.slice(0, 12)} />
    </>
  );
}
