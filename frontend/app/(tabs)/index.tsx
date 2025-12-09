import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import ChatbotFAB from '../../../frontend/components/ChatbotFAB';

export default function Index() {
  const { isDark, toggleTheme, fadeAnim } = useTheme();

  const menuItems = [
    { 
      title: 'Cultura', 
      href: '/(stack)/cultura', 
      colorLight: '#ff5100ff',
      colorDark: '#fceb00ff',
      bgLight: 'rgba(255, 81, 0, 0.1)',
      bgDark: 'rgba(252, 235, 0, 0.1)',
      icon: 'theater-outline'
    },
    { 
      title: 'Educação', 
      href: '/(stack)/educacao', 
      colorLight: '#86fa02ff',
      colorDark: '#00ff00ff',
      bgLight: 'rgba(134, 250, 2, 0.1)',
      bgDark: 'rgba(0, 255, 0, 0.1)',
      icon: 'school-outline'
    },
    { 
      title: 'Empregos', 
      href: '/(stack)/empregos', 
      colorLight: '#00fff2ff',
      colorDark: '#0b7e8dff',
      bgLight: 'rgba(0, 255, 242, 0.1)',
      bgDark: 'rgba(11, 126, 141, 0.1)',
      icon: 'briefcase-outline'
    },
    { 
      title: 'Segurança', 
      href: '/(stack)/seguranca', 
      colorLight: '#ad29c7ff',
      colorDark: '#7700ffff',
      bgLight: 'rgba(173, 41, 199, 0.1)',
      bgDark: 'rgba(119, 0, 255, 0.1)',
      icon: 'shield-checkmark-outline'
    },
    { 
      title: 'Sobre', 
      href: '/(stack)/aboutme', 
      colorLight: '#fa4bb1ff',
      colorDark: '#ff49c8ff',
      bgLight: 'rgba(250, 75, 177, 0.1)',
      bgDark: 'rgba(255, 73, 200, 0.1)',
      icon: 'information-circle-outline'
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
    subtext: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#666666', '#a0a0a0'],
    }),
  };

  return (
    <View style={styles.mainContainer}>
      <Animated.ScrollView 
        style={[styles.container, { backgroundColor: animatedTheme.container }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerContainer}>
          <View>
            <Animated.Text style={[styles.header, { color: animatedTheme.header }]}>
              InfoFatec
            </Animated.Text>
            <Animated.Text style={[styles.subtitle, { color: animatedTheme.subtext }]}>
              FATEC Cotia
            </Animated.Text>
          </View>
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
          <View style={styles.welcomeHeader}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>👋</Text>
            </View>
            <Animated.Text style={[styles.welcomeTitle, { color: animatedTheme.header }]}>
              Seja bem-vindo!
            </Animated.Text>
          </View>
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
                  <View style={styles.itemContent}>
                    <Animated.View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [item.bgLight, item.bgDark],
                          }),
                        },
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={24}
                        color={isDark ? item.colorDark : item.colorLight}
                      />
                    </Animated.View>
                    
                    <View style={styles.textContent}>
                      <Animated.Text style={[styles.title, { color: animatedTheme.text }]}>
                        {item.title}
                      </Animated.Text>
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
                    </View>
                  </View>
                  
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDark ? '#666666' : '#999999'}
                  />
                </Animated.View>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Chatbot FAB posicionado no canto inferior direito */}
      <View style={styles.chatbotContainer}>
        <ChatbotFAB />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 100, // Espaço extra para o chatbot FAB
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  header: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.2,
    opacity: 0.7,
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
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emojiContainer: {
    marginRight: 10,
  },
  emoji: {
    fontSize: 24,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.2,
    opacity: 0.9,
  },
  list: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  indicator: {
    width: 36,
    height: 3,
    borderRadius: 2,
  },
  chatbotContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
});