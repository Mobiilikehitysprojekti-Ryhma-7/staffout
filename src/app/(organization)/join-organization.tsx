import { StyleSheet, TextInput, Button, Alert } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import { useState } from 'react';
import { createMember } from '../../services/members.service';
import { updateUserOrganization } from '../../services/users.service';
import { router } from 'expo-router';

export async function joinOrganization(oid: string, role: string) {
    try {
        await updateUserOrganization(oid);

        await createMember(role, oid);
        console.log("Joined organization:", oid);
        router.replace('/');
    } catch (error) {
        console.error("Error joining organization:", error);
        Alert.alert("Virhe", "Organisaatioon liittyminen epäonnistui. Tarkista organisaation ID.");
    }
}

export default function JoinOrganizationScreen() {
    const [organizationId, setOrganizationId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleJoinOrganization = async () => {
        setIsLoading(true);
        const oid = organizationId.trim();
        if (!oid) {
            Alert.alert("Virhe", "Organisaation ID on pakollinen");
            setIsLoading(false);
            return;
        }
        try {
            await joinOrganization(oid, "member");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={organizationId}
                onChangeText={setOrganizationId}
                placeholder="Organisaation ID"
                editable={!isLoading}
            />
            <Button
                title={isLoading ? "Liitytään..." : "Liity organisaatioon"}
                onPress={handleJoinOrganization}
                disabled={isLoading}
            />
        </View>
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
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        width: '100%',
        borderRadius: 5,
    },
});
