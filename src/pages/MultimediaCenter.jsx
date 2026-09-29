import React from 'react';
import { Film, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

import PageHeading from '../components/PageHeading.jsx';

export default function MultimediaCenter() {
  return (
    <>
      <PageHeading
        title="Multimedia Center"
        description="FanHub Plus video, trailer and audio content."
      />

      <div className="cards">
        <Link className="panel media-card" to="/theater">
          <Film size={34} />
          <h2>Video & Trailers</h2>
          <p>Open the multimedia theater for trailers and fandom video content.</p>
        </Link>

        <Link className="panel media-card" to="/audio-dispatch">
          <Headphones size={34} />
          <h2>Audio Dispatch</h2>
          <p>Open podcasts, commentary tracks and fandom audio archives.</p>
        </Link>
      </div>
    </>
  );
}
