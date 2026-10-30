# BookTracker

Application web de gestion de bibliothèque (React + Express + PostgreSQL), rôles `admin` / `user`.

## Structure
```
booktracker/
├── backend/
│   ├── server.js            # point d'entrée Express
│   ├── db/                  # pool.js, schema.sql, init.js (tables + admin + livres d'exemple)
│   ├── middleware/auth.js   # authenticate (X-User-Id) + requireRole
│   └── routes/              # auth.js, books.js, library.js
└── frontend/
    └── src/
        ├── api.js, App.jsx, main.jsx, styles.css
        ├── context/AuthContext.jsx
        ├── components/      # Navbar, ProtectedRoute, BookCard, BookForm
        └── pages/           # Auth (connexion/inscription), Catalog, Library
```

## Installation
1. Créer la base : `createdb booktracker` (ou via pgAdmin).
2. Backend :
   ```
   cd backend && npm install
   cp .env.example .env     # puis éditer DATABASE_URL
   npm run db:init          # tables + compte admin + 3 livres
   npm run dev              # http://localhost:4000
   ```
3. Frontend :
   ```
   cd frontend && npm install && npm run dev    # http://localhost:5173
   ```
4. Connexion admin par défaut : valeurs `ADMIN_EMAIL` / `ADMIN_PASSWORD` du `.env`.

## API
| Méthode | Route | Accès |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/auth/me | connecté |
| GET | /api/books | connecté |
| POST / PUT / DELETE | /api/books, /api/books/:id | admin |
| GET / POST | /api/library | user |
| PATCH / DELETE | /api/library/:bookId | user |
