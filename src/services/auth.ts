import { auth } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import type { UserCredential } from 'firebase/auth'; // <-- type-only import
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function register(
  email: string, 
  password: string, 
  name: string
): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    name,
    email,
    admin: false,
    createdAt: new Date(),
  });
  return userCredential;
}

export async function login(email: string, password: string): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  return await signOut(auth);
}
