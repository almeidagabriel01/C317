import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

// true = 'Organizador', false = 'Comprador'
const MOCK_ORGANIZER_ROLE = false;

// Cria uma instância do Axios
const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Função auxiliar para extrair mensagens de erro
const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    // Obtém a mensagem mais relevante de forma direta
    return error.response.data.detail ||
      error.response.data.message ||
      error.response.statusText ||
      `Erro ${error.response.status}`;
  } else if (error.request) {
    return 'Não foi possível conectar à API. Verifique sua conexão.';
  } else {
    return error.message || 'Ocorreu um erro desconhecido.';
  }
};


export const loginUser = async (email, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await apiClient.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.data.acess_token && !response.data.access_token) {
      console.warn("Resposta da API de login não continha 'access_token'. Resposta:", response.data);
    }

    // adicionando role manualmente até o backend retornar essa informação
    return {
      ...response.data,
      role: MOCK_ORGANIZER_ROLE ? 'Organizador' : 'Comprador'
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Função para Cadastro (/users/create) - Envia como JSON
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/users/create/', userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.status;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const fetchUsers = async () => {
  try {
    // Dados mockados para teste
    return [
      { id: 1, name: "João Silva", email: "joao@example.com", phone: "(11) 98765-4321", role: "Comprador", status: "Ativo", lastLogin: "18/05/2025" },
      { id: 2, name: "Maria Oliveira", email: "maria@example.com", phone: "(11) 91234-5678", role: "Comprador", status: "Ativo", lastLogin: "17/05/2025" },
      { id: 3, name: "Pedro Santos", email: "pedro@example.com", phone: "(11) 99876-5432", role: "Comprador", status: "Inativo", lastLogin: "10/05/2025" },
      { id: 4, name: "Ana Ferreira", email: "ana@example.com", phone: "(11) 95555-4444", role: "Comprador", status: "Ativo", lastLogin: "16/05/2025" },
      { id: 5, name: "Carlos Costa", email: "carlos@example.com", phone: "(11) 96666-7777", role: "Organizador", status: "Ativo", lastLogin: "19/05/2025" },
      { id: 6, name: "Luciana Mendes", email: "luciana@example.com", phone: "(11) 97777-8888", role: "Comprador", status: "Ativo", lastLogin: "15/05/2025" },
      { id: 7, name: "Roberto Alves", email: "roberto@example.com", phone: "(11) 98888-9999", role: "Comprador", status: "Inativo", lastLogin: "01/05/2025" },
      { id: 8, name: "Juliana Rocha", email: "juliana@example.com", phone: "(11) 99999-0000", role: "Comprador", status: "Ativo", lastLogin: "14/05/2025" },
    ];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateUser = async (userId, userData) => {
  try {
    // Simular sucesso para teste
    return { success: true, userId, ...userData };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    // Simular sucesso para teste
    return { success: true, userId, status };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};