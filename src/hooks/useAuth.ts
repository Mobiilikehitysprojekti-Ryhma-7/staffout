import { createUser, signInUser } from '@/src/services/auth/auth.service';
import { updateUserProfile } from '@/src/services/users.service';
import { useRouter } from 'expo-router';
import { useState } from 'react';
export function useAuth() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signInScreen, setSignInScreen] = useState(true);

  const handleSignup = async () => {
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Salasanat eivät täsmää.');
      setLoading(false);
      return;
    }

    try {
      await createUser(email, password);
      await updateUserProfile(firstName, lastName, undefined);
      console.log('User created:', email);
      router.replace('/(tabs)');
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        setError('Sähköposti on jo käytössä!');
      } else if (e.code === 'auth/invalid-email') {
        setError('Sähköpostiosoite on virheellinen!');
      } else {
        setError(e.message || "Virhe kirjautumisessa.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInUser(email, password);
      console.log('User signed in:', email);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || "Virhe kirjautumisessa.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    signInScreen,
    setSignInScreen,
    handleSignup,
    handleSignin,
  };
}
