import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Button,
  Image,
  Animated
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Card from '../components/Card';
import { apiService, API_HOSTNAME } from '../services/api';
import { useTheme } from '../../context/ThemeContext';

export default function CulturaScreen() {
  const { isDark, theme, fadeAnim } = useTheme();
  
  const [conteudos, setConteudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({ titulo: '', descricao: '' });
  const [imagem, setImagem] = useState(null);

  // Cores animadas
  const animatedColors = {
    container: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#f5f5f5', '#0d0d0d'],
    }),
    text: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#1a1a1a', '#e8e8e8'],
    }),
    textSecondary: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#666666', '#999999'],
    }),
    card: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255, 255, 255, 0.9)', 'rgba(26, 26, 26, 0.6)'],
    }),
    cardBorder: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(240, 240, 240, 1)', 'rgba(255, 255, 255, 0.08)'],
    }),
    input: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#fafafa', '#1a1a1a'],
    }),
    inputBorder: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#ddd', '#333'],
    }),
    modalOverlay: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)'],
    }),
    fab: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#8b5cf6', '#7c4dff'],
    }),
  };

  useFocusEffect(
    useCallback(() => {
      carregarConteudos();
    }, [])
  );

  const extractData = (resp) => {
    if (!resp) return [];
    if (Array.isArray(resp)) return resp;
    if (resp.success && resp.data) return resp.data;
    if (resp.data) return resp.data;
    return [];
  };

  const buildImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith('http')) return imgPath;
    const host = (API_HOSTNAME || '').replace(/\/$/, '');
    const path = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
    return host ? `${host}/${path}` : imgPath;
  };

  const carregarConteudos = async () => {
    try {
      setLoading(true);
      const resp = await apiService.cultura.list();
      const dados = extractData(resp);
      const mapeados = (dados || []).map(item => ({
        ...item,
        imagem_url: item.imagem_url || buildImageUrl(item.imagem) || item.imagem_url
      }));
      setConteudos(mapeados);
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os conteúdos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const selecionarImagem = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8
      });

      if (!result.canceled && result.assets?.[0]) {
        setImagem(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Falha ao selecionar imagem');
    }
  };

  const enviarConteudo = async () => {
    if (!formData.titulo.trim() || !formData.descricao.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    if (!imagem) {
      Alert.alert('Atenção', 'Selecione uma imagem!');
      return;
    }

    setUploading(true);

    try {
      const data = new FormData();
      data.append('titulo', formData.titulo);
      data.append('descricao', formData.descricao);

      const filename = imagem.split('/').pop();
      const fileExtension = filename.includes('.') ? filename.split('.').pop() : 'jpg';
      const mimetype = `image/${fileExtension.toLowerCase()}`;

      data.append('imagem', {
        uri: imagem,
        name: `image_${Date.now()}.${fileExtension}`,
        type: mimetype
      });

      const response = editingItem
        ? await apiService.cultura.update(editingItem._id, data)
        : await apiService.cultura.create(data);

      const ok = response && (response.success === true || response.status === 'ok' || response.id || response._id);

      if (ok) {
        Alert.alert('Sucesso', editingItem ? 'Conteúdo atualizado!' : 'Conteúdo criado!');
        fecharModal();
        carregarConteudos();
      } else {
        console.error('Resposta inesperada:', response);
        Alert.alert('Erro', response?.error || 'Erro ao salvar conteúdo');
      }
    } catch (error) {
      console.error('Erro ao enviar conteúdo:', error);
      Alert.alert('Erro', 'Falha ao enviar conteúdo');
    } finally {
      setUploading(false);
    }
  };

  const abrirModalCriar = () => {
    setEditingItem(null);
    setFormData({ titulo: '', descricao: '' });
    setImagem(null);
    setModalVisible(true);
  };

  const abrirModalEditar = (item) => {
    setEditingItem(item);
    setFormData({ titulo: item.titulo || '', descricao: item.descricao || '' });
    setImagem(item.imagem_url || null);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setEditingItem(null);
    setFormData({ titulo: '', descricao: '' });
    setImagem(null);
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir "${item.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const resp = await apiService.cultura.delete(item._id);
              if (resp && (resp.success === true || resp.deletedCount === 1 || resp.ok === 1)) {
                Alert.alert('Sucesso', 'Conteúdo excluído!');
                carregarConteudos();
              } else {
                Alert.alert('Erro', resp?.error || 'Erro ao excluir conteúdo');
              }
            } catch (error) {
              console.error('Erro ao excluir:', error);
              Alert.alert('Erro', 'Erro ao excluir conteúdo');
            }
          }
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarConteudos();
  };

  if (loading) {
    return (
      <Animated.View style={[styles.center, { backgroundColor: animatedColors.container }]}>
        <ActivityIndicator size="large" color={isDark ? '#7c4dff' : '#8b5cf6'} />
        <Animated.Text style={[styles.loadingText, { color: animatedColors.textSecondary }]}>
          Carregando conteúdos...
        </Animated.Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: animatedColors.container }]}>
      <Animated.View style={[styles.fab, { backgroundColor: animatedColors.fab }]}>
        <TouchableOpacity onPress={abrirModalCriar} style={styles.fabButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <FlatList
        data={conteudos}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={() => (
          <Animated.View 
            style={[
              styles.welcomeSection, 
              { 
                backgroundColor: animatedColors.card,
                borderColor: animatedColors.cardBorder 
              }
            ]}
          >
            <Animated.Text style={[styles.welcomeTitle, { color: animatedColors.text }]}>
              Cultura na FATEC 🎭
            </Animated.Text>
            <Animated.Text style={[styles.welcomeText, { color: animatedColors.textSecondary }]}>
              Descubra eventos culturais, apresentações artísticas e atividades que enriquecem a vida acadêmica na FATEC Cotia. Compartilhe suas experiências!
            </Animated.Text>
          </Animated.View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => abrirModalEditar(item)}>
            <Card
              titulo={item.titulo}
              texto={item.descricao}
              imagem={item.imagem_url}
              cor={isDark ? '#4fc3f7' : '#ff6b6b'}
              onDelete={() => handleDelete(item)}
            />
          </TouchableOpacity>
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
            <Animated.Text style={[styles.emptyText, { color: animatedColors.textSecondary }]}>
              Nenhum conteúdo cultural disponível
            </Animated.Text>
            <TouchableOpacity
              style={[styles.btnCriar, { backgroundColor: isDark ? theme.colors.cool2 : theme.colors.warm4 }]}
              onPress={abrirModalCriar}
            >
              <Text style={styles.btnCriarText}>Criar primeiro conteúdo</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={fecharModal}>
        <Animated.View style={[styles.modalOverlay, { backgroundColor: animatedColors.modalOverlay }]}>
          <Animated.View style={[styles.modalContent, { backgroundColor: animatedColors.card }]}>
            <Animated.Text style={[styles.modalTitle, { color: animatedColors.text }]}>
              {editingItem ? 'Editar Conteúdo' : 'Criar Conteúdo'}
            </Animated.Text>

            <Animated.View
              style={[
                styles.input,
                { backgroundColor: animatedColors.input, borderColor: animatedColors.inputBorder },
              ]}
            >
              <TextInput
                placeholder="Título"
                placeholderTextColor={isDark ? '#666' : '#999'}
                value={formData.titulo}
                onChangeText={(text) => setFormData({ ...formData, titulo: text })}
                style={{ color: theme.text }}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: animatedColors.input, borderColor: animatedColors.inputBorder },
              ]}
            >
              <TextInput
                placeholder="Descrição"
                placeholderTextColor={isDark ? '#666' : '#999'}
                value={formData.descricao}
                onChangeText={(text) => setFormData({ ...formData, descricao: text })}
                multiline
                numberOfLines={4}
                style={{ color: theme.text }}
              />
            </Animated.View>

            <TouchableOpacity
              style={[
                styles.imageButton,
                { backgroundColor: animatedColors.input, borderColor: animatedColors.inputBorder },
              ]}
              onPress={selecionarImagem}
              disabled={uploading}
            >
              <Animated.Text style={[styles.imageButtonText, { color: animatedColors.textSecondary }]}>
                {imagem ? 'Alterar Imagem' : 'Selecionar Imagem'}
              </Animated.Text>
            </TouchableOpacity>

            {imagem && <Image source={{ uri: imagem }} style={styles.imagePreview} />}

            <View style={styles.modalActions}>
              <Button title="Cancelar" onPress={fecharModal} color="#666" disabled={uploading} />
              <Button
                title={uploading ? 'Enviando...' : editingItem ? 'Atualizar' : 'Criar'}
                onPress={enviarConteudo}
                color={isDark ? theme.colors.cool2 : theme.colors.warm4}
                disabled={uploading}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16 },
  welcomeSection: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
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
    fontSize: 22,
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
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: 60 },
  emptyText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  btnCriar: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  btnCriarText: { color: '#fff', fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: { 
    borderRadius: 16, 
    padding: 24, 
    width: '100%', 
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  imageButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderStyle: 'dashed'
  },
  imageButtonText: { fontWeight: '500' },
  imagePreview: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 12 }
});