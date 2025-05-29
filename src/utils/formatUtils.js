/**
 * Formata uma data para o padrão brasileiro (DD/MM/AAAA)
 * @param {string} dateString - Data em formato ISO ou qualquer formato válido
 * @returns {string} Data formatada (DD/MM/AAAA)
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
};

/**
 * Formata uma data com horário completo
 * @param {string} dateString - Data em formato ISO
 * @returns {string} Data formatada com horário (DD de mês de AAAA às HH:MM)
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

/**
 * Converte data de DD/MM/AAAA para AAAA-MM-DD
 * @param {string} dateStr - Data no formato DD/MM/AAAA
 * @returns {string} Data no formato AAAA-MM-DD
 */
export const formatDateToYYYYMMDD = (dateStr) => {
  if (!dateStr) return '';

  // Aceita "dd/mm/yyyy"
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Aceita "yyyy-mm-dd" (já está no formato correto)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Aceita "yyyy/mm/dd"
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  return dateStr;
};

/**
 * Converte data de AAAA-MM-DD para DD/MM/AAAA
 * @param {string} dateStr - Data no formato AAAA-MM-DD
 * @returns {string} Data no formato DD/MM/AAAA
 */
export const formatDateToDDMMYYYY = (dateStr) => {
  if (!dateStr) return '';

  // Aceita "yyyy-mm-dd"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }

  // Se já está em DD/MM/AAAA, retorna como está
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return dateStr;
  }

  return dateStr;
};

/**
 * Formata um valor monetário para o padrão brasileiro
 * @param {number|string} value - Valor numérico
 * @returns {string} Valor formatado em BRL
 */
export const formatCurrency = (value) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (typeof numValue !== 'number' || isNaN(numValue)) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue);
};

/**
 * Formata um número de telefone brasileiro já formatado (display)
 * @param {string} phone - Número de telefone
 * @returns {string} Telefone formatado para exibição
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
};

/**
 * Formata um número de telefone conforme o usuário digita (input em tempo real)
 * @param {string} value - Valor atual do input
 * @returns {string} Valor formatado progressivamente
 */
export const formatPhoneInput = (value) => {
  // Remove todos os caracteres não numéricos
  let digits = value.replace(/\D/g, '');

  // Não permite mais que 11 dígitos (máximo para celular no Brasil)
  if (digits.length > 11) digits = digits.slice(0, 11);

  if (digits.length === 0) return '';

  // Formata progressivamente conforme digita
  if (digits.length <= 2) {
    // Apenas DDD ou parte dele
    return digits.length === 0 ? '' : `(${digits}`;
  } else if (digits.length <= 7) {
    // DDD + parte do número com espaço após o parêntese
    return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
  } else {
    // Número completo com hífen e espaço após o parêntese
    const hasDDI = digits.length > 10;
    const baseIndex = 2; // Posição após o DDD
    const hyphenIndex = hasDDI ? 7 : 6; // Posição do hífen (5 ou 4 dígitos antes)

    return `(${digits.substring(0, 2)}) ${digits.substring(baseIndex, hyphenIndex)}-${digits.substring(hyphenIndex)}`;
  }
};

/**
 * Remove formatação do telefone, retornando apenas números
 * @param {string} phone - Telefone formatado
 * @returns {string} Apenas os dígitos do telefone
 */
export const unformatPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

/**
 * Retorna a cor do status baseado no valor (para pedidos/orçamentos)
 * @param {string} status - Status do pedido
 * @returns {string} Classe CSS para a cor
 */
export const getStatusColor = (status) => {
  if (!status) return "bg-gray-500";
  switch (status.toLowerCase()) {
    case "pendente":
      return "bg-orange-500";
    case "aprovado":
      return "bg-green-500";
    case "pagamento":
      return "bg-lime-600";
    case "concluido":
      return "bg-purple-500";
    case "reprovado":
      return "bg-red-500";
    case "orcado":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

/**
 * Retorna classes CSS para status de usuário
 * @param {string} status - Status do usuário (Ativo/Inativo)
 * @returns {string} Classes CSS para o status
 */
export const getUserStatusColor = (status) => {
  if (!status) return 'bg-gray-900 text-gray-300';

  switch (status.toLowerCase()) {
    case 'ativo':
      return 'bg-green-900 text-green-300';
    case 'inativo':
      return 'bg-red-900 text-red-300';
    default:
      return 'bg-gray-900 text-gray-300';
  }
};

/**
 * Trunca um texto se for muito longo
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Capitaliza a primeira letra de cada palavra
 * @param {string} text - Texto para capitalizar
 * @returns {string} Texto capitalizado
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Normaliza o papel/role do usuário
 * @param {string} role - Role do usuário
 * @returns {string} Role normalizado
 */
export const normalizeRole = (role) => {
  if (!role) return 'Cliente';
  const lower = role.toLowerCase();
  if (lower === 'administrador') return 'Administrador';
  if (lower === 'cliente') return 'Cliente';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

/**
 * Formata um ID com padding de zeros à esquerda
 * @param {number|string} id - ID para formatar
 * @param {number} length - Comprimento total desejado
 * @returns {string} ID formatado
 */
export const formatId = (id, length = 4) => {
  if (!id) return '';
  return String(id).padStart(length, '0');
};

/**
 * Valida formato de email
 * @param {string} email - Email para validar
 * @returns {boolean} Se o email é válido
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida formato de telefone brasileiro
 * @param {string} phone - Telefone para validar
 * @returns {boolean} Se o telefone é válido
 */
export const isValidPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
};

/**
 * Formata preço unitário (centavos para reais)
 * @param {number} centavos - Valor em centavos
 * @returns {number} Valor em reais
 */
export const centavosToReais = (centavos) => {
  return centavos / 100;
};

/**
 * Formata preço unitário (reais para centavos)
 * @param {number} reais - Valor em reais
 * @returns {number} Valor em centavos
 */
export const reaisToCentavos = (reais) => {
  return Math.round(reais * 100);
};

/**
 * Formata um número para exibição, adicionando separador de milhar se necessário
 * @param {number|string} num - Número a ser formatado
 * @returns {string} Número formatado
 */

export const formatNumber = (num) => {
  const numericValue = typeof num === 'number' ? num : parseInt(num) || 0;

  if (numericValue >= 1000) {
    return new Intl.NumberFormat('pt-BR').format(numericValue);
  }

  return numericValue.toString();
};