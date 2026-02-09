import { Stack } from 'expo-router';
import HeaderLogoutButton from '../../components/signout/HeaderSignoutButton';

export default function OrganizationLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="setup-organization"
                options={{
                    animation: 'default',
                    title: 'Organisaatio',
                    headerRight: () => <HeaderLogoutButton />,
                }}
            />
            <Stack.Screen
                name="join-organization"
                options={{ animation: 'default', title: 'Liity Organisaatioon' }}
            />
            <Stack.Screen
                name="create-organization"
                options={{ animation: 'default', title: 'Luo Organisaatio' }}
            />
        </Stack>
    );
}
