import React, { useEffect, useState } from 'react';
import {
  Bell,
  Bookmark,
  LogOut,
  Menu,
  Search,
  Shield,
  Sparkles,
  UserCircle,
  X
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';
import { useFanHub } from '../context/FanHubContext.jsx';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    user,
    setUser,
    notice,
    bookmarks,
    unreadNotifications
  } = useFanHub();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }, [location.pathname]);

  useEffect(() => {
    const theme = user?.displayPreference || 'dark';
    const fontSize = user?.fontSize || 'normal';

    document.documentElement.setAttribute(
      'data-theme',
      theme
    );

    if (fontSize === 'large') {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  }, [user]);

  useEffect(() => {
    const openSearch = (event) => {
      const key = event.key.toLowerCase();

      if (
        (event.ctrlKey || event.metaKey) &&
        key === 'k'
      ) {
        event.preventDefault();
        navigate('/search');
      }
    };

    window.addEventListener('keydown', openSearch);

    return () => {
      window.removeEventListener(
        'keydown',
        openSearch
      );
    };
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('fh_token');
    localStorage.removeItem('fh_user');

    setUser(null);

    navigate('/login', {
      replace: true
    });
  };

  return (
    <div className="app-shell">
      <header className="top">

        <div className="top-main">

          <Link
            className="logo"
            to="/"
            aria-label="FanHub Plus home"
          >
            <span className="logo-mark">
              F+
            </span>

            <span className="logo-type">
              FANHUB<span>+</span>
            </span>
          </Link>

          <button
            className="mobile menu-button"
            aria-label="Toggle navigation"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            {menuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>

          <div
            className="desktop-search"
            role="button"
            tabIndex={0}
            onClick={() =>
              navigate('/search')
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                navigate('/search');
              }
            }}
          >
            <Search size={17} />

            <span>
              Search universes, characters...
            </span>

            <kbd>
              Ctrl K
            </kbd>
          </div>

          <div className="topright">

            <Link
              className="ai-link"
              to="/ai-guide"
            >
              <Sparkles size={16} />
              <span>AI Guide</span>
            </Link>

            <Link
              className="icon-link"
              to="/bookmarks"
              aria-label="Bookmarks"
            >
              <Bookmark size={19} />
              <small>
                {bookmarks.length}
              </small>
            </Link>

            <Link
              className="icon-link notice-link"
              to="/notifications"
              aria-label="Notifications"
            >
              <Bell size={19} />
              {unreadNotifications > 0 && <i />}
            </Link>

            {user?.role === 'admin' && (
              <Link
                className="icon-link"
                to="/admin"
                aria-label="Admin"
              >
                <Shield size={19} />
              </Link>
            )}

            {user ? (
              <>
                <Link
                  className="profile-link"
                  to={`/profile/${encodeURIComponent(
                    user.name || 'user'
                  )}`}
                >
                  <UserCircle size={20} />

                  <span>
                    {user.name?.split(' ')[0] ||
                      'Profile'}
                  </span>
                </Link>

                <button
                  className="icon-button logout-button"
                  onClick={logout}
                  title="Log out"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link
                className="primary compact"
                to="/login"
              >
                Log in
              </Link>
            )}

          </div>
        </div>

        <Navbar menuOpen={menuOpen} />

      </header>

      <main className="container">
        <div
          className="page-shell"
          key={location.pathname}
        >
          <Outlet />
        </div>
      </main>

      <Footer />

      {notice && (
        <div
          className="toast"
          role="status"
        >
          {notice}
        </div>
      )}
    </div>
  );
}