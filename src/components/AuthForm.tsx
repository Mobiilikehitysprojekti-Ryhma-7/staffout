import { Text, View, TextInput } from '@/src/components/Themed';
import React from 'react';
import { Button, StyleSheet } from 'react-native';

interface AuthFormProps {
  email: string;
  setEmail: (email: string) => void;
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
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
}: AuthFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kirjautuminen</Text>
      <TextInput placeholder="Sähköpostiosoite" value={email} onChangeText={setEmail} style={styles.input} autoCorrect={false} autoCapitalize="none" keyboardType="email-address" />
      {
        !signInScreen && <TextInput placeholder="Etunimi" value={firstName} onChangeText={setFirstName} style={styles.input} autoCorrect={false} />
      }
      {
        !signInScreen && <TextInput placeholder="Sukunimi" value={lastName} onChangeText={setLastName} style={styles.input} autoCorrect={false} />
      }
      <TextInput placeholder="Salasana" value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.input} autoCorrect={false} />
      {
        !signInScreen && <TextInput placeholder="Vahvista salasana" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} style={styles.input} autoCorrect={false} />
      }
      {
        error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null
      }
      <View style={styles.button}>
        <Button onPress={signInScreen ? handleSignin : handleSignup} title={loading ? (signInScreen ? "Kirjaudutaan..." : "Luodaan tiliä...") : (signInScreen ? "Kirjaudu" : "Luo tili")} disabled={loading} />
      </View>
      {signInScreen && <Text style={{ marginTop: 12 }} >Eikö sinulla ole tiliä? <Text onPress={() => setSignInScreen(!signInScreen)} style={styles.boldText}>Luo tili</Text></Text>}
      {!signInScreen && <Text style={{ marginTop: 12 }} >Onko sinulla tili? <Text onPress={() => setSignInScreen(!signInScreen)} style={styles.boldText}>Kirjaudu sisään</Text></Text>}
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
