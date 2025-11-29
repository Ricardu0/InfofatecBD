import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Animated
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';

export default function AboutMeScreen() {
  const { isDark, theme, fadeAnim } = useTheme();
  const [loading, setLoading] = React.useState(true);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  // Animação de entrada
  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(t);
    }, [])
  );

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => 
      console.error('Erro ao abrir link:', err)
    );
  };

  const links = [
    {
      id: 1,
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/seu-perfil',
      icon: '💼',
      color: '#0077b5'
    },
    {
      id: 2,
      name: 'GitHub',
      url: 'https://github.com/Ricardu0',
      icon: '💻',
      color: '#666666ff'
    },
    {
      id: 3,
      name: 'Lattes',
      url: 'http://lattes.cnpq.br/seu-lattes',
      icon: '📚',
      color: '#1565c0'
    },
    {
      id: 4,
      name: 'Portfólio',
      url: 'https://seu-portfolio.com',
      icon: '🎨',
      color: '#00897b'
    },
  ];

  const skills = [
    { name: 'React Native', level: 90, color: '#61dafb' },
    { name: 'JavaScript', level: 85, color: '#f7df1e' },
    { name: 'Python', level: 80, color: '#3776ab' },
    { name: 'UI/UX Design', level: 75, color: '#ff6b6b' },
  ];

  if (loading) {
    return (
      <Animated.View style={[styles.center, { backgroundColor: theme.container }]}>
        <ActivityIndicator 
          size="large" 
          color="#4a90e2" 
        />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Carregando perfil...
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.container }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header com foto de perfil */}
        <Animated.View 
          style={[
            styles.header,
            { 
              backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.imageContainer}>
            <Image
              source={ require('../components/image.png')}
              style={styles.profileImage}
            />
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
            </View>
          </View>
          
          <Text style={[styles.name, { color: theme.text }]}>
            Ricardo Fontes
          </Text>
          
          <Text style={[styles.title, { color: theme.textSecondary }]}>
            Desenvolvedor Full Stack | Estudante FATEC
          </Text>
        </Animated.View>

        {/* Sobre mim */}
        <View style={[
          styles.section,
          { 
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            borderLeftWidth: 4,
            borderLeftColor: '#4a90e2'
          }
        ]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            💡 Sobre Mim
          </Text>
          <Text style={[styles.bio, { color: theme.textSecondary }]}>
            Estudante apaixonado por tecnologia e inovação, cursando Desenvolvimento 
            de Software Multiplataforma na FATEC. Busco constantemente aprender novas 
            tecnologias e aplicar conhecimentos em projetos práticos que gerem impacto 
            real. Experiência em desenvolvimento mobile, web e interesse especial em 
            UX/UI Design e análise de daods.
          </Text>
        </View>

        {/* Skills */}
        <View style={[
          styles.section,
          { 
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            borderLeftWidth: 4,
            borderLeftColor: '#00c853'
          }
        ]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            🚀 Habilidades
          </Text>
          {skills.map((skill, index) => (
            <View key={index} style={styles.skillItem}>
              <View style={styles.skillHeader}>
                <Text style={[styles.skillName, { color: theme.text }]}>
                  {skill.name}
                </Text>
                <Text style={[styles.skillPercent, { color: theme.textSecondary }]}>
                  {skill.level}%
                </Text>
              </View>
              <View style={[
                styles.skillBar,
                { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }
              ]}>
                <View 
                  style={[
                    styles.skillProgress,
                    { 
                      width: `${skill.level}%`,
                      backgroundColor: skill.color
                    }
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Links para redes sociais */}
        <View style={[
          styles.section,
          { 
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            borderLeftWidth: 4,
            borderLeftColor: '#ff6b6b'
          }
        ]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            🔗 Conecte-se Comigo
          </Text>
          
          <View style={styles.linksContainer}>
            {links.map((link) => (
              <TouchableOpacity
                key={link.id}
                style={[
                  styles.linkButton,
                  { 
                    backgroundColor: link.color,
                  }
                ]}
                onPress={() => openLink(link.url)}
                activeOpacity={0.7}
              >
                <Text style={styles.linkIcon}>{link.icon}</Text>
                <Text style={styles.linkText}>{link.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Formação */}
        <View style={[
          styles.section,
          { 
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            borderLeftWidth: 4,
            borderLeftColor: '#ffa726'
          }
        ]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            🎓 Formação
          </Text>
          <View style={styles.educationItem}>
            <Text style={[styles.educationTitle, { color: theme.text }]}>
              Tecnologia em Desenvolvimento de Software Multiplataforma, 
              Técnico em Administração - ETEC COTIA
            </Text>
            <Text style={[styles.educationDetails, { color: theme.textSecondary }]}>
              FATEC São Paulo • 2023 - 2026
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Feito com ❤️ em React Native
          </Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#4a90e2',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00c853',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bio: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'justify',
  },
  skillItem: {
    marginBottom: 20,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
  },
  skillPercent: {
    fontSize: 14,
    fontWeight: '500',
  },
  skillBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  skillProgress: {
    height: '100%',
    borderRadius: 5,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  linkButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  linkIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  linkText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  educationItem: {
    paddingVertical: 8,
  },
  educationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  educationDetails: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
});