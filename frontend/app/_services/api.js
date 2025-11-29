import { Platform } from 'react-native';

// Configuração do Host
const getApiHost = () => {
  if (process.env?.EXPO_PUBLIC_API_HOST) return process.env.EXPO_PUBLIC_API_HOST;

  switch (Platform.OS) {
    case 'web':
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      return `http://${hostname}:3300`;
    case 'android':
      return 'http://10.0.2.2:3300';
    default:
      return 'http://localhost:3300';
  }
};

export const API_HOSTNAME = getApiHost();
export const API_BASE_URL = `${API_HOSTNAME}/api`;

console.log('🌐 API configurada:', API_BASE_URL);

// Função genérica para simplificar requisições
async function request(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro na requisição:', error);
    return { success: false, error: error.message };
  }
}

// ======== CULTURA =========
export const apiService = {
  cultura: {
    list: () => request(`${API_BASE_URL}/cultura`),

    create: (formData) =>
      request(`${API_BASE_URL}/cultura`, {
        method: 'POST',
        body: formData,
      }),

    update: (id, formData) =>
      request(`${API_BASE_URL}/cultura/${id}`, {
        method: 'PUT',
        body: formData,
      }),

    delete: (id) =>
      request(`${API_BASE_URL}/cultura/${id}`, {
        method: 'DELETE',
      }),
  },
};
