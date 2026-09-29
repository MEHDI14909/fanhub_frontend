import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="authwrap">
      <div className="auth">
        <div className="eyebrow">FANHUB PLUS</div>
        <h1>Page not found</h1>
        <p>This page does not exist.</p>
        <Link className="primary" to="/explore">
          Go to Explore
        </Link>
      </div>
    </div>
  );
}
