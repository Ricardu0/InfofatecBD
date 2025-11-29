import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  titulo: string;
  texto: string;
  imagem: string;
  cor?: string;
  onPress?: () => void;
}

export default function Card({ titulo, texto, imagem, cor, onPress }: CardProps) {
  const { isDark, theme, fadeAnim } = useTheme();

  // Cores animadas do card
  const animatedCard = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.9)', 'rgba(26, 26, 26, 0.6)'],
  });

  const animatedBorder = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(240, 240, 240, 1)', 'rgba(255, 255, 255, 0.08)'],
  });

  const animatedImageBg = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(250, 250, 250, 1)', 'rgba(40, 40, 40, 1)'],
  });

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper 
      style={styles.cardWrapper} 
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: animatedCard,
            borderColor: animatedBorder,
          },
        ]}
      >
        {/* Container da imagem */}
        <Animated.View 
          style={[
            styles.imageContainer,
            { backgroundColor: animatedImageBg }
          ]}
        >
          {imagem ? (
            <Image
              source={{ uri: imagem }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
                Sem imagem
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Conteúdo com indicador */}
        <View style={styles.content}>
          {/* Indicador colorido (se tiver cor) */}
          {cor && (
            <View
              style={[
                styles.indicator,
                { backgroundColor: cor },
              ]}
            />
          )}

          <View style={styles.textContainer}>
            <Text style={[styles.titulo, { color: theme.text }]}>
              {titulo}
            </Text>
            <Text
              style={[styles.texto, { color: theme.textSecondary }]}
              numberOfLines={3}
            >
              {texto}
            </Text>
          </View>
        </View>
      </Animated.View>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flexDirection: 'row',
    padding: 18,
  },
  indicator: {
    width: 3.5,
    minHeight: 60,
    borderRadius: 2,
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
    marginBottom: 8,
    lineHeight: 24,
  },
  texto: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
});