import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, STATUS_LABELS } from '../api.js';
import BookCard from '../components/BookCard.jsx';

export default function Library() {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const load = () => api('/library').then(setBooks).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const run = async (fn) => {
    setError('');
    try { await fn(); await load(); } catch (e) { setError(e.message); }
  };

  const shown = filter === 'all' ? books : books.filter((b) => b.status === filter);

  return (
    <>
      <div className="page-head"><h1>Ma bibliothèque</h1></div>
      <div className="tabs" role="tablist">
        {[['all', 'Tous'], ...Object.entries(STATUS_LABELS)].map(([k, label]) => (
          <button key={k} role="tab" aria-selected={filter === k} className={filter === k ? 'active' : ''} onClick={() => setFilter(k)}>
            {label}{k === 'all' ? ` (${books.length})` : ` (${books.filter((b) => b.status === k).length})`}
          </button>
        ))}
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {books.length === 0 && <p className="muted">Votre bibliothèque est vide. <Link to="/">Parcourez le catalogue</Link> pour ajouter un livre.</p>}
      <div className="grid">
        {shown.map((b) => (
          <BookCard key={b.id} book={b}>
            <select
              aria-label={`Statut de ${b.title}`}
              value={b.status}
              onChange={(e) => run(() => api(`/library/${b.id}`, { method: 'PATCH', body: { status: e.target.value } }))}
            >
              {Object.entries(STATUS_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
            <button className="btn small danger" onClick={() => run(() => api(`/library/${b.id}`, { method: 'DELETE' }))}>Retirer</button>
          </BookCard>
        ))}
      </div>
    </>
  );
}
