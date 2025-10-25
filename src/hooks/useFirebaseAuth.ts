import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { FirebaseService } from '../services/firebase';
import type { User } from '../types/firebase';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get or create user document
          let userData = await FirebaseService.getUser(firebaseUser.uid);
          
          if (!userData) {
            // Create new user document
            const newUser: Omit<User, 'createdAt' | 'lastLoginAt'> = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || undefined,
              photoURL: firebaseUser.photoURL || undefined,
            };
            
            try {
              await FirebaseService.saveUser(newUser);
              userData = {
                ...newUser,
                createdAt: new Date(),
                lastLoginAt: new Date(),
              };
            } catch (error) {
              console.warn('Failed to save user to Firestore:', error);
              // Still set user data even if Firestore fails
              userData = {
                ...newUser,
                createdAt: new Date(),
                lastLoginAt: new Date(),
              };
            }
          } else {
            // Update last login
            try {
              await FirebaseService.saveUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || undefined,
                photoURL: firebaseUser.photoURL || undefined,
              });
            } catch (error) {
              console.warn('Failed to update user in Firestore:', error);
            }
          }
          
          setUser(userData);
          console.log('User data set:', userData);
        } catch (error) {
          console.error('Error processing user data:', error);
          // Set basic user data even if Firestore operations fail
          const basicUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: new Date(),
            lastLoginAt: new Date(),
          };
          setUser(basicUser);
        }
      } else {
        setUser(null);
        console.log('User logged out');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    logout,
  };
};
