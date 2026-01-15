
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

export default function AuthScreen() {
  const auth = useAuth();
  return <AuthForm {...auth} />;
}
