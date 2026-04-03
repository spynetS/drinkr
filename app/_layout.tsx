import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

const CustomTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
  },
  fonts: {
    regular: { fontFamily: 'Roboto-Bold' },
    medium: { fontFamily: 'Roboto-Bold' },
    light: { fontFamily: 'Roboto-Bold' },
    thin: { fontFamily: 'Roboto-Bold' },
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (

    <ThemeProvider value={CustomTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="imposter"  />
        <Stack.Screen name="imposter_view"  />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
