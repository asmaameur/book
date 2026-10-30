const router = require('express').Router();
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const { authenticate } = require('../middleware/auth');

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// F1 – Inscription (le rôle est toujours "user")
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email || !password)
      return res.status(400).json({ error: 'Nom, email et mot de passe sont obligatoires.' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Email invalide.' });
    if (password.length < 8)
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
      [name.trim(), email.toLowerCase(), hash]
    );
    res.status(201).json({ user: publicUser(rows[0]) });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    next(err);
  }
});

// F2 – Connexion
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email et mot de passe sont obligatoires.' });
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    res.json({ user: publicUser(user) });
  } catch (err) { next(err); }
});

// Restaure la session au rechargement de la page
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (!rows[0]) return res.status(401).json({ error: 'Utilisateur introuvable.' });
    res.json({ user: publicUser(rows[0]) });
  } catch (err) { next(err); }
});

module.exports = router;
