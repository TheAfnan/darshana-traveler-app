import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile as updateFirebaseProfile, 
  signInWithPopup,
  sendEmailVerification,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { authApi } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  dob?: string;
  profileImage?: string;
  address?: string;
  city?: string;
  country?: string;
  preferredLanguage?: string;
  travelInterests?: string[];
  username?: string;
  usernameChangeCount?: number;
  role?: 'user' | 'admin';
  notificationPreferences?: {
    emailNotifications: boolean;
    festivalAlerts: boolean;
    smsNotifications: boolean;
    region?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loading: boolean; // Alias for isLoading
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  setAuth: (token: string, user: User) => void; // Direct auth setter
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to map Firebase user to our User interface
  const mapFirebaseUser = (fbUser: FirebaseUser, role: 'user' | 'admin' = 'user'): User => {
    return {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Traveler',
      email: fbUser.email || '',
      profileImage: fbUser.photoURL || '',
      phone: fbUser.phoneNumber || '',
      role,
      notificationPreferences: {
        emailNotifications: true,
        festivalAlerts: true,
        smsNotifications: true,
      },
    };
  };

  // Sync auth state on mount using Firebase listener + localStorage fallback
  useEffect(() => {
    // 1. Initial check from localStorage for fast render
    const storedToken = localStorage.getItem('token') || localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }

    // 2. Firebase onAuthStateChanged listener
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          const mappedUser = mapFirebaseUser(fbUser);
          
          setToken(idToken);
          setUser((prev) => ({ ...mappedUser, ...prev }));
          localStorage.setItem('token', idToken);
          localStorage.setItem('user', JSON.stringify(mappedUser));
        } catch (err) {
          console.error('Error fetching Firebase token:', err);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // Hardcoded Admin Login
    if (email === 'admin@darshana.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-123',
        name: 'DarShana Admin',
        email: 'admin@darshana.com',
        role: 'admin',
        notificationPreferences: {
          emailNotifications: true,
          festivalAlerts: true,
          smsNotifications: true
        }
      };
      const fakeToken = 'admin-token-secret-123';
      
      setToken(fakeToken);
      setUser(adminUser);
      localStorage.setItem('token', fakeToken);
      localStorage.setItem('user', JSON.stringify(adminUser));
      setIsLoading(false);
      return;
    }

    try {
      // 1. Primary: Try Firebase Email/Password Sign-In
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Enforce email verification for manual logins (except admin)
      if (!userCredential.user.emailVerified && email !== 'admin@darshana.com') {
        // Resend verification link to user's Gmail
        await sendEmailVerification(userCredential.user).catch(() => {});
        await signOut(auth);
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('EMAIL_NOT_VERIFIED');
      }

      const idToken = await userCredential.user.getIdToken();
      const mappedUser = mapFirebaseUser(userCredential.user);
      
      setToken(idToken);
      setUser(mappedUser);
      localStorage.setItem('token', idToken);
      localStorage.setItem('user', JSON.stringify(mappedUser));
    } catch (firebaseError: any) {
      if (firebaseError.message === 'EMAIL_NOT_VERIFIED') {
        throw new Error('EMAIL_NOT_VERIFIED');
      }
      console.warn('Firebase login attempt:', firebaseError.code || firebaseError.message);

      // Convert Firebase error codes to readable messages
      if (firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (firebaseError.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      } else {
        throw new Error(firebaseError.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const googleUser = mapFirebaseUser(result.user);

      setToken(idToken);
      setUser(googleUser);
      localStorage.setItem('token', idToken);
      localStorage.setItem('user', JSON.stringify(googleUser));
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign in was cancelled.');
      }
      throw new Error(error.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Direct auth setter for custom external auth handlers
  const setAuth = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest_' + Date.now(),
      name: 'Darshana Traveler (Guest)',
      email: 'traveler@darshana.com',
      role: 'user',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      notificationPreferences: {
        emailNotifications: true,
        festivalAlerts: true,
        smsNotifications: false
      }
    };
    const guestToken = 'demo_token_' + Date.now();
    setToken(guestToken);
    setUser(guestUser);
    localStorage.setItem('token', guestToken);
    localStorage.setItem('user', JSON.stringify(guestUser));
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    try {
      // 1. Primary: Create Firebase Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      if (name) {
        await updateFirebaseProfile(userCredential.user, { displayName: name });
      }

      // 2. Send official Google Firebase Email Verification link to user's Gmail
      await sendEmailVerification(userCredential.user);

      // Sign out immediately so user must verify in their Gmail inbox first
      await signOut(auth);
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Also notify backend API in background if backend is active
      authApi.register({
        fullName: name,
        email,
        phone,
        password,
        confirmPassword: password,
      }).catch((e) => console.info('Backend registration sync skipped:', e.message));

    } catch (firebaseError: any) {
      console.error('Registration error:', firebaseError);
      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please login.');
      } else if (firebaseError.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else if (firebaseError.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else {
        throw new Error(firebaseError.message || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...userData };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  const deleteAccount = async () => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
    } catch (e) {
      console.warn('Firebase user delete skipped:', e);
    }
    logout();
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Firebase signOut error:', e);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loading: isLoading,
        token,
        login,
        loginWithGoogle,
        loginAsGuest,
        setAuth,
        register,
        logout,
        updateUser,
        deleteAccount,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

