import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function Index() {
  const { isDark, toggleTheme, fadeAnim } = useTheme();

  const menuItems = [
    { 
      title: 'Cultura', 
      href: '/(stack)/cultura', 
      colorLight: '#ff6b6b',
      colorDark: '#4fc3f7'
    },
    { 
      title: 'Educação', 
      href: '/(stack)/educacao', 
      colorLight: '#ffa726',
      colorDark: '#7c4dff'
    },
    { 
      title: 'Empregos', 
      href: '/(stack)/empregos', 
      colorLight: '#ff7043',
      colorDark: '#00bcd4'
    },
    { 
      title: 'Segurança', 
      href: '/(stack)/seguranca', 
      colorLight: '#ec407a',
      colorDark: '#26c6da'
    },
    { 
      title: 'Sobre', 
      href: '/(stack)/aboutme', 
      colorLight: '#fd00e8ff',
      colorDark: '#26c6da'
    },
  ];

  // Cores animadas baseadas no tema
  const animatedTheme = {
    container: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#fafafa', '#0d0d0d'],
    }),
    header: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#1a1a1a', '#f5f5f5'],
    }),
    card: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255, 255, 255, 0.7)', 'rgba(26, 26, 26, 0.5)'],
    }),
    cardBorder: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.05)'],
    }),
    text: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#2d2d2d', '#e8e8e8'],
    }),
    arrow: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#b0b0b0', '#555555'],
    }),
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: animatedTheme.container }]}>
      <View style={styles.headerContainer}>
        <Animated.Text style={[styles.header, { color: animatedTheme.header }]}>
          InfoFatec
        </Animated.Text>
        <TouchableOpacity
          style={styles.themeButton}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isDark ? 'sunny' : 'moon'}
            size={22}
            color={isDark ? '#fbbf24' : '#3b82f6'}
          />
        </TouchableOpacity>
      </View>

      {/* Seção de Boas-vindas */}
      <Animated.View style={[styles.welcomeSection, { backgroundColor: animatedTheme.card, borderColor: animatedTheme.cardBorder }]}>
        <Animated.Text style={[styles.welcomeTitle, { color: animatedTheme.header }]}>
          Seja bem-vindo! 👋
        </Animated.Text>
        <Animated.Text style={[styles.welcomeText, { color: animatedTheme.text }]}>
          Bem-vindo ao sistema informacional da FATEC Cotia. Clique abaixo para conhecer mais sobre nossa instituição!
        </Animated.Text>
      </Animated.View>

      <View style={styles.list}>
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href} asChild>
            <TouchableOpacity activeOpacity={0.8}>
              <Animated.View
                style={[
                  styles.item,
                  {
                    backgroundColor: animatedTheme.card,
                    borderColor: animatedTheme.cardBorder,
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [item.colorLight, item.colorDark],
                      }),
                    },
                  ]}
                />
                <Animated.Text style={[styles.title, { color: animatedTheme.text }]}>
                  {item.title}
                </Animated.Text>
                <Animated.Text style={[styles.arrow, { color: animatedTheme.arrow }]}>
                  ›
                </Animated.Text>
              </Animated.View>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  themeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(128, 128, 128, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.1)',
  },
  welcomeSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.2,
    opacity: 0.9,
  },
  list: {
    paddingHorizontal: 20,
    gap: 14,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  indicator: {
    width: 3.5,
    height: 32,
    borderRadius: 2,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  arrow: {
    fontSize: 26,
    fontWeight: '200',
  },
});