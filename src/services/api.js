import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  allowCredentials: true,
});

// Interceptor para adicionar Bearer token em todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("Token não encontrado para requisição:", config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { apiClient };

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
  if (lower === 'administrador') return 'Administrador';
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

// Nova função para buscar dados do usuário logado
export const fetchCurrentUser = async () => {
  try {
    const response = await apiClient.get('/users/get/me');
    return {
      id: response.data.ID,
      nome: response.data.userName,
      email: response.data.Email,
      role: normalizeRole(response.data.role),
      celular: response.data.NumCel,
      ativo: response.data.Ativo,
      originalData: response.data,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Função para buscar pedidos do usuário logado - REMOVIDO CACHE ESPECÍFICO
export const fetchUserOrders = async () => {
  try {
    const response = await apiClient.get('/pedido/all');

    const data = response.data.map(pedido => ({
      id: pedido.ID,
      nomeEvento: pedido.Nome_Evento,
      dataEvento: pedido.Data_Evento,
      dataCompra: pedido.Data_Compra,
      horarioInicio: pedido.Horario_Inicio,
      horarioFim: pedido.Horario_Fim,
      numConvidados: pedido.Num_Convidado,
      preco: pedido.Preço,
      status: pedido.Status,
      ativo: pedido.Ativo,
      idComprador: pedido.ID_Comprador,
      originalData: pedido,
    }));

    return data;

  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Função para atualizar o status de um pedido
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await apiClient.put('/pedido/set/status', null, {
      params: {
        id: orderId,
        Status: status
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/users/all');
    return response.data.map(user => ({
      id: user.ID,
      name: user.nome || user.userName,
      email: user.Email,
      phone: (() => {
        const d = user.NumCel.replace(/\D/g, '');
        if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
        if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
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

/**
 * Atualiza perfil de Cliente
 * @param {{ ID: number, userName: string, NumCel: string }} payload
 */
export const updateUserProfile = async (payload) => {
  try {
    const response = await apiClient.put('/users/update/', payload);
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

// Função auxiliar para adicionar cache buster apenas quando necessário
const addCacheBusterToImage = (imageUrl, forceRefresh = false) => {
  if (!imageUrl) return null;

  // Se forceRefresh for true, sempre adiciona novo timestamp
  if (forceRefresh) {
    const baseUrl = imageUrl.split('?')[0]; // Remove parâmetros existentes
    return `${baseUrl}?t=${Date.now()}`;
  }

  // Se já tem cache buster, mantém
  if (imageUrl.includes('?t=')) {
    return imageUrl;
  }

  // Adiciona cache buster inicial
  return `${imageUrl}?t=${Date.now()}`;
};

export const fetchItemsForAdmin = async (forceImageRefresh = false) => {
  try {
    const response = await apiClient.get('/item/all');
    return response.data.Itens.map(itemData => ({
      id: itemData.item.ID,
      name: itemData.item.Nome,
      description: itemData.item.Descricao,
      category: itemData.item.Categoria,
      price: itemData.item.Preco,
      status: itemData.item.Ativo ? 'Ativo' : 'Inativo',
      image: addCacheBusterToImage(itemData.imageURL, forceImageRefresh),
      originalData: itemData.item,
    }));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Função específica para refresh após update de item
export const refreshItemsAfterUpdate = async () => {
  return fetchItemsForAdmin(true); // Force refresh das imagens
};

export const createItem = async (itemData) => {
  try {
    const formData = new FormData();
    formData.append('Nome', itemData.name);
    formData.append('Descricao', itemData.description);
    formData.append('Categoria', itemData.category);
    formData.append('Preco', itemData.price);
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
    formData.append('id', itemId);
    formData.append('Nome', itemData.name);
    formData.append('Descricao', itemData.description);
    formData.append('Categoria', itemData.category);
    formData.append('Preco', itemData.price);
    formData.append('Ativo', true);
    if (itemData.image && typeof itemData.image !== 'string') {
      formData.append('image', itemData.image);
    }

    const response = await apiClient.put('/item/update/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const toggleItemStatus = async (itemId) => {
  try {
    const response = await apiClient.put('/item/toogle/Status', null, {
      params: { item_id: itemId }
    });
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

// Função para criar pedido customizado (sem campo de endereço)
export const createPedido = async (payload) => {
  try {
    // Remove o campo eventAddress se existir no payload
    if (payload.pedido && payload.pedido.eventAddress) {
      delete payload.pedido.eventAddress;
    }

    const response = await apiClient.post('/pedido/create/', payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Função para buscar itens de um pacote pronto
export const fetchPackageItems = async (packageId) => {
  try {
    const response = await apiClient.get('/pedido/packages/all', {
      params: { id: packageId }
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Função para criar pedido a partir de pacote pronto
export const createPackageOrder = async (payload) => {
  try {
    const response = await apiClient.post('/pedido/create/packages/', payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};