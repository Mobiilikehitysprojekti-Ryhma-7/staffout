import { auth } from '@/src/config/firebaseConfig';
import { signOut } from 'firebase/auth';

export const handleSignOut = async () => { signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
  console.log(error);
});
}