import { Text, TextInput } from '@/src/components/Themed';
import React, { useMemo } from 'react';
import { Button, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { cleanCity } from '../utils/cleanCity';

interface AuthFormProps {
  email: string;
  setEmail: (email: string) => void;
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  city: string;
  setCity: (city: string) => void;
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
  city,
  setCity,
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

  const cleaned = useMemo(() => cleanCity(city), [city]);

  const cityError = useMemo(() => {
    if (!city.trim()) return null;
    return cleaned ? null : "Syötä oikea kaupunki (esim. Helsinki).";
  }, [city, cleaned]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TextInput placeholder="Sähköpostiosoite" value={email} onChangeText={setEmail} style={styles.input} autoCorrect={false} autoCapitalize="none" keyboardType="email-address" />
      {
        !signInScreen && <TextInput placeholder="Etunimi" value={firstName} onChangeText={setFirstName} style={styles.input} autoCorrect={false} />
      }
      {
        !signInScreen && <TextInput placeholder="Sukunimi" value={lastName} onChangeText={setLastName} style={styles.input} autoCorrect={false} />
      }
      {
        !signInScreen && <TextInput placeholder="Asuinkaupunki" value={city} onChangeText={setCity} style={styles.input} autoCorrect={false} maxLength={40} autoCapitalize="words" onBlur={() => setCity(cleanCity(city) ?? city)} />
      }
      {
        cityError ? <Text style={{ color: 'red', marginBottom: 10 }}>{cityError}</Text> : null
      }
      <TextInput placeholder="Salasana" value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.input} autoCorrect={false} />
      {
        !signInScreen && <TextInput placeholder="Vahvista salasana" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} style={styles.input} autoCorrect={false} />
      }
      {
        error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null
      }
      <View style={styles.button}>
        <Button onPress={signInScreen ? handleSignin : handleSignup} title={loading ? (signInScreen ? "Kirjaudutaan..." : "Luodaan tiliä...") : (signInScreen ? "Kirjaudu" : "Luo tili")} disabled={loading || !!cityError} />
      </View>
      {signInScreen && <Text style={styles.regularText} >Eikö sinulla ole tiliä? <Text onPress={() => setSignInScreen(!signInScreen)} style={styles.boldText}>Luo tili</Text></Text>}
      {!signInScreen && <Text style={styles.regularText} >Onko sinulla tili? <Text onPress={() => setSignInScreen(!signInScreen)} style={styles.boldText}>Kirjaudu sisään</Text></Text>}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    width: '100%',
    borderRadius: 5,
  },
  button: {
    marginBottom: 20
  },
  regularText: {
    fontSize: 14,
    fontWeight: '400',
  },
  boldText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
