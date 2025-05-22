import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8002';

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

// Função auxiliar para normalizar o role vindo do backend
const normalizeRole = (role) => {
  if (!role) return 'Comprador'; // Default
  
  const lowerRole = role.toLowerCase();
  if (lowerRole === 'organizador') return 'Organizador';
  if (lowerRole === 'comprador') return 'Comprador';
  
  // Caso venha com primeira letra maiúscula
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
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

    // Verificar se a resposta contém o token e o user
    if (!response.data.access_token) {
      throw new Error('Token de acesso não recebido da API.');
    }

    if (!response.data.user) {
      throw new Error('Dados do usuário não recebidos da API.');
    }

    // Normalizar o role do usuário
    const normalizedUser = {
      ...response.data.user,
      role: normalizeRole(response.data.user.role)
    };

    return {
      ...response.data,
      user: normalizedUser
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

// Função auxiliar para formatar telefone
const formatPhoneForDisplay = (phone) => {
  if (!phone) return '';
  
  // Remove caracteres não numéricos
  const digits = phone.replace(/\D/g, '');
  
  // Formata com base no número de dígitos
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  
  return phone; // Retorna sem formatação se não tiver o tamanho esperado
};

export const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/users/all');
    
    // Mapear dados da API para o formato esperado pela interface
    return response.data.map(user => ({
      id: user.ID,
      name: user.userName,
      email: user.Email,
      phone: formatPhoneForDisplay(user.NumCel),
      role: normalizeRole(user.role),
      status: user.Ativo ? 'Ativo' : 'Inativo',
      // Campos originais da API para referência
      originalData: user
    }));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateUser = async (userId, userData) => {
  try {
    // Mapear dados da interface para o formato da API
    const apiData = {
      ID: userId,
      userName: userData.name,
      role: userData.role.toLowerCase(), // API espera em lowercase
      NumCel: userData.phone.replace(/\D/g, '') // Remove formatação
    };

    const response = await apiClient.put('/users/update/Adm/Role', apiData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Se retorna 202, significa sucesso
    if (response.status === 202) {
      return { success: true };
    }
    
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateUserStatus = async (userId) => {
  try {
    const response = await apiClient.put(`/users/toogle/Status?user_id=${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Função para buscar todos os itens
export const fetchItems = async () => {
  try {
    const response = await apiClient.get('/item/all');
    return response.data.Itens;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};