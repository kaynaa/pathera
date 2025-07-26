// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';

// Tipe data untuk nilai yang akan disediakan oleh context
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

// Membuat context dengan nilai default
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

// Membuat Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listener dari Firebase yang akan memantau status otentikasi
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set user jika ada, atau null jika tidak ada
      setIsLoading(false); // Selesai loading
    });

    // Membersihkan listener saat komponen tidak lagi digunakan
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Membuat custom hook agar lebih mudah digunakan di komponen lain
export const useAuth = () => {
  return useContext(AuthContext);
};
