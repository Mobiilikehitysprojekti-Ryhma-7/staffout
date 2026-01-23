import { View, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { useState } from 'react';
import { updateEmail } from '@/src/services/updateEmail';
import reauthenticateUser from '@/src/services/reauthenticateUser';
import { Text } from '@/src/components/Themed';
import { auth } from '@/src/config/firebaseConfig';

export default function ChangeEmailScreen() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(auth.currentUser?.email || '');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const isDisabled = loading || !password || !email;

    const EmailChanged = () =>
        Alert.alert('', 'Sähköposti päivitetty onnistuneesti', [
            { text: 'OK', onPress: () => { } },
        ]);
        
    const handleChangeEmail = async () => {
        setError(null);
        setLoading(true);
        try {
            await reauthenticateUser(password);
            await updateEmail(email);
            EmailChanged();
            setPassword('');
            setEmail(auth.currentUser?.email || '');
        } catch (e: any) {
            setError(e.message || "Virhe sähköpostin päivityksessä.");
        } finally {
           setLoading(false); 
        }
        
    }
    return (
        <View style={styles.container}>
            <TextInput placeholder="Sähköposti" value={email} onChangeText={setEmail} style={styles.input} autoCorrect={false} keyboardType="email-address" />
            <TextInput placeholder="Salasana" value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.input} autoCorrect={false} />
            <Button onPress={handleChangeEmail} title="Vaihda Sähköposti" disabled={isDisabled} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
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
