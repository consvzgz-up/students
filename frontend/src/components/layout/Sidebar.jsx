import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'EduInsights'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { to: '/explorer', label: 'Explorador', icon: 'M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z' },
  { to: '/predictor', label: 'Predictor ML', icon: 'M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2zM9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1z' },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.logo}>{APP_TITLE}</span>
        <button
          className={styles.toggle}
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
          </svg>
        </button>
      </div>

      <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={() => setOpen(false)}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={item.icon} />
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
