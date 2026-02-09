import { Stack } from 'expo-router';

export default function AdminLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="admin-settings"
                options={{ animation: 'default', title: 'Ylläpitäjän Asetukset' }}
            />
            <Stack.Screen
                name="manage-members"
                options={{ animation: 'default', title: 'Hallitse Jäseniä' }}
            />
            <Stack.Screen
                name="member-modal"
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                    title: 'Jäsenen hallinta',
                }}
            />
        </Stack>
    );
}
