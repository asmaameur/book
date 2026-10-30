// Crée les tables, le premier compte admin et quelques livres d'exemple
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./pool');

(async () => {
  await pool.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await pool.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO NOTHING`,
    [ADMIN_NAME, ADMIN_EMAIL.toLowerCase(), hash]
  );

  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM books');
  if (rows[0].n === 0) {
    await pool.query(
      `INSERT INTO books (title, author, description) VALUES
       ('Le Petit Prince', 'Antoine de Saint-Exupéry', 'Un pilote échoué dans le désert rencontre un jeune prince venu d''une autre planète.'),
       ('L''Étranger', 'Albert Camus', 'Meursault, employé à Alger, voit sa vie basculer après un meurtre.'),
       ('Dune', 'Frank Herbert', 'Paul Atréides et la planète désertique Arrakis, seule source de l''épice.')`
    );
  }
  console.log('Base initialisée. Admin :', ADMIN_EMAIL);
  await pool.end();
})().catch((e) => { console.error(e); process.exit(1); });
