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

const categoryMap = {
  alcoolicos: "Drinks Inclusos",
  nao_alcoolicos: "Bebidas Não Alcoólicas",
  outras_bebidas: "Outras Bebidas",
  shots: "Shots",
  estrutura: "Estrutura",
  funcionarios: "Equipe",
  outros: "Outros Itens"
};

const categoryOrder = [
  "alcoolicos", "nao_alcoolicos", "outras_bebidas",
  "shots", "estrutura", "funcionarios", "outros"
];

const groupPackageItems = (packageItems, allItems) => {
  const grouped = {};
  const allItemsMap = new Map(allItems.map(i => [i.item.ID, i.item]));

  packageItems.forEach(pkgItem => {
    const itemID = pkgItem.id_item || pkgItem.ID;
    const itemDetails = itemID ? allItemsMap.get(itemID) : null;

    let category = 'outros';
    let itemName = pkgItem.nome || `Item ID ${itemID || 'Desconhecido'}`;

    if (itemDetails) {
      category = itemDetails.Categoria || 'outros';
      itemName = itemDetails.Nome;
    } else if (pkgItem.nome) {
        const foundByName = allItems.find(i => i.item.Nome === pkgItem.nome);
        if (foundByName) {
            category = foundByName.item.Categoria || 'outros';
            itemName = foundByName.item.Nome;
        } else {
            console.warn(`Item '${itemName}' from package not found in all items list.`);
        }
    } else {
        console.warn(`Item ID ${itemID} from package not found and has no name.`);
    }

    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push({
      id_item: itemID,
      nome: itemName,
      quantidade: pkgItem.quantidade,
      categoria: category,
    });
  });

  const sortedGrouped = {};
  categoryOrder.forEach(catKey => {
    if (grouped[catKey]) {
      sortedGrouped[catKey] = grouped[catKey];
    }
  });
  Object.keys(grouped).forEach(catKey => {
      if (!sortedGrouped[catKey]) {
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
    startTime: saved.formData?.startTime ?? "", // <-- MODIFICADO AQUI
  });

  const [packageItems, setPackageItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categorizedItems, setCategorizedItems] = useState({});
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState(null);

  useEffect(() => {
    if (!packageId) return;
    const toSave = { formData };
    saveToStorage(packageId, toSave);
  }, [formData, packageId]);

  useEffect(() => {
    fetchItems()
      .then(setAllItems)
      .catch(err => {
        console.error("Erro ao carregar todos os itens:", err);
        setItemsError("Não foi possível carregar detalhes dos itens.");
      });
  }, []);

  const loadPackageItems = useCallback(async (id) => {
    setLoadingItems(true);
    setItemsError(null);
    setPackageItems([]);
    setCategorizedItems({});
    try {
      const items = await fetchPackageItems(id);
      if (Array.isArray(items)) {
          setPackageItems(items);
      } else {
          console.error("fetchPackageItems não retornou um array:", items);
          setItemsError("Formato de dados inesperado.");
          setPackageItems([]);
      }
    } catch (error) {
      console.error('Erro ao carregar itens do pacote:', error);
      setItemsError(error.message);
      setPackageItems([]);
    } finally {
      setLoadingItems(false);
    }
  }, []);

  useEffect(() => {
    if (packageInfo?.id) {
      loadPackageItems(packageInfo.id);
    }
  }, [packageInfo?.id, loadPackageItems]);

  useEffect(() => {
    if (packageItems.length > 0) {
      if (allItems.length > 0) {
        setCategorizedItems(groupPackageItems(packageItems, allItems));
      } else {
        setCategorizedItems({ outros: packageItems.map(item => ({ ...item, categoria: 'outros' })) });
      }
    } else {
      setCategorizedItems({});
    }
  }, [packageItems, allItems]);

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
    setFormData({ name: "", date: "", startTime: "" }); // <-- MODIFICADO AQUI
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