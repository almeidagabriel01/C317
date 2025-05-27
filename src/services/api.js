import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Interceptor para adicionar Bearer token em todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token adicionado à requisição:", config.url);
    } else {
      console.warn("Token não encontrado para requisição:", config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    return (
      error.response.data.detail ||
      error.response.data.message ||
      error.response.statusText ||
      `Erro ${error.response.status}`
    );
  } else if (error.request) {
    return 'Não foi possível conectar à API. Verifique sua conexão.';
  } else {
    return error.message || 'Ocorreu um erro desconhecido.';
  }
};

const normalizeRole = (role) => {
  if (!role) return 'Cliente';
  const lower = role.toLowerCase();
  if (lower === 'Administrador') return 'Administrador';
  if (lower === 'cliente') return 'Cliente';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

export const loginUser = async (email, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await apiClient.post('/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!response.data.access_token) {
      throw new Error('Token de acesso não recebido da API.');
    }
    if (!response.data.user) {
      throw new Error('Dados do usuário não recebidos da API.');
    }

    const normalizedUser = {
      ...response.data.user,
      role: normalizeRole(response.data.user.role),
    };

    return {
      ...response.data,
      user: normalizedUser,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/users/create/', userData);
    return response.status;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/users/all');
    return response.data.map(user => ({
      id: user.ID,
      name: user.userName,
      email: user.Email,
      phone: (() => {
        const d = user.NumCel.replace(/\D/g, '');
        if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
        if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
        return user.NumCel;
      })(),
      role: normalizeRole(user.role),
      status: user.Ativo ? 'Ativo' : 'Inativo',
      originalData: user,
    }));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const apiData = {
      ID: userId,
      userName: userData.name,
      role: userData.role.toLowerCase(),
      NumCel: userData.phone.replace(/\D/g, ''),
    };
    const response = await apiClient.put('/users/update/Adm/Role', apiData);
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

export const fetchItems = async () => {
  try {
    const response = await apiClient.get('/item/all');
    return response.data.Itens;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const fetchItemsForAdmin = async () => {
  try {
    const response = await apiClient.get('/item/all');
    return response.data.Itens.map(itemData => ({
      id: itemData.item.ID,
      name: itemData.item.Descricao, // Backend não tem nome separado, usando descrição
      description: itemData.item.Descricao,
      category: itemData.item.Categoria,
      price: itemData.item.Preco,
      status: itemData.item.Ativo ? 'Ativo' : 'Inativo',
      image: itemData.imageURL,
      originalData: itemData.item,
    }));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createItem = async (itemData) => {
  try {
    const formData = new FormData();
    formData.append('Nome', itemData.name);
    formData.append('Descricao', itemData.description);
    formData.append('Categoria', itemData.category);
    formData.append('Preco', Math.round(itemData.price * 100)); // Converter para centavos
    formData.append('Ativo', itemData.status === 'Ativo');
    if (itemData.image) {
      formData.append('image', itemData.image);
    }

    const response = await apiClient.post('/item/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateItem = async (itemId, itemData) => {
  try {
    const formData = new FormData();
    formData.append('Nome', itemData.name);
    formData.append('Descricao', itemData.description);
    formData.append('Categoria', itemData.category);
    formData.append('Preco', Math.round(itemData.price * 100)); // Converter para centavos
    if (itemData.image && typeof itemData.image !== 'string') {
      formData.append('image', itemData.image);
    }

    const response = await apiClient.put(`/item/update/${itemId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const toggleItemStatus = async (itemId) => {
  try {
    const response = await apiClient.put(`/item/toggle/status/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Nova função para calcular preço dos itens selecionados
export const calculateOrderPrice = async (itens) => {
  try {
    const response = await apiClient.post('/pedido/get/price', itens);
    return response.data.Preço || response.data["Preço"] || response.data.total_price || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createPedido = async (payload) => {
  try {
    const response = await apiClient.post('/pedido/create/', payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * MOCK: Simula fetchCurrentUser antes de existir no backend.
 * Retorna os dados completos que foram salvos em localStorage no login.
 */
export const fetchCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    try {
      const stored = localStorage.getItem('userData');
      if (stored) {
        resolve(JSON.parse(stored));
      } else {
        reject(new Error('Dados de usuário não encontrados (mock).'));
      }
    } catch (err) {
      reject(err);
    }
  });
};