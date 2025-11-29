// screens/UploadScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { apiService } from '../_services/api';

export default function UploadScreen() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false);

  const selecionarImagem = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const enviarConteudo = async () => {
    if (!titulo || !descricao) {
      Alert.alert('Atenção', 'Preencha título e descrição!');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);

    // Se houver imagem selecionada, anexa ao FormData (se não, envia apenas JSON via client)
    if (imagem) {
      const filename = imagem.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('imagem', {
        uri: imagem,
        type: 'image/jpeg',
        name: 'foto.jpg',
      });
    }

    try {
  // Se não houver imagem, enviar um objeto simples (JSON) para usar payload menor
  const payload = imagem ? formData : { titulo, descricao };
  const result = await apiService.createCultura(payload);
      
      if (result.success) {
        Alert.alert('Sucesso', 'Conteúdo enviado com sucesso!');
        setTitulo('');
        setDescricao('');
        setImagem(null);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao enviar conteúdo');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao enviar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Adicionar Conteúdo Cultural</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
      />
      
      <Button 
        title="Selecionar Imagem" 
        onPress={selecionarImagem} 
      />
      
      {imagem && (
        <Image source={{ uri: imagem }} style={styles.preview} />
      )}
      
      <Button
        title={loading ? "Enviando..." : "Enviar Conteúdo"}
        onPress={enviarConteudo}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
  },
});