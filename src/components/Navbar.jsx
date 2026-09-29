import React, { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { name: 'Explore', path: '/explore' },
  { name: 'Anime', path: '/anime' },
  { name: 'Gaming', path: '/gaming' },
  { name: 'Movies & TV', path: '/movies-and-tv' },
  { name: 'K-Pop', path: '/k-pop' },
  { name: 'Comics & Manga', path: '/comics-and-manga' },
  { name: 'Cosplay', path: '/cosplay' },
  { name: 'Events', path: '/events-calendar' },
  { name: 'Songs', path: '/audio-dispatch' },
  { name: 'Merch Showcase', path: '/merch-showcase' }
]

export default function Navbar({ menuOpen }) {
  const location = useLocation()
  const navRef = useRef(null)

  useEffect(() => {
    const activeLink = navRef.current?.querySelector('.active')

    if (activeLink) {
      activeLink.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [location.pathname])

  return (
    <nav
      ref={navRef}
      className={menuOpen ? 'show' : ''}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            isActive ? 'active' : ''
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  )
}