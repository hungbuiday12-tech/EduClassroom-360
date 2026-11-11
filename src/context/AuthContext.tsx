import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  FirebaseUser,
} from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot';
  openAuthModal: (mode?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
  loginWithGoogle: () => Promise<void>;
  loginWithUsernameOrEmail: (identifier: string, password: string) => Promise<void>;
  registerAccount: (username: string, email: string, password: string, displayName?: string) => Promise<void>;
  sendResetPasswordMail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'educlassroom_user_profile_cache';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_USER_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            const profile: UserProfile = {
              uid: fbUser.uid,
              username: data.username || fbUser.email?.split('@')[0] || 'hocsinh',
              displayName: data.displayName || fbUser.displayName || 'Học viên Chuyên',
              email: fbUser.email || '',
              avatarUrl: fbUser.photoURL || undefined,
              role: data.role || 'student',
              xp: data.xp || 150,
              createdAt: data.createdAt || new Date().toISOString(),
            };
            setUser(profile);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
          } else {
            // Create user profile for new Google Sign In
            const initialUsername = (fbUser.email?.split('@')[0] || 'student_' + fbUser.uid.slice(0, 6)).replace(/[^a-zA-Z0-9_]/g, '_');
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              username: initialUsername,
              displayName: fbUser.displayName || 'Học sinh Chuyên',
              email: fbUser.email || '',
              avatarUrl: fbUser.photoURL || undefined,
              role: 'student',
              xp: 150,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, {
              username: newProfile.username,
              displayName: newProfile.displayName,
              email: newProfile.email,
              avatarUrl: newProfile.avatarUrl || '',
              role: 'student',
              xp: 150,
              createdAt: newProfile.createdAt,
            });
            setUser(newProfile);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newProfile));
          }
        } catch (err) {
          console.warn('Could not fetch Firestore profile, using fallback profile:', err);
          if (!user && fbUser.email) {
            const fallback: UserProfile = {
              uid: fbUser.uid,
              username: fbUser.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_'),
              displayName: fbUser.displayName || 'Học sinh Chuyên',
              email: fbUser.email,
              avatarUrl: fbUser.photoURL || undefined,
              role: 'student',
              xp: 150,
              createdAt: new Date().toISOString(),
            };
            setUser(fallback);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(fallback));
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem(LOCAL_USER_KEY);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Google Login
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setIsAuthModalOpen(false);
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  // Login with Username or Email
  const loginWithUsernameOrEmail = async (identifier: string, password: string) => {
    try {
      let emailToUse = identifier.trim();
      // If it doesn't contain '@', convert username to internal format or username lookup
      if (!emailToUse.includes('@')) {
        emailToUse = `${emailToUse.toLowerCase()}@educlassroom360.local`;
      }
      await signInWithEmailAndPassword(auth, emailToUse, password);
      setIsAuthModalOpen(false);
    } catch (error: any) {
      // If failed with .local email, also try raw if user meant something else
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register new account
  const registerAccount = async (
    username: string,
    email: string,
    password: string,
    displayName?: string
  ) => {
    try {
      const sanitizedUsername = username.trim().toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
      const validEmail = email.trim() || `${sanitizedUsername}@educlassroom360.local`;
      const res = await createUserWithEmailAndPassword(auth, validEmail, password);
      
      const shownName = displayName?.trim() || username;
      if (res.user) {
        await updateProfile(res.user, { displayName: shownName });

        const profileDoc: UserProfile = {
          uid: res.user.uid,
          username: sanitizedUsername,
          displayName: shownName,
          email: validEmail,
          role: 'student',
          xp: 100,
          createdAt: new Date().toISOString(),
        };

        try {
          await setDoc(doc(db, 'users', res.user.uid), {
            username: profileDoc.username,
            displayName: profileDoc.displayName,
            email: profileDoc.email,
            role: 'student',
            xp: 100,
            createdAt: profileDoc.createdAt,
          });
        } catch (dbErr) {
          console.warn('Firestore profile write warning:', dbErr);
        }

        setUser(profileDoc);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profileDoc));
        setIsAuthModalOpen(false);
      }
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  };

  // Send Password Reset Email
  const sendResetPasswordMail = async (email: string) => {
    try {
      const targetEmail = email.trim();
      await sendPasswordResetEmail(auth, targetEmail);
    } catch (error: any) {
      console.error('Password reset email error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem(LOCAL_USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Add XP
  const addXP = async (amount: number) => {
    if (!user) return;
    const newXP = (user.xp || 0) + amount;
    const updated = { ...user, xp: newXP };
    setUser(updated);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          xp: newXP,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Could not update Firestore XP:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        loginWithGoogle,
        loginWithUsernameOrEmail,
        registerAccount,
        sendResetPasswordMail,
        logout,
        addXP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
