import React, { createContext, useContext, useState, useEffect } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  isDark: boolean;
  theme: typeof lightTheme;
  toggleTheme: () => void;
  fadeAnim: Animated.Value;
}

export const lightTheme = {
  container: '#fafafa',
  header: '#1a1a1a',
  card: 'rgba(255, 255, 255, 0.7)',
  cardBorder: 'rgba(255, 255, 255, 0.9)',
  text: '#2d2d2d',
  textSecondary: '#666666',
  arrow: '#b0b0b0',
  colors: {
    warm1: '#ff6b6b',
    warm2: '#ffa726',
    warm3: '#ff7043',
    warm4: '#ec407a',
  },
};

export const darkTheme = {
  container: '#0d0d0d',
  header: '#f5f5f5',
  card: 'rgba(26, 26, 26, 0.5)',
  cardBorder: 'rgba(255, 255, 255, 0.05)',
  text: '#e8e8e8',
  textSecondary: '#999999',
  arrow: '#555555',
  colors: {
    cool1: '#4fc3f7',
    cool2: '#7c4dff',
    cool3: '#00bcd4',
    cool4: '#26c6da',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Carrega o tema salvo
  useEffect(() => {
    loadTheme();
  }, []);

  // Anima quando muda o tema
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isDark ? 1 : 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [isDark]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Erro ao carregar tema:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('@theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Erro ao salvar tema:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme, fadeAnim }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};