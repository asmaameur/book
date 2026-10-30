import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// F4 – Pages protégées. `role` optionnel : restreint à un rôle précis.
export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Chargement…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
