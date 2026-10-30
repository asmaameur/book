const pool = require('../db/pool');

// Vérification simple : le client envoie son id dans l'en-tête X-User-Id.
// On relit l'utilisateur en base pour connaître son rôle réel.
async function authenticate(req, res, next) {
  const id = parseInt(req.headers['x-user-id'], 10);
  if (!id) return res.status(401).json({ error: 'Authentification requise.' });
  try {
    const { rows } = await pool.query('SELECT id, role FROM users WHERE id = $1', [id]);
    if (!rows[0]) return res.status(401).json({ error: 'Utilisateur introuvable. Reconnectez-vous.' });
    req.user = rows[0];
    next();
  } catch (err) { next(err); }
}

// Restreint une route à un rôle donné
const requireRole = (role) => (req, res, next) =>
  req.user?.role === role
    ? next()
    : res.status(403).json({ error: 'Action non autorisée pour votre rôle.' });

module.exports = { authenticate, requireRole };
