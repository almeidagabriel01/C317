import { useState, useEffect } from 'react';

/**
 * Utilitário para ordenação de tabelas
 * Estados de ordenação: null (original), 'asc' (crescente), 'desc' (decrescente)
 */

/**
 * Tipos de dados para ordenação
 */
export const SORT_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  DATE: 'date',
  CURRENCY: 'currency',
  STATUS: 'status'
};

/**
 * Direções de ordenação
 */
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
  NONE: null
};

/**
 * Converte valor para número (para preços em centavos ou valores monetários)
 * @param {*} value - Valor a ser convertido
 * @returns {number} - Valor numérico
 */
const parseNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove formatação monetária e converte
    const cleaned = value.replace(/[R$\s.,]/g, '');
    return parseFloat(cleaned) || 0;
  }
  return 0;
};

/**
 * Converte valor para data
 * @param {*} value - Valor a ser convertido
 * @returns {Date} - Objeto Date
 */
const parseDate = (value) => {
  if (!value) return new Date(0);
  if (value instanceof Date) return value;
  return new Date(value);
};

/**
 * Normaliza string para comparação
 * @param {*} value - Valor a ser normalizado
 * @returns {string} - String normalizada
 */
const normalizeString = (value) => {
  if (!value) return '';
  return String(value).toLowerCase().trim();
};

/**
 * Define ordem de prioridade para status
 * @param {string} status - Status a ser ordenado
 * @returns {number} - Valor numérico para ordenação
 */
const getStatusPriority = (status) => {
  const statusOrder = {
    // Para pedidos
    'pendente': 1,
    'aprovado': 2,
    'pagamento': 3,
    'concluido': 4,
    'reprovado': 5,
    'orcado': 0,
    // Para usuários/itens
    'ativo': 1,
    'inativo': 2
  };
  
  return statusOrder[normalizeString(status)] || 999;
};

/**
 * Compara dois valores baseado no tipo
 * @param {*} a - Primeiro valor
 * @param {*} b - Segundo valor
 * @param {string} type - Tipo de dados
 * @param {string} direction - Direção da ordenação
 * @returns {number} - Resultado da comparação
 */
const compareValues = (a, b, type, direction) => {
  let result = 0;

  switch (type) {
    case SORT_TYPES.NUMBER:
    case SORT_TYPES.CURRENCY:
      result = parseNumber(a) - parseNumber(b);
      break;

    case SORT_TYPES.DATE:
      result = parseDate(a) - parseDate(b);
      break;

    case SORT_TYPES.STATUS:
      result = getStatusPriority(a) - getStatusPriority(b);
      break;

    case SORT_TYPES.STRING:
    default:
      const strA = normalizeString(a);
      const strB = normalizeString(b);
      result = strA.localeCompare(strB, 'pt-BR');
      break;
  }

  return direction === SORT_DIRECTIONS.DESC ? -result : result;
};

/**
 * Ordena um array de objetos
 * @param {Array} data - Array de dados
 * @param {string} field - Campo para ordenação
 * @param {string} direction - Direção da ordenação
 * @param {string} type - Tipo de dados
 * @returns {Array} - Array ordenado
 */
export const sortData = (data, field, direction, type = SORT_TYPES.STRING) => {
  if (!data || !Array.isArray(data) || !field || !direction) {
    return data;
  }

  return [...data].sort((a, b) => {
    // Acessa o campo usando notação de ponto (ex: 'user.name')
    const valueA = getNestedValue(a, field);
    const valueB = getNestedValue(b, field);

    return compareValues(valueA, valueB, type, direction);
  });
};

/**
 * Obtém valor aninhado de um objeto usando notação de ponto
 * Também tenta campos alternativos para compatibilidade
 * @param {Object} obj - Objeto
 * @param {string} path - Caminho do campo (ex: 'user.name')
 * @returns {*} - Valor do campo
 */
