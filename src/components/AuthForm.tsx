import { Text, View } from '@/src/components/Themed';
import React from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';

interface AuthFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  loading: boolean;
  error: string;
  signInScreen: boolean;
  setSignInScreen: (val: boolean) => void;
  handleSignup: () => void;
  handleSignin: () => void;
}

export default function AuthForm({
  email,
  setEmail,
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
}: AuthFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth Screen</Text>
      <TextInput placeholder="Email address" value={email} onChangeText={setEmail} style={styles.input} autoCorrect={false} autoCapitalize="none" keyboardType="email-address"/>
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.input} autoCorrect={false} />
      {signInScreen ? null :
        <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} style={styles.input} autoCorrect={false} />
      }
      {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}
      <View style={styles.button}>
        <Button onPress={signInScreen ? handleSignin : handleSignup} title={loading ? (signInScreen ? "Signing in..." : "Signing up...") : (signInScreen ? "Sign In" : "Sign Up")} disabled={loading} />
      </View>
      {signInScreen && <Text style={{marginTop:12}} >Don't have an account? <Text onPress={() => setSignInScreen(!signInScreen)} style={styles.boldText}>Create an account</Text></Text>}
      {!signInScreen && <Text style={{marginTop:12}} >Have an account? <Text onPress={() => setSignInScreen(!signInScreen)} style={styles.boldText}>Login</Text></Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    marginTop: 12,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
