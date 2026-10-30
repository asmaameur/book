import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Auth from './pages/Auth.jsx';
import Catalog from './pages/Catalog.jsx';
import Library from './pages/Library.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/" element={<ProtectedRoute><Catalog /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute role="user"><Library /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
