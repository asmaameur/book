import { useEffect, useState } from 'react';
import { api, STATUS_LABELS } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import BookCard from '../components/BookCard.jsx';
import BookForm from '../components/BookForm.jsx';

export default function Catalog() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | book

  const load = () => api('/books').then(setBooks).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const run = async (fn) => {
    setError('');
    try { await fn(); await load(); } catch (e) { setError(e.message); }
  };

  const save = async (form) => {
    const isNew = editing === 'new';
    await api(isNew ? '/books' : `/books/${editing.id}`, { method: isNew ? 'POST' : 'PUT', body: form });
    setEditing(null);
    load();
  };

  const remove = (b) =>
    window.confirm(`Supprimer « ${b.title} » du catalogue ? Il disparaîtra aussi des bibliothèques.`) &&
    run(() => api(`/books/${b.id}`, { method: 'DELETE' }));

  return (
    <>
      <div className="page-head">
        <h1>Catalogue</h1>
        {isAdmin && !editing && <button className="btn" onClick={() => setEditing('new')}>Ajouter un livre</button>}
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {editing && (
        <BookForm initial={editing === 'new' ? null : editing} onSubmit={save} onCancel={() => setEditing(null)} />
      )}
      {books.length === 0 && <p className="muted">Le catalogue est vide.{isAdmin && ' Ajoutez un premier livre.'}</p>}
      <div className="grid">
        {books.map((b) => (
          <BookCard key={b.id} book={b} badge={!isAdmin && b.status && `Dans ma bibliothèque · ${STATUS_LABELS[b.status]}`}>
            {isAdmin ? (
              <>
                <button className="btn small" onClick={() => setEditing(b)}>Modifier</button>
                <button className="btn small danger" onClick={() => remove(b)}>Supprimer</button>
              </>
            ) : (
              !b.status && (
                <button className="btn small" onClick={() => run(() => api('/library', { method: 'POST', body: { bookId: b.id } }))}>
                  Ajouter à ma bibliothèque
                </button>
              )
            )}
          </BookCard>
        ))}
      </div>
    </>
  );
}
