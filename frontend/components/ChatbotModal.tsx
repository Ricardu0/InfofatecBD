// components/ChatbotModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ChatbotModal({ visible, onClose }: ChatbotModalProps) {
  const { isDark, theme, fadeAnim } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! Sou o EduAssist, seu assistente para recomendação de cursos. Posso ajudar você a encontrar cursos baseados em seus interesses, objetivos de carreira ou áreas de estudo. Por onde gostaria de começar?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Configuração da API corrigida
  const API_CONFIG = {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: 'sua chave aqui! api key here!',
    model: 'meta-llama/llama-3.3-70b-instruct:free', // Modelo corrigido
  };

  // Cores animadas
  const animatedColors = {
    container: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#f8f9fa', '#1a1a1a'],
    }),
    header: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#00ebdfff', '#9f00adff'],
    }),
    card: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#ffffff', '#2a2a2a'],
    }),
    input: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#f8f9fa', '#1a1a1a'],
    }),
    inputBorder: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#e0e0e0', '#333333'],
    }),
  };

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible]);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Preparar o histórico de mensagens no formato correto
      const chatHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      // Corrigindo a chamada API conforme a estrutura fornecida
      const response = await fetch(API_CONFIG.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.apiKey}`,
          'HTTP-Referer': 'http://localhost:8081',
          'X-Title': 'EduAssist App',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: API_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: `Você é EduAssist, assistente de orientação educacional da FATEC.
Suas funções:

Recomendar cursos conforme interesses, habilidades e objetivos profissionais.

Explicar áreas de estudo, mercado de trabalho e caminhos de carreira.

Orientar sobre ingresso na FATEC e processo seletivo.

Responder apenas sobre educação, cursos, carreira e informações acadêmicas.

Cursos disponíveis:

Ciência de Dados: Python, estatística, machine learning, análise de dados.

Comércio Exterior: logística internacional, importação/exportação, câmbio.

Desenvolvimento de Software Multiplataforma: web/mobile/desktop, JS, React Native, APIs.

Design de Produto: modelagem 3D, prototipagem, design industrial.

Gestão da Produção Industrial: Lean, Six Sigma, qualidade, automação.

Gestão Empresarial: estratégia, finanças, marketing, liderança.

Diretrizes de resposta:

Seja claro, útil e encorajador.

Sempre que possível, ofereça níveis (iniciante/intermediário/avançado) e modalidades (online/presencial/híbrido).

Não trate de assuntos fora do escopo educacional.`
            },
            ...chatHistory,
            {
              role: 'user',
              content: inputText.trim()
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro da API:', response.status, errorText);
        throw new Error(`Erro na API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: data.choices[0].message.content,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
      } else {
        console.error('Resposta inesperada:', data);
        throw new Error('Resposta inesperada da API');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente mais tarde.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      if (error instanceof Error) {
        if (error.message.includes('401')) {
          Alert.alert('Erro de Autenticação', 'Chave da API inválida. Verifique as configurações.');
        } else if (error.message.includes('404')) {
          Alert.alert('Erro de Conexão', 'Endpoint não encontrado. Verifique a URL da API.');
        } else {
          Alert.alert('Erro', error.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: 'Olá! Sou o EduAssist, seu assistente para recomendação de cursos. Posso ajudar você a encontrar cursos baseados em seus interesses, objetivos de carreira ou áreas de estudo. Por onde gostaria de começar?',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const quickActions = [
    'Cursos de programação',
    'Habilidades em demanda',
    'Cursos gratuitos',
    'Mudança de carreira',
  ];

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Animated.View
        style={[
          styles.messageBubble,
          item.isUser
            ? [styles.userBubble, { backgroundColor: animatedColors.header }]
            : [styles.botBubble, { backgroundColor: animatedColors.card }],
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : { color: theme.text },
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            item.isUser ? styles.userTimestamp : { color: theme.textSecondary },
          ]}
        >
          {formatTime(item.timestamp)}
        </Text>
      </Animated.View>
    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: animatedColors.container,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
          >
            {/* Header */}
            <Animated.View
              style={[styles.header, { backgroundColor: animatedColors.header }]}
            >
              <View style={styles.headerContent}>
                <View style={styles.headerInfo}>
                  <Text style={styles.title}>EduAssist - Assistente IA</Text>
                  <Text style={styles.subtitle}>📚 Online • Educação</Text>
                </View>

                <View style={styles.headerActions}>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={clearChat}
                  >
                    <Ionicons name="refresh" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={onClose}
                  >
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* Messages List */}
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            />

            {/* Input Area */}
            <Animated.View
              style={[
                styles.inputContainer,
                { backgroundColor: animatedColors.card },
              ]}
            >
              <View style={styles.inputWrapper}>
                <Animated.View
                  style={[
                    styles.textInputContainer,
                    {
                      backgroundColor: animatedColors.input,
                      borderColor: animatedColors.inputBorder,
                    },
                  ]}
                >
                  <TextInput
                    style={[styles.textInput, { color: theme.text }]}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Digite sua mensagem..."
                    placeholderTextColor={theme.textSecondary}
                    multiline
                    maxLength={500}
                    editable={!isLoading}
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
                  />
                </Animated.View>

                <Animated.View
                  style={[
                    styles.sendButton,
                    {
                      backgroundColor:
                        !inputText.trim() || isLoading
                          ? '#ccc'
                          : animatedColors.header,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.sendButtonInner}
                    onPress={sendMessage}
                    disabled={!inputText.trim() || isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Ionicons name="send" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>

              {/* Quick Actions */}
              <View style={styles.quickActions}>
                <Text style={[styles.quickActionsTitle, { color: theme.textSecondary }]}>
                  Perguntas rápidas:
                </Text>
                <View style={styles.quickActionsRow}>
                  {quickActions.map((action, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.quickActionButton,
                        { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' },
                      ]}
                      onPress={() => setInputText(action)}
                    >
                      <Text
                        style={[
                          styles.quickActionText,
                          { color: theme.text },
                        ]}
                      >
                        {action}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  textInput: {
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    marginTop: 12,
  },
  quickActionsTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quickActionText: {
    fontSize: 12,
  },
});