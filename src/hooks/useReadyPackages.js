import { useState, useEffect, useCallback } from 'react';
import { fetchPackageItems, fetchItems } from '@/services/api';

// Função para inicializar o estado do localStorage de forma segura
const initializeFromStorage = (packageId) => {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(`C317_readyPackage_${packageId}`);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.warn("Erro ao ler localStorage:", error);
    return {};
  }
};

// Função para salvar no localStorage de forma segura
const saveToStorage = (packageId, data) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`C317_readyPackage_${packageId}`, JSON.stringify(data));
  } catch (error) {
    console.warn("Erro ao salvar no localStorage:", error);
  }
};

// Função para limpar o localStorage do pacote
const clearStorage = (packageId) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`C317_readyPackage_${packageId}`);
  } catch (error) {
    console.warn("Erro ao limpar localStorage:", error);
  }
};

// Função para validar data no formato yyyy-mm-dd
const isValidDate = (input) => {
  if (!input) return false;
  const [year, month, day] = input.split('-').map(Number);
  if (!year || !month || !day) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};

// Função para validar hora (hh:mm)
const isValidTime = (input) => {
  if (!input) return false;
  const [hh, mm] = input.split(':').map(Number);
  return (
    !isNaN(hh) && !isNaN(mm) &&
    hh >= 0 && hh <= 23 &&
    mm >= 0 && mm <= 59
  );
};

// Mapeamento das categorias para nomes amigáveis
const categoryMap = {
  alcoolicos: "Bebidas Alcoólicas",
  nao_alcoolicos: "Bebidas Não Alcoólicas",
  outras_bebidas: "Outras Bebidas",
  shots: "Shots",
  estrutura: "Estrutura",
  funcionarios: "Equipe"
};

// Ordem das categorias para exibição
const categoryOrder = [
  "alcoolicos", 
  "nao_alcoolicos", 
  "outras_bebidas",
  "shots", 
  "estrutura", 
  "funcionarios"
];

// Função para agrupar itens do pacote por categoria (usando categoria da API)
const groupPackageItems = (packageItems) => {
  const grouped = {};

  packageItems.forEach(pkgItem => {
    // A categoria agora vem da API
    const category = pkgItem.categoria || 'outros';

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push({
      id_item: pkgItem.id_item,
      nome: pkgItem.nome,
      quantidade: pkgItem.quantidade,
      categoria: category,
    });
  });

  // Organizar as categorias na ordem definida
  const sortedGrouped = {};
  
  // Primeiro, adiciona as categorias na ordem definida
  categoryOrder.forEach(catKey => {
    if (grouped[catKey] && grouped[catKey].length > 0) {
      sortedGrouped[catKey] = grouped[catKey];
    }
  });
  
  // Depois, adiciona qualquer categoria adicional que não esteja na ordem predefinida
  Object.keys(grouped).forEach(catKey => {
    if (!sortedGrouped[catKey] && grouped[catKey].length > 0) {
      sortedGrouped[catKey] = grouped[catKey];
    }
  });

  return sortedGrouped;
};

export const useReadyPackages = (packageInfo) => {
  const packageId = packageInfo?.id;
  const saved = packageId ? initializeFromStorage(packageId) : {};

  const [formData, setFormData] = useState({
    name: saved.formData?.name ?? "",
    date: saved.formData?.date ?? "",
    startTime: saved.formData?.startTime ?? "",
  });

  const [packageItems, setPackageItems] = useState([]);
  const [categorizedItems, setCategorizedItems] = useState({});
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState(null);

  // Salva no localStorage quando o formData muda
  useEffect(() => {
    if (!packageId) return;
    const toSave = { formData };
    saveToStorage(packageId, toSave);
  }, [formData, packageId]);

  // Função para carregar itens do pacote
  const loadPackageItems = useCallback(async (id) => {
    setLoadingItems(true);
    setItemsError(null);
    setPackageItems([]);
    setCategorizedItems({});
    
    try {
      const items = await fetchPackageItems(id);
      
      if (Array.isArray(items)) {
        console.log("Itens do pacote recebidos:", items);
        setPackageItems(items);
        
        // Agrupa os itens por categoria usando a categoria que vem da API
        const grouped = groupPackageItems(items);
        console.log("Itens categorizados:", grouped);
        setCategorizedItems(grouped);
      } else {
        console.error("fetchPackageItems não retornou um array:", items);
        setItemsError("Formato de dados inesperado.");
        setPackageItems([]);
        setCategorizedItems({});
      }
    } catch (error) {
      console.error('Erro ao carregar itens do pacote:', error);
      setItemsError(error.message);
      setPackageItems([]);
      setCategorizedItems({});
    } finally {
      setLoadingItems(false);
    }
  }, []);

  // Carrega os itens quando o packageInfo muda
  useEffect(() => {
    if (packageInfo?.id) {
      loadPackageItems(packageInfo.id);
    }
  }, [packageInfo?.id, loadPackageItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const { name, date, startTime } = formData;
    return (
      name.trim() !== '' &&
      isValidDate(date) &&
      isValidTime(startTime)
    );
  };

  const calcularHorarioFim = () => {
    if (!formData.startTime || !packageInfo?.hours) return '';
    const [h, m] = formData.startTime.split(':').map(Number);
    let totalMinutes = h * 60 + m + (packageInfo.hours * 60);
    let newHour = Math.floor(totalMinutes / 60) % 24;
    let newMinute = totalMinutes % 60;
    return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
  };

  const resetForm = () => {
    setFormData({ name: "", date: "", startTime: "" });
    setItemsError(null);
    if (packageId) clearStorage(packageId);
  };

  const clearData = () => {
    resetForm();
    setPackageItems([]);
    setCategorizedItems({});
  };

  return {
    formData,
    packageItems,
    categorizedItems,
    categoryMap,
    loadingItems,
    itemsError,
    handleInputChange,
    isFormValid,
    calcularHorarioFim,
    resetForm,
    clearData,
  };
};