import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFanHub } from '../context/FanHubContext.jsx';
import Navbar from '../components/Navbar.jsx';
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const { toggleBookmark } = useFanHub();

  useEffect(() => {
    const receiveMessage = (event) => {
      if (!event.data) {
        return;
      }

      if (event.data.type === 'fanhub:navigate') {
        navigate(event.data.path);
      }

      if (event.data.type === 'fanhub:bookmark') {
        toggleBookmark(event.data.id);
      }
    };

    window.addEventListener('message', receiveMessage);

    return () => {
      window.removeEventListener('message', receiveMessage);
    };
  }, [navigate, toggleBookmark]);

  return (
    <div className="home-frame-wrap">
      {!loaded && (
        <div className="home-loader">
          <span>F+</span>
          <p>Loading FanHub Plus…</p>
        </div>
      )}

      <iframe
        id="fanhub-home"
        className={loaded ? 'ready' : ''}
        title="FanHub Plus home"
        src="/fanhub-home.html"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
