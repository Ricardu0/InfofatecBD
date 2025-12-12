// frontend/components/ChatbotModal.tsx - VERSÃO ATUALIZADA
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

// ✅ Configuração segura - URL do backend
const getBackendUrl = () => {
  // Em desenvolvimento local
  if (__DEV__) {
    return Platform.select({
      android: 'http://10.0.2.2:3001',
      ios: 'http://localhost:3001',
      default: 'http://localhost:3001'
    });
  }
  
  // Em produção - use a variável de ambiente
  return process.env.EXPO_PUBLIC_BACKEND_URL || 'https://seu-backend.render.com';
};

const BACKEND_URL = getBackendUrl();

export default function ChatbotModal({ visible, onClose }: ChatbotModalProps) {
  const { isDark, theme, fadeAnim } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! 👋 Sou o EduAssist, seu assistente inteligente sobre a Fatec Cotia. Posso te ajudar com:\n\n📚 **Cursos** - informações detalhadas\n🎓 **Educação** - orientação acadêmica\n💼 **Empregos** - oportunidades de carreira\n🛡️ **Segurança** - dicas e políticas\n🎭 **Cultura** - eventos e comunidade\n\nPor onde gostaria de começar?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const slideAnim = useRef(new Animated.Value(300)).current;

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

  // Sistema de Intents
  const detectIntent = (userMessage: string): string => {
    const lowercaseMsg = userMessage.toLowerCase();

    if (/curso|graduação|estudo|programação|desenvolvimento|dados|design|gestão|comércio/i.test(lowercaseMsg)) {
      return 'cursos';
    }
    if (/vestibular|inscrição|ingresso|disciplina|professor|nota|semestre|matéria|avaliação/i.test(lowercaseMsg)) {
      return 'educacao';
    }
    if (/emprego|carreira|trabalho|profissão|mercado|salário|oportunidade|estágio|linkedin/i.test(lowercaseMsg)) {
      return 'empregos';
    }
    if (/segurança|senha|login|autenticação|privacidade|proteção|dados|vírus|malware|safe|antivírus/i.test(lowercaseMsg)) {
      return 'seguranca';
    }
    if (/evento|festa|comunidade|clube|grupo|amigo|atividade|cultural|show|palestra/i.test(lowercaseMsg)) {
      return 'cultura';
    }
    if (/contato|telefone|endereço|horário|localização|como chegar|email/i.test(lowercaseMsg)) {
      return 'info_geral';
    }

    return 'geral';
  };

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
      const intent = detectIntent(inputText);

      // Preparar histórico
      const chatHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      const systemPrompt = `Você é EduAssist, um assistente inteligente e amigável da Fatec Cotia (Faculdade de Tecnologia de Cotia), instituição pública de ensino superior vinculada ao Centro Paula Souza (Governo de SP).

PERSONALIDADE:
- Sempre responda em português brasileiro
- Seja entusiasmado, mas profissional
- Use emojis adequados para melhorar a experiência
- Divida respostas longas em tópicos claros
- Sempre ofereça próximas ações ou perguntas relacionadas

ESCOPO DE ATUAÇÃO - RESPONDA SOBRE TODOS ESSES ASPECTOS:

═══════════════════════════════════════════

1️⃣ **CURSOS DISPONÍVEIS:**

**Desenvolvimento de Software Multiplataforma (DSM)**
- Período: Noite | Duração: 3 anos (6 semestres)
- Foco: Web Full-Stack (JS/React), Mobile (React Native), Desktop, APIs REST, DevOps
- Tecnologias: JavaScript, TypeScript, Node.js, React, React Native, Python, SQL, MongoDB, Docker
- Carreira: Desenvolvedor Full-Stack, Frontend/Backend Engineer, Mobile Developer, Arquiteto de Software

**Ciência de Dados (CD)**
- Período: Noite | Duração: 3 anos (6 semestres)
- Foco: Machine Learning, Big Data, Inteligência Artificial, Análise Preditiva
- Tecnologias: Python, R, TensorFlow, Scikit-learn, SQL, Spark, Pandas, Numpy
- Carreira: Data Scientist, ML Engineer, Business Analyst, Data Engineer

**Gestão Empresarial (GE)**
- Modalidades: Presencial (Manhã) e EaD
- Duração: 3 anos (6 semestres)
- Foco: Administração, RH, Marketing, Finanças, Logística, Empreendedorismo
- Carreira: Gerente, Consultor Empresarial, Empreendedor, Analista de Negócios

**Gestão da Produção Industrial (GPI)**
- Período: Manhã ou Noite | Duração: 3 anos (6 semestres)
- Foco: Processos Industriais, Lean Manufacturing, Controle de Qualidade, Logística
- Tecnologias: SAP, ERP, Lean, Six Sigma, PDCA
- Carreira: Gerente de Produção, Engenheiro de Processos, Supervisor

**Design de Produto**
- Período: Manhã | Duração: 3 anos
- Foco: Prototipagem, Modelagem 3D, Design Industrial, Ergonomia
- Ferramentas: AutoCAD, Fusion 360, Solidworks, Figma
- Carreira: Designer Industrial, Product Manager, UX/UI Designer

**Comércio Exterior (COMEX)**
- Período: Tarde/Noite | Duração: 3 anos
- Foco: Importação, Exportação, Câmbio, Logística Internacional
- Carreira: Especialista em Comércio Exterior, Gestor de Logística

═══════════════════════════════════════════

2️⃣ **EDUCAÇÃO E ACADÊMICO:**

**Ingresso:**
- Processo: Vestibular (2x ao ano - 1º e 2º semestres)
- Site: www.vestibularfatec.com.br
- Teste: Múltipla escolha + redação (presencial)
- Isenção: Disponível para baixa renda (períodos específicos)
- Sistema de Pontos: +10% bônus escola pública, +3% afrodescendentes

**Informações Académicas:**
- A Fatec é **100% gratuita** - só há taxa na inscrição do vestibular
- Semestres: 6 semestres (3 anos)
- Aulas presenciais (exceto Gestão Empresarial com opção EaD)
- Avaliação por notas e projetos práticos

═══════════════════════════════════════════

3️⃣ **EMPREGOS E OPORTUNIDADES:**

**Mercado de Trabalho:**
- Demanda alta para: Desenvolvedores Full-Stack, Data Scientists, Product Managers
- Salários iniciais (2024): Dev Jr R$ 3-4.5k, Data Jr R$ 4-5.5k, Gestão Jr R$ 3.5-4.5k
- Empresas que contratam: Tech startups, Multinacionais, Empresas de consultoria, Bancos

═══════════════════════════════════════════

4️⃣ **SEGURANÇA (Dicas Essenciais):**

**Segurança de Dados Pessoais:**
- Nunca compartilhe sua senha com ninguém
- Use senhas fortes: +8 caracteres, maiúsculas, números, símbolos
- Ative autenticação de dois fatores (2FA)

═══════════════════════════════════════════

5️⃣ **CULTURA E COMUNIDADE:**

**Eventos:**
- Semana da Tecnologia (palestras, workshops, hackathons)
- Competições de programação (Code Challenges)
- Café com Empresas (networking)

═══════════════════════════════════════════

6️⃣ **INFORMAÇÕES DE CONTATO:**

📍 **Endereço:** Rua Nelson Raineri, 700 - Bairro do Lageado, Cotia - SP
📞 **Telefone:** (11) 4616-3284
📧 **Email:** f270acad@cps.sp.gov.br
🌐 **Site:** https://fateccotia.cps.sp.gov.br

═══════════════════════════════════════════

DIRECTRIZES DE RESPOSTA:
- Sempre relacione a resposta ao contexto do usuário
- Ofereça exemplos práticos quando possível
- Sugira cursos ou disciplinas baseado no interesse mencionado
- Se não souber algo específico, seja honesto
- Termine sempre com uma pergunta de acompanhamento
- Use formatação clara (bold, emojis, listas)
- Respeite a intenção detectada (${intent})

Sua resposta deve ser amigável, informativa e sempre incentivadora!`;

      // ✅ Chamada ao BACKEND (não diretamente à API)
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatHistory,
            { role: 'user', content: inputText.trim() }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro do backend:', response.status, errorText);
        throw new Error(`Erro: ${response.status}`);
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
        throw new Error('Resposta inesperada');
      }
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: '❌ Desculpe, estou com dificuldades técnicas. Tente novamente em alguns momentos.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: 'Olá! 👋 Sou o EduAssist, seu assistente inteligente sobre a Fatec Cotia. Posso te ajudar com:\n\n📚 **Cursos**\n🎓 **Educação**\n💼 **Empregos**\n🛡️ **Segurança**\n🎭 **Cultura**\n\nPor onde gostaria de começar?',
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
    '📚 Qual curso escolher?',
    '💼 Oportunidades de emprego',
    '🛡️ Como proteger dados?',
    '🎭 Eventos na Fatec',
    '🎓 Como ingressar?',
    '📞 Informações de contato',
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
                  <Text style={styles.title}>EduAssist - IA</Text>
                  <Text style={styles.subtitle}>🎓 Fatec Cotia • Online</Text>
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
                    placeholder="Faça sua pergunta..."
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
                  ⚡ Perguntas rápidas:
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
                        numberOfLines={1}
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
    maxWidth: '85%',
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
    fontWeight: '600',
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
    maxWidth: '48%',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});