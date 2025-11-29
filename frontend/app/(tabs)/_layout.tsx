import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

// ✅ Agora usa o contexto que já existe no app
export default function StackLayout() {
  const { isDark } = useTheme(); // 👈 pega o tema do contexto global

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </NavigationThemeProvider>
  );
}