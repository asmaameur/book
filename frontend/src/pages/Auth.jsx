import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Une seule page pour la connexion (F2) et l'inscription (F1)
export default function Auth({ mode }) {
  const isRegister = mode === 'register';
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="panel form auth" onSubmit={submit}>
      <h1>{isRegister ? 'Créer un compte' : 'Se connecter'}</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {isRegister && <label>Nom<input value={form.name} onChange={set('name')} required /></label>}
      <label>Email<input type="email" value={form.email} onChange={set('email')} required /></label>
      <label>Mot de passe
        <input type="password" value={form.password} onChange={set('password')} minLength={isRegister ? 8 : undefined} required />
      </label>
      <button className="btn" disabled={busy}>{isRegister ? "S'inscrire" : 'Se connecter'}</button>
      <p className="muted">
        {isRegister ? <>Déjà inscrit ? <Link to="/login">Se connecter</Link></> : <>Pas de compte ? <Link to="/register">S'inscrire</Link></>}
      </p>
    </form>
  );
}
