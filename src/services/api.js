import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8002';

// Cria uma instância do Axios
const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Função auxiliar para extrair mensagens de erro
const getErrorMessage = (error) => {
  if (error.response) {
    console.error('Erro de resposta da API:', error.response.data);
    // Tenta pegar 'detail' (comum no FastAPI) ou 'message'
    const detail = error.response.data?.detail;
    const message = error.response.data?.message;
    // FastAPI pode retornar uma string diretamente em 'detail' para erros HTTP
    if (typeof detail === 'string') {
      return detail;
    }
    // Se 'detail' for um array (erros de validação Pydantic), formata
    if (Array.isArray(detail)) {
      try {
        return detail.map(err => `${err.loc[1]}: ${err.msg}`).join('; ');
      } catch {
        // Fallback se a estrutura não for a esperada
      }
    }
    return message || detail || error.response.statusText || `Erro ${error.response.status}`;
  } else if (error.request) {
    console.error('Erro de requisição (sem resposta):', error.request);
    return 'Não foi possível conectar à API. Verifique sua conexão ou a URL da API.';
  } else {
    console.error('Erro na configuração da requisição Axios:', error.message);
    return error.message || 'Ocorreu um erro desconhecido ao preparar a requisição.';
  }
};


// Função para Login (/auth/token) - Envia como FormData
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
    if (!response.data.access_token) {
      console.warn("Resposta da API de login não continha 'access_token'. Resposta:", response.data);
    }
    return response.data;
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