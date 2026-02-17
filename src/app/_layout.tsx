import { useColorScheme } from '@/src/components/useColorScheme';
import Toast from 'react-native-toast-message';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import LoadingScreen from '../components/LoadingScreen';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { useOrganizationMembership } from '../hooks/useOrganizationMembership';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import HeaderSignoutButton from '../components/signout/HeaderSignoutButton';
import { KeyboardProvider } from "react-native-keyboard-controller";

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
    const { role, loading } = useOrganizationMembership(user);

    // Handle user state changes
    function handleAuthStateChanged(user: any) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);

        return subscriber; // unsubscribe on unmount
    }, []);

    const isMembershipReady = !user || role !== null;

    // Hide splash screen when initializing becomes false
    useEffect(() => {
        if (!initializing && isMembershipReady) {
            SplashScreen.hideAsync();
        }
    }, [initializing, isMembershipReady]);

    if (initializing || loading) return <LoadingScreen />;

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <KeyboardProvider>
                        <>
                            <Stack>
                                <Stack.Protected guard={user && role}>
                                    <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "none", title: "" }} />
                                    <Stack.Screen name="(settings)/settings" options={{ animation: "default", title: "Asetukset" }} />
                                    <Stack.Screen name="(settings)/account-settings" options={{ title: "Tiliasetukset" }} />
                                    <Stack.Screen name="(settings)/profile-settings" options={{ title: "Profiiliasetukset" }} />
                                    <Stack.Screen name="(settings)/app-settings" options={{ title: "Sovellusasetukset" }} />
                                    <Stack.Screen name="(settings)/change-password" options={{ title: "Vaihda Salasana" }} />
                                    <Stack.Screen name="(settings)/change-email" options={{ title: "Vaihda Sähköposti" }} />
                                    <Stack.Screen name="(settings)/delete-user" options={{ title: "Poista Käyttäjä" }} />
                                    <Stack.Screen name="(chat)/messages" options={{ title: "" }} />
                                </Stack.Protected>
                                <Stack.Protected guard={user && !role}>
                                    <Stack.Screen name="(organization)/setup-organization" options={{
                                        animation: "default", title: "Organisaatio", headerRight: () => (
                                            <HeaderSignoutButton />
                                        )
                                    }} />
                                    <Stack.Screen name="(organization)/join-organization" options={{ title: "Liity Organisaatioon" }} />
                                    <Stack.Screen name="(organization)/create-organization" options={{ title: "Luo Organisaatio" }} />
                                </Stack.Protected>
                                <Stack.Protected guard={user && role === "admin"}>
                                    <Stack.Screen name="(admin)/admin-settings" options={{ title: "Ylläpitäjän Asetukset" }} />
                                    <Stack.Screen name="(admin)/manage-members" options={{ title: "Hallitse Jäseniä" }} />
                                    <Stack.Screen name="(admin)/member-modal" options={{ presentation: 'modal', animation: "slide_from_bottom", title: "Jäsenen hallinta" }} />
                                </Stack.Protected>
                                <Stack.Protected guard={!user}>
                                    <Stack.Screen name="auth" options={{ headerShown: false, animation: "none" }} />
                                </Stack.Protected>
                            </Stack>
                            <Toast />
                        </>
                    </KeyboardProvider>
                </ThemeProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}
