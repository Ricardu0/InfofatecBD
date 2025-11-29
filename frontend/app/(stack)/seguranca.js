// stacks/SegurancaStack.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Card from '../components/Card';
import { apiService, API_HOSTNAME } from '../_services/api';

export default function SegurancaScreen() {
  const [conteudos, setConteudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      carregarConteudos();
    }, [])
  );

  const carregarConteudos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSeguranca();
      
      if (response.success) {
        const conteudosComImagens = response.data.map(item => ({
          ...item,
          imagem_url: item.imagem_url ? `${API_HOSTNAME}${item.imagem_url}` : (item.imagem ? `${API_HOSTNAME}/uploads/${item.imagem}` : null)
        }));
        setConteudos(conteudosComImagens);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarConteudos();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Carregando conteúdos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conteudos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            titulo={item.titulo}
            texto={item.descricao}
            imagem={item.imagem_url}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8b5cf6']}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum conteúdo disponível</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});