const getNestedValue = (obj, path) => {
  // Primeiro tenta o campo exato
  let value = path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);

  // Se não encontrou, tenta campos alternativos
  if (value === null || value === undefined || value === '') {
    const alternatives = getFieldAlternatives(path);
    for (const altPath of alternatives) {
      value = altPath.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
      }, obj);
      
      if (value !== null && value !== undefined && value !== '') {
        break;
      }
    }
  }

  return value || '';
};

/**
 * Retorna campos alternativos para compatibilidade
 * @param {string} field - Campo principal
 * @returns {Array} - Array de campos alternativos
 */
const getFieldAlternatives = (field) => {
  const alternatives = {
    'customerName': ['nomeEvento', 'customer_name', 'nome'],
    'nomeEvento': ['customerName', 'customer_name', 'nome'],
    'date': ['dataCompra', 'data_compra', 'created_at'],
    'dataCompra': ['date', 'data_compra', 'created_at'],
    'total': ['preco', 'price', 'valor'],
    'preco': ['total', 'price', 'valor'],
    'price': ['preco', 'total', 'valor']
  };

  return alternatives[field] || [];
};

/**
 * Próximo estado de ordenação
 * @param {string|null} currentSort - Estado atual da ordenação
 * @returns {string|null} - Próximo estado
 */
export const getNextSortDirection = (currentSort) => {
  switch (currentSort) {
    case null:
      return SORT_DIRECTIONS.ASC;
    case SORT_DIRECTIONS.ASC:
      return SORT_DIRECTIONS.DESC;
    case SORT_DIRECTIONS.DESC:
      return SORT_DIRECTIONS.NONE;
    default:
      return SORT_DIRECTIONS.ASC;
  }
};

/**
 * Hook personalizado para gerenciar estado de ordenação
 * @param {Array} initialData - Dados iniciais
 * @returns {Object} - Estado e funções de ordenação
 */
export const useSorting = (initialData = []) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [originalData, setOriginalData] = useState(initialData);

  // Atualiza dados originais quando initialData muda
  useEffect(() => {
    setOriginalData(initialData);
  }, [initialData]);

  /**
   * Aplica ordenação aos dados
   * @param {string} field - Campo para ordenação
   * @param {string} type - Tipo de dados
   */
  const handleSort = (field, type = SORT_TYPES.STRING) => {
    const nextDirection = field === sortField 
      ? getNextSortDirection(sortDirection) 
      : SORT_DIRECTIONS.ASC;

    setSortField(nextDirection ? field : null);
    setSortDirection(nextDirection);
  };

  /**
   * Reseta ordenação para estado original
   */
  const resetSort = () => {
    setSortField(null);
    setSortDirection(null);
  };

  /**
   * Obtém dados ordenados
   */
  const getSortedData = () => {
    if (!sortField || !sortDirection) {
      return originalData;
    }

    return sortData(originalData, sortField, sortDirection, getSortType(sortField));
  };

  /**
   * Obtém ícone de ordenação para uma coluna
   * @param {string} field - Campo da coluna
   * @returns {string} - Nome do ícone
   */
  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === SORT_DIRECTIONS.ASC ? 'asc' : 'desc';
  };

  return {
    sortField,
    sortDirection,
    handleSort,
    resetSort,
    getSortedData,
    getSortIcon,
    isSorted: sortField !== null
  };
};

/**
 * Determina o tipo de ordenação baseado no campo
 * @param {string} field - Nome do campo
 * @returns {string} - Tipo de ordenação
 */
const getSortType = (field) => {
  const fieldLower = field.toLowerCase();
  
  if (fieldLower.includes('price') || fieldLower.includes('total') || fieldLower.includes('preco')) {
    return SORT_TYPES.CURRENCY;
  }
  if (fieldLower.includes('date') || fieldLower.includes('data')) {
    return SORT_TYPES.DATE;
  }
  if (fieldLower.includes('status')) {
    return SORT_TYPES.STATUS;
  }
  if (fieldLower.includes('id') || fieldLower.includes('phone') || fieldLower.includes('telefone')) {
    return SORT_TYPES.NUMBER;
  }
  
  return SORT_TYPES.STRING;
};