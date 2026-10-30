export default function BookCard({ book, children, badge }) {
  return (
    <article className="card">
      {book.cover_url ? (
        <img src={book.cover_url} alt={`Couverture de ${book.title}`} loading="lazy" />
      ) : (
        <div className="cover-fallback" aria-hidden="true">{book.title.slice(0, 1)}</div>
      )}
      <div className="card-body">
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        {book.description && <p className="desc">{book.description}</p>}
        {badge && <span className={`badge ${book.status}`}>{badge}</span>}
        <div className="actions">{children}</div>
      </div>
    </article>
  );
}
