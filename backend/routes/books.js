const router = require('express').Router();
const pool = require('../db/pool');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);

function validate({ title, author, description, cover_url }) {
  if (!title?.trim() || !author?.trim()) return { error: "Le titre et l'auteur sont obligatoires." };
  if (cover_url && !/^https?:\/\//i.test(cover_url))
    return { error: "L'URL de couverture doit commencer par http:// ou https://." };
  return { values: [title.trim(), author.trim(), description?.trim() || null, cover_url?.trim() || null] };
}

// F5 – Catalogue (avec le statut de l'utilisateur si le livre est dans sa bibliothèque)
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT b.*, ub.status
       FROM books b
       LEFT JOIN user_books ub ON ub.book_id = b.id AND ub.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// F6 – Ajouter (admin)
router.post('/', requireRole('admin'), async (req, res, next) => {
  try {
    const { error, values } = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { rows } = await pool.query(
      `INSERT INTO books (title, author, description, cover_url) VALUES ($1,$2,$3,$4) RETURNING *`,
      values
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// F7 – Modifier (admin)
router.put('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const { error, values } = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { rows } = await pool.query(
      `UPDATE books SET title=$1, author=$2, description=$3, cover_url=$4 WHERE id=$5 RETURNING *`,
      [...values, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Livre introuvable.' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// F8 – Supprimer (admin)
router.delete('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Livre introuvable.' });
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;
