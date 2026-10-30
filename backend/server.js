require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/library', require('./routes/library'));

app.use((req, res) => res.status(404).json({ error: 'Route introuvable.' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur. Réessayez plus tard.' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API sur http://localhost:${port}`));
