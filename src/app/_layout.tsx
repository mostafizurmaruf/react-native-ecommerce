import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { LoadingScreen } from '@/components/loading-screen';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={status === 'unauthenticated'}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={status === 'authenticated'}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="filters" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="order-confirmation" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <CartProvider>
          <RootNavigator />
          <AnimatedSplashOverlay />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}