import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">BookTracker</NavLink>
      <nav>
        {user && <NavLink to="/" end>Catalogue</NavLink>}
        {user?.role === 'user' && <NavLink to="/library">Ma bibliothèque</NavLink>}
        {user ? (
          <>
            <span className="who">{user.name}{user.role === 'admin' && ' (admin)'}</span>
            <button className="btn ghost" onClick={() => { logout(); navigate('/login'); }}>
              Se déconnecter
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Connexion</NavLink>
            <NavLink to="/register">Inscription</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
