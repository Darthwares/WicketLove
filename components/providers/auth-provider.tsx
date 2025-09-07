'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { onAuthChange } from '@/lib/utils/auth';
import { useStore } from '@/lib/store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const setStoreUser = useStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthChange((userData) => {
      setUser(userData);
      setStoreUser(userData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setStoreUser]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}