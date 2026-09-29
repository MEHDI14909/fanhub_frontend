import React, { useState } from 'react';
import { ArrowUp, Mail, Radio, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useFanHub } from '../context/FanHubContext.jsx';

const footerGroups = [
  {
    title: 'Explore',
    links: [
      ['Explore', '/explore'],
      ['Category Browse', '/category-browse'],
      ['Multimedia Center', '/multimedia-center'],
      ['Events Calendar', '/events-calendar']
    ]
  },
  {
    title: 'Fandom Vaults',
    links: [
      ['Anime Core', '/anime'],
      ['Gaming Arenas', '/gaming'],
      ['Manga Archives', '/comics-and-manga'],
      ['Merch Showcase', '/merch-showcase']
    ]
  },
  {
    title: 'Community',
    links: [
      ['Bookmarks', '/bookmarks'],
      ['Followed Fandoms', '/followed-fandoms'],
      ['Community Rules', '/community-guidelines'],
      ['AI Guide', '/ai-guide']
    ]
  },
  {
    title: 'System',
    links: [
      ['API Protocol', '/api-protocol'],
      ['Creator Licensing', '/creator-licensing'],
      ['API Docs', '/api-docs'],
      ['Admin Panel', '/admin-panel']
    ]
  }
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const { flash } = useFanHub();

  const subscribe = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    localStorage.setItem('fh_updates_email', email.trim());
    setEmail('');
    flash('Archive updates email saved');
  };

  return (
    <footer className="site-footer">
      <div className="footer-glow" />

      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link className="footer-logo" to="/">
              FANHUB<span>+</span>
            </Link>
            <p>
              Curated fandom portals, multimedia archives, character dossiers,
              event tracking and collector exhibits in one interface.
            </p>
            <div className="system-status">
              <Radio size={14} /> Omni-node systems nominal
            </div>
          </div>

          <form className="footer-newsletter" onSubmit={subscribe}>
            <div className="footer-newsletter-icon">
              <Sparkles size={18} />
            </div>

            <div>
              <strong>Archive Dispatch</strong>
              <p>Save an email for FanHub Plus archive updates.</p>
            </div>

            <div className="footer-input-row">
              <Mail size={17} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
              <button type="submit">Join</button>
            </div>
          </form>
        </div>

        <div className="footer-links">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4>{group.title}</h4>
              {group.links.map((link) => (
                <Link key={link[1]} to={link[1]}>
                  {link[0]}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <div>
            <ShieldCheck size={15} />
            <span>FanHub Plus · Deep Matte Interface</span>
          </div>

          <span>Frontend connected · REST API ready</span>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp size={16} /> Top
          </button>
        </div>
      </div>
    </footer>
  );
}
