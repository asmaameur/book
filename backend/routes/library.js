const router = require('express').Router();
const pool = require('../db/pool');
const { authenticate, requireRole } = require('../middleware/auth');

const STATUSES = ['to_read', 'reading', 'read'];

router.use(authenticate, requireRole('user'));

// F10 – Consulter sa bibliothèque
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT b.*, ub.status, ub.added_at
       FROM user_books ub JOIN books b ON b.id = ub.book_id
       WHERE ub.user_id = $1 ORDER BY ub.added_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// F9 – Ajouter un livre du catalogue
router.post('/', async (req, res, next) => {
  try {
    const { bookId, status = 'to_read' } = req.body;
    if (!bookId || !STATUSES.includes(status))
      return res.status(400).json({ error: 'Livre ou statut invalide.' });
    await pool.query(
      `INSERT INTO user_books (user_id, book_id, status) VALUES ($1,$2,$3)`,
      [req.user.id, bookId, status]
    );
    res.status(201).json({ bookId, status });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Ce livre est déjà dans votre bibliothèque.' });
    if (err.code === '23503') return res.status(404).json({ error: 'Livre introuvable.' });
    next(err);
  }
});

// F11 – Changer le statut
router.patch('/:bookId', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Statut invalide.' });
    const { rowCount } = await pool.query(
      `UPDATE user_books SET status = $1 WHERE user_id = $2 AND book_id = $3`,
      [status, req.user.id, req.params.bookId]
    );
    if (!rowCount) return res.status(404).json({ error: 'Livre absent de votre bibliothèque.' });
    res.json({ bookId: Number(req.params.bookId), status });
  } catch (err) { next(err); }
});

// F12 – Retirer un livre
router.delete('/:bookId', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM user_books WHERE user_id = $1 AND book_id = $2', [
      req.user.id,
      req.params.bookId,
    ]);
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;
