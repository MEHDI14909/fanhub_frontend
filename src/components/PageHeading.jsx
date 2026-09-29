import React from 'react';

export default function PageHeading({
  title,
  description = 'Discover your next obsession. Explore, search and save your favorites.',
  children
}) {
  return (
    <div className="heading">
      <div>
        <div className="eyebrow">
          FANHUB PLUS / {String(title).toUpperCase()}
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {children}
    </div>
  );
}
