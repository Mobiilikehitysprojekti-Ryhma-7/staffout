import { Stack } from 'expo-router';

export default function SettingsLayout() {
    return (
        <Stack>
            <Stack.Screen name="settings" options={{ animation: 'default', title: 'Asetukset' }} />
            <Stack.Screen name="account-settings" options={{ animation: 'default', title: 'Tiliasetukset' }} />
            <Stack.Screen name="profile-settings" options={{ animation: 'default', title: 'Profiiliasetukset' }} />
            <Stack.Screen name="app-settings" options={{ animation: 'default', title: 'Sovellusasetukset' }} />
            <Stack.Screen name="change-password" options={{ animation: 'default', title: 'Vaihda Salasana' }} />
            <Stack.Screen name="change-email" options={{ animation: 'default', title: 'Vaihda Sähköposti' }} />
            <Stack.Screen name="delete-user" options={{ animation: 'default', title: 'Poista Käyttäjä' }} />
        </Stack>
    );
}
