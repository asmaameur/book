import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('userId'));

  // Restaure la session si un userId est stocké
  useEffect(() => {
    if (!localStorage.getItem('userId')) return;
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('userId'))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, body) => {
    const { user } = await api(path, { method: 'POST', body });
    localStorage.setItem('userId', user.id);
    setUser(user);
    return user;
  };

  const value = {
    user,
    loading,
    login: (email, password) => authenticate('/auth/login', { email, password }),
    register: (name, email, password) => authenticate('/auth/register', { name, email, password }),
    logout: () => {
      localStorage.removeItem('userId');
      setUser(null);
    },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
