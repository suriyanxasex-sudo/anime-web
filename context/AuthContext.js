import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('joshua_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (u) => {
    setUser(u);
    localStorage.setItem('joshua_user', JSON.stringify(u));
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('joshua_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);