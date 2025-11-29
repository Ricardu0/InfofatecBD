import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  Animated
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Card from '../components/Card';
import { useTheme } from '../../context/ThemeContext';

export default function EducacaoScreen() {
  const { isDark, theme, fadeAnim } = useTheme();

  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  // 🐛 Debug - pode remover depois
  React.useEffect(() => {
    console.log('🎨 EducacaoScreen - isDark:', isDark);
  }, [isDark]);

  // Cursos FATEC com cores personalizadas
  const cursosFatec = [
    { 
      id: 1, 
      titulo: 'Ciência de Dados', 
      descricao: 'Domine Python, estatística e machine learning. Transforme dados brutos em insights estratégicos para tomada de decisões.', 
      imagem_url: 'https://cdn-icons-png.flaticon.com/512/4324/4324895.png',
      cor: isDark ? '#4fc3f7' : '#ff6b6b'
    },
    { 
      id: 2, 
      titulo: 'Comércio Exterior', 
      descricao: 'Logística internacional, processos de importação/exportação, câmbio e estratégias de mercado global.', 
      imagem_url: 'https://cdn-icons-png.flaticon.com/512/1041/1041880.png',
      cor: isDark ? '#7c4dff' : '#ffa726'
    },
    { 
      id: 3, 
      titulo: 'Desenvolvimento de Software Multiplataforma', 
      descricao: 'Crie aplicações web, mobile e desktop. JavaScript, React Native, APIs REST e design de interfaces modernas.', 
      imagem_url: 'https://cdn-icons-png.flaticon.com/512/2721/2721290.png',
      cor: isDark ? '#00bcd4' : '#ff7043'
    },
    { 
      id: 4, 
      titulo: 'Design de Produto', 
      descricao: 'Modelagem 3D, prototipagem rápida e design industrial. Do conceito à manufatura com foco em inovação.', 
      imagem_url: 'https://cdn-icons-png.flaticon.com/512/1829/1829448.png',
      cor: isDark ? '#26c6da' : '#ec407a'
    },
    { 
      id: 5, 
      titulo: 'Gestão da Produção Industrial', 
      descricao: 'Otimize processos produtivos com Lean Manufacturing, Six Sigma, qualidade total e automação industrial.', 
      imagem_url: 'https://cdn-icons-png.flaticon.com/512/3135/3135755.png',
      cor: isDark ? '#4fc3f7' : '#ff6b6b'
    },
    { 
      id: 6, 
      titulo: 'Gestão Empresarial', 
      descricao: 'Planejamento estratégico, finanças corporativas, marketing digital e liderança orientada por dados e resultados.', 
      imagem_url: 'https://cdn-icons-png.flaticon.com/512/5956/5956593.png',
      cor: isDark ? '#7c4dff' : '#ffa726'
    },
  ];

  // ✅ Cores animadas baseadas no tema
  const animatedColors = {
    container: fadeAnim.interpolate({ 
      inputRange: [0, 1], 
      outputRange: [theme.container, theme.container] // usa direto do theme
    }),
    text: fadeAnim.interpolate({ 
      inputRange: [0, 1], 
      outputRange: [theme.text, theme.text] 
    }),
    textSecondary: fadeAnim.interpolate({ 
      inputRange: [0, 1], 
      outputRange: [theme.textSecondary, theme.textSecondary] 
    }),
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(t);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  if (loading) {
    return (
      <Animated.View style={[styles.center, { backgroundColor: theme.container }]}>
        <ActivityIndicator 
          size="large" 
          color={isDark ? theme.colors.cool2 : theme.colors.warm4} 
        />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Carregando cursos...
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.container }]}>
      <FlatList
        data={cursosFatec}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            titulo={item.titulo}
            texto={item.descricao}
            imagem={item.imagem_url}
            cor={item.cor}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[isDark ? theme.colors.cool2 : theme.colors.warm4]}
            tintColor={isDark ? theme.colors.cool2 : theme.colors.warm4}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Nenhum curso disponível
            </Text>
          </View>
        }
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, textAlign: 'center' },
});