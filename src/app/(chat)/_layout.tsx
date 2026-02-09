import { Stack } from 'expo-router';

export default function ChatLayout() {
    return (
        <Stack>
            <Stack.Screen name="messages" options={{ animation: 'default', title: '' }} />
        </Stack>
    );
}
