// src/context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
// ▼▼▼ 1. IMPORT FUNGSI YANG BARU ▼▼▼
import { createPeriodicCareerNotification } from "@/lib/notificationService";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // ▼▼▼ 2. PANGGIL FUNGSI NOTIFIKASI PERIODIK ▼▼▼
      if (currentUser) {
        // Cek dan buat notifikasi karir periodik jika perlu
        createPeriodicCareerNotification(currentUser.uid);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
