import { useColorScheme } from '@/src/components/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import HeaderLogoutButton from '../components/signout/HeaderSignoutButton';
import { useOrganizationMembership } from '../hooks/useOrganizationMembership';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
    // Set the initial route to the auth screen.
    initialRouteName: '/auth',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<any>();
    const role = useOrganizationMembership();

    // Handle user state changes
    function handleAuthStateChanged(user: any) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);

        return subscriber; // unsubscribe on unmount
    }, []);

    // Hide splash screen when initializing becomes false
    useEffect(() => {
        if (!initializing) {
            SplashScreen.hideAsync();
        }
    }, [initializing]);

    if (initializing) return null;

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Protected guard={user && role}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "none", title: "" }} />
                    <Stack.Screen name="(settings)/settings" options={{ animation: "default", title: "Asetukset" }} />
                    <Stack.Screen name="(settings)/account-settings" options={{ animation: "default", title: "Tiliasetukset" }} />
                    <Stack.Screen name="(settings)/profile-settings" options={{ animation: "default", title: "Profiiliasetukset" }} />
                    <Stack.Screen name="(settings)/app-settings" options={{ animation: "default", title: "Sovellusasetukset" }} />
                    <Stack.Screen name="(settings)/change-password" options={{ animation: "default", title: "Vaihda Salasana" }} />
                    <Stack.Screen name="(settings)/change-email" options={{ animation: "default", title: "Vaihda Sähköposti" }} />
                    <Stack.Screen name="(settings)/delete-user" options={{ animation: "default", title: "Poista Käyttäjä" }} />
                </Stack.Protected>

                <Stack.Protected guard={user && !role}>
                    <Stack.Screen name="(organization)/setup-organization" options={{
                        animation: "default", title: "Organisaatio", headerRight: () => (
                            <HeaderLogoutButton />
                        )
                    }} />
                    <Stack.Screen name="(organization)/join-organization" options={{ animation: "default", title: "Liity Organisaatioon" }} />
                    <Stack.Screen name="(organization)/create-organization" options={{ animation: "default", title: "Luo Organisaatio" }} />
                </Stack.Protected>

                <Stack.Protected guard={user && role === "admin"}>
                    <Stack.Screen name="(admin)/admin-settings" options={{ animation: "default", title: "Ylläpitäjän Asetukset" }} />
                    <Stack.Screen name="(admin)/manage-members" options={{ animation: "default", title: "Hallitse Jäseniä" }} />
                    <Stack.Screen name="(admin)/member-modal" options={{ presentation: 'modal', animation: "slide_from_bottom", title: "Jäsenen hallinta" }} />
                </Stack.Protected>

                <Stack.Protected guard={!user}>
                    <Stack.Screen name="auth" options={{ headerShown: false, animation: "none" }} />
                </Stack.Protected>
            </Stack>
        </ThemeProvider>
    );
}
