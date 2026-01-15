
import AuthForm from '@/src/components/AuthForm';
import { useAuth } from '@/src/hooks/useAuth';
import React from 'react';

export default function AuthScreen() {
  const auth = useAuth();
  return <AuthForm {...auth} />;
}
