import { StyleSheet, TextInput, Button, Alert } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import { useState } from 'react';
import { createMember } from '../../services/members.service';
import { updateUserOrganization } from '../../services/users.service';
import { router } from 'expo-router';

export default function JoinOrganizationScreen() {
    const [organizationId, setOrganizationId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleJoinOrganization = async () => {
        const oid=organizationId.trim();
        if (!oid) {
            Alert.alert("Virhe", "Organisaation ID on pakollinen");
            return;
        }

        setIsLoading(true);
        try {
            // update user's organizationId
            await updateUserOrganization(oid);
            // create user as a organization member
            await createMember("member", oid);
            router.replace('/');
        } catch (error) {
            console.error("Error joining organization:", error);
            Alert.alert("Virhe", "Organisaatioon liittyminen epäonnistui. Tarkista organisaation ID.");
        } finally { 
            setIsLoading(false);
        }
    };

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
