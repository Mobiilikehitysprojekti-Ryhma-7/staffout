import { useColorScheme } from '@/src/components/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { getAuth, onAuthStateChanged } from '@firebase/auth';

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

    // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();

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
                <Stack.Protected guard={user}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "none" }} />
                    <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                </Stack.Protected>

                <Stack.Protected guard={!user}>
                    <Stack.Screen name="auth" options={{ headerShown: false, animation: "none" }} />
                </Stack.Protected>
            </Stack>
        </ThemeProvider>
    );
}
