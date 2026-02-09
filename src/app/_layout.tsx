import { useColorScheme } from '@/src/components/useColorScheme';
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

    if (initializing || !isMembershipReady) return <LoadingScreen />;

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <Stack>
                <Stack.Protected guard={user && role}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none', title: '' }} />
                    <Stack.Screen name="(settings)" options={{ headerShown: false }} />
                    <Stack.Screen name="(chat)" options={{ headerShown: false }} />
                </Stack.Protected>

                <Stack.Protected guard={user && !role}>
                    <Stack.Screen name="(organization)" options={{ headerShown: false }} />
                </Stack.Protected>

                <Stack.Protected guard={user && role === 'admin'}>
                    <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                </Stack.Protected>

                <Stack.Protected guard={!user}>
                    <Stack.Screen name="auth" options={{ headerShown: false, animation: 'none' }} />
                </Stack.Protected>
                    </Stack>
                </ThemeProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}
