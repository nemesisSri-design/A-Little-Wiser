import { NavLink, Outlet } from 'react-router-dom';

type LayoutProps = {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

const links = [
  { to: '/', label: 'Today' },
  { to: '/commonplace', label: 'Commonplace Book' },
  { to: '/lexicon', label: 'Lexicon' },
  { to: '/map', label: 'Map' },
  { to: '/progress', label: 'Progress' },
  { to: '/archive', label: 'Archive' },
];

export const Layout = ({ theme, onToggleTheme }: LayoutProps) => (
  <div className="app-shell">
    <header className="site-header">
      <div>
        <p className="label">A Little Wiser</p>
        <h1>Scholarly Daily Learning</h1>
      </div>
      <button className="secondary" onClick={onToggleTheme} type="button">
        {theme === 'light' ? 'Dark mode' : 'Light mode'}
      </button>
    </header>

    <nav aria-label="Main navigation" className="site-nav">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.to === '/'}>
          {link.label}
        </NavLink>
      ))}
    </nav>

    <main>
      <Outlet />
    </main>
  </div>
);
