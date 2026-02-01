import { View, TextInput, StyleSheet, Button, Alert, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { removeUser, reauthenticateUser } from '@/src/services/auth/auth.service';
import { Text } from '@/src/components/Themed';
import { auth } from '@/src/config/firebaseConfig';

export default function DeleteUserScreen() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(auth.currentUser?.email || '');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const isDisabled = loading || !password || !email;

    const UserRemovedAlert = () =>
        Alert.alert('', 'Käyttäjä poistettu onnistuneesti', [
            { text: 'OK', onPress: () => { } },
        ]);
    const handleRemoveUser = async () => {
        setError(null);
        setLoading(true);
        try {
            await reauthenticateUser(password);
            await removeUser();

            setPassword('');
            setEmail(auth.currentUser?.email || '');
            UserRemovedAlert();

        } catch (e: any) {
            setError(e.message || "Virhe käyttäjän poistossa.");
        } finally {
            setLoading(false);
        }

    }
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <TextInput placeholder="Sähköposti" value={email} editable={false} style={styles.input} autoCorrect={false} keyboardType="email-address" />
            <TextInput placeholder="Salasana" value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.input} autoCorrect={false} />
            <Button onPress={handleRemoveUser} title="Poista Käyttäjä" disabled={isDisabled} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        width: '100%',
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginTop: 10,
    }
});
