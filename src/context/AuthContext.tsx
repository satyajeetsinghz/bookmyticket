import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  isAdmin: false,
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setIsAdmin(userData.admin === true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    currentUser,
    loading,
    isAdmin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
