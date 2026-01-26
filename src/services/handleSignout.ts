import { auth } from '@/src/config/firebaseConfig';
import { clearUserCache } from '@/src/services/firestore/getUser';
import { signOut } from 'firebase/auth';

export const handleSignOut = async () => {
  try {
    await clearUserCache();
    await signOut(auth);
  } catch (error) {
    console.log(error);
  }
};