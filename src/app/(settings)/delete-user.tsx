import { View, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { useState } from 'react';
import { removeUser } from '@/src/services/removeUser';
import reauthenticateUser from '@/src/services/reauthenticateUser';
import { Text } from '@/src/components/Themed';

export default function DeleteUserScreen() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
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
            setEmail('');
            UserRemovedAlert();
            
        } catch (e: any) {
            setError(e.message || "Virhe käyttäjän poistossa.");
        } finally {
            setLoading(false);
        }
        
    }
    return (
        <View style={styles.container}>
            <TextInput placeholder="Sähköposti" value={email} onChangeText={setEmail} style={styles.input} autoCorrect={false} keyboardType="email-address" />
            <TextInput placeholder="Salasana" value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.input} autoCorrect={false} />
            <Button onPress={handleRemoveUser} title="Poista Käyttäjä" disabled={isDisabled} />
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
