import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b-2 border-ink bg-paper">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3" aria-label="Navigation principale">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <span className="bubble square" data-on="true" aria-hidden="true" />
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {user ? (
            <>
              {user.role === 'admin' && <NavLink to="/admin" className="btn btn-ghost btn-sm">Administration</NavLink>}
              <NavLink to="/profile" className="btn btn-ghost btn-sm">Mon profil</NavLink>
              <button type="button" className="btn btn-primary btn-sm" onClick={logout}>Se déconnecter</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Connexion</Link>
              <Link to="/register" className="btn btn-primary btn-sm hidden sm:inline-flex">Créer un compte</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
