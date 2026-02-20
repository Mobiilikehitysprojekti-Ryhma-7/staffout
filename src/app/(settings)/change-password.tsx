import { View, TextInput, StyleSheet, Button, Alert, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { updatePassword, reauthenticateUser } from '@/src/services/auth/auth.service';
import { Text } from '@/src/components/Themed';
import { typography } from '@/src/styles/regularStyles';
export default function ChangePasswordScreen() {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const isDisabled = loading || !password || !newPassword || !confirmNewPassword;

    const PasswordChanged = () =>
        Alert.alert('', 'Salasana päivitetty onnistuneesti', [
            { text: 'OK', onPress: () => { } },
        ]);
    const handleChangePassword = async () => {
        setError(null);
        setLoading(true);
        if (newPassword !== confirmNewPassword) {
            setError("Uudet salasanat eivät täsmää.");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("Salasanan tulee olla vähintään 6 merkkiä pitkä.");
            setLoading(false);
            return;
        }

        try {
            await reauthenticateUser(password);
            await updatePassword(newPassword);
            PasswordChanged();
            setPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (e: any) {
            setError(e.message || "Virhe salasanan päivityksessä.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={typography.body}>Nykyinen Salasana</Text>
            <TextInput placeholder="Nykyinen Salasana" value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.input} autoCorrect={false} />
            <Text style={typography.body}>Uusi Salasana</Text>
            <TextInput placeholder="Uusi Salasana" value={newPassword} onChangeText={setNewPassword} secureTextEntry={true} style={styles.input} autoCorrect={false} />
            <Text style={typography.body}>Vahvista Uusi Salasana</Text>
            <TextInput placeholder="Vahvista Uusi Salasana" value={confirmNewPassword} onChangeText={setConfirmNewPassword} secureTextEntry={true} style={styles.input} autoCorrect={false} />
            <Button onPress={handleChangePassword} title="Vaihda Salasana" disabled={isDisabled} />
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
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    error: {
        color: 'red',
        marginTop: 10,
    }
});
