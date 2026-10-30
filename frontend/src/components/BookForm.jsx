import { useState } from 'react';

const EMPTY = { title: '', author: '', description: '', cover_url: '' };

export default function BookForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="panel form" onSubmit={submit}>
      <h2>{initial ? 'Modifier le livre' : 'Ajouter un livre'}</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <label>Titre<input value={form.title} onChange={set('title')} required /></label>
      <label>Auteur<input value={form.author} onChange={set('author')} required /></label>
      <label>Description<textarea rows="3" value={form.description || ''} onChange={set('description')} /></label>
      <label>URL de couverture<input type="url" value={form.cover_url || ''} onChange={set('cover_url')} placeholder="https://…" /></label>
      <div className="row">
        <button className="btn" type="submit">{initial ? 'Enregistrer' : 'Ajouter'}</button>
        <button className="btn ghost" type="button" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
}
