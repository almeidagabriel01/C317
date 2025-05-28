import { useState, useEffect, useRef } from "react";
import { fetchItems, calculateOrderPrice } from "@/services/api";

export function groupItemsByCategory(items) {
  const cat = {
    alcoolicos: [],
    nao_alcoolicos: [],
    outras_bebidas: [],
    shots: [],
    estrutura: [],
    funcionarios: [],
  };
  items.forEach((item) => {
    const c = item.item.Categoria;
    if (cat[c]) cat[c].push(item);
  });
  return cat;
}

// Função para inicializar o estado do localStorage de forma segura
const initializeFromStorage = () => {
  if (typeof window === "undefined") return {};

  try {
    const saved = localStorage.getItem("C317_eventFlow");
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.warn("Erro ao ler localStorage:", error);
    return {};
  }
};

// Função para salvar no localStorage de forma segura
const saveToStorage = (data) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("C317_eventFlow", JSON.stringify(data));
  } catch (error) {
    console.warn("Erro ao salvar no localStorage:", error);
  }
};

// Cache global simples para evitar chamadas duplicadas
let itemsCache = {
  data: null,
  loading: false,
  error: null,
  timestamp: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useEventCustomizationFlow(STEPS, toast) {
  const saved = initializeFromStorage();
  const mountedRef = useRef(true);
  const fetchedRef = useRef(false); // Ref para controlar se já fez fetch

  const [currentStep, setCurrentStep] = useState(saved.currentStep ?? 0);
  const [animatedStep, setAnimatedStep] = useState(saved.currentStep ?? 0);
  const [direction, setDirection] = useState(1);

  const [selectedEventType, setSelectedEventType] = useState(saved.selectedEventType ?? "");
  const [formData, setFormData] = useState({
    name: saved.formData?.name ?? "",
    date: saved.formData?.date ?? "",
    startTime: saved.formData?.startTime ?? "",
    guestCount: saved.formData?.guestCount ?? "",
    eventDuration: saved.formData?.eventDuration ?? ""
  });
  const [selectedDrinks, setSelectedDrinks] = useState(saved.selectedDrinks ?? []);
  const [selectedNonAlcoholicDrinks, setSelectedNonAlcoholicDrinks] = useState(saved.selectedNonAlcoholicDrinks ?? []);
  const [beverageQuantities, setBeverageQuantities] = useState(saved.beverageQuantities ?? {});
  const [shotQuantities, setShotQuantities] = useState(saved.shotQuantities ?? {});
  const [selectedStructure, setSelectedStructure] = useState(saved.selectedStructure ?? null);
  const [staffQuantities, setStaffQuantities] = useState(saved.staffQuantities ?? {});

  const [items, setItems] = useState([]);
  const [categorizedItems, setCategorizedItems] = useState({
    alcoolicos: [], nao_alcoolicos: [], outras_bebidas: [],
    shots: [], estrutura: [], funcionarios: []
  });
  const [loading, setLoading] = useState(true);
  const [backendPrice, setBackendPrice] = useState(NaN);
  const [calculatingPrice, setCalculatingPrice] = useState(false);

  // Effect para salvar no localStorage sempre que o estado mudar
  useEffect(() => {
    const toSave = {
      currentStep,
      selectedEventType,
      formData,
      selectedDrinks,
      selectedNonAlcoholicDrinks,
      beverageQuantities,
      shotQuantities,
      selectedStructure,
      staffQuantities
    };
    saveToStorage(toSave);
  }, [
    currentStep, selectedEventType, formData, selectedDrinks,
    selectedNonAlcoholicDrinks, beverageQuantities, shotQuantities,
    selectedStructure, staffQuantities
  ]);

  // Effect para carregar itens da API (com cache e controle de duplicação)
  useEffect(() => {
    // Se já fez fetch ou está carregando, não faz novamente
    if (fetchedRef.current || itemsCache.loading) {
      if (itemsCache.data) {
        setItems(itemsCache.data);
        setCategorizedItems(groupItemsByCategory(itemsCache.data));
        setLoading(false);
      }
      return;
    }

    // Se tem cache válido, usa ele
    if (itemsCache.data && itemsCache.timestamp && 
        (Date.now() - itemsCache.timestamp) < CACHE_DURATION) {
      setItems(itemsCache.data);
      setCategorizedItems(groupItemsByCategory(itemsCache.data));
      setLoading(false);
      fetchedRef.current = true;
      return;
    }

    // Marca como já tentou fazer fetch
    fetchedRef.current = true;
    itemsCache.loading = true;

    fetchItems()
      .then((data) => {
        if (mountedRef.current) {
          // Atualiza cache
          itemsCache.data = data;
          itemsCache.timestamp = Date.now();
          itemsCache.loading = false;
          itemsCache.error = null;

          // Atualiza estado
          setItems(data);
          setCategorizedItems(groupItemsByCategory(data));
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar itens:", error);
        if (mountedRef.current) {
          itemsCache.loading = false;
          itemsCache.error = error.message;
          if (toast) {
            toast.error("Erro ao carregar itens do catálogo");
          }
        }
      })
      .finally(() => {
        if (mountedRef.current) {
          setLoading(false);
        }
      });
  }, []); // Dependências vazias para rodar apenas uma vez

  // Cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Função para calcular o preço no backend
  const calculateBackendPrice = async (itens) => {
    if (!itens || itens.length === 0) {
      setBackendPrice(NaN);
      return NaN;
    }
    setCalculatingPrice(true);
    try {
      const price = await calculateOrderPrice(itens);
      const validPrice = typeof price === 'number' && !isNaN(price) ? price : NaN;
      setBackendPrice(validPrice);
      return validPrice;
    } catch (error) {
      console.error("Erro ao calcular preço:", error);
      if (toast) {
        toast.error("Erro ao calcular preço do pedido");
      }
      setBackendPrice(NaN);
      return NaN;
    } finally {
      setCalculatingPrice(false);
    }
  };

  // Função de validação do formulário
  function isFormValid() {
    const { name, date, startTime, guestCount, eventDuration } = formData;
    const dateOk = date && /^\d{4}-\d{2}-\d{2}$/.test(date);
    const timeOk = startTime && /^\d{2}:\d{2}$/.test(startTime);
    // Permite que a duração seja vazia ou "00:00" inicialmente, mas valida se preenchida
    const durationOk = eventDuration && /^\d{2}:\d{2}$/.test(eventDuration) && eventDuration !== "00:00";

    return (
      name.trim() !== "" &&
      dateOk &&
      timeOk &&
      guestCount.trim() !== "" &&
      durationOk
    );
  }

  // Função para validar cada step
  function isStepValid(step) {
    switch (step) {
      case 0: return !!selectedEventType;
      case 1: return isFormValid();
      case 2: return selectedDrinks.length > 0;
      case 3: return selectedNonAlcoholicDrinks.length > 0;
      case 4: return Object.values(beverageQuantities).some(q => q > 0);
      case 5: return Object.values(shotQuantities).some(q => q > 0);
      case 6: return !!selectedStructure;
      case 7: return Object.values(staffQuantities).some(q => q > 0);
      default: return true;
    }
  }

  // Função para verificar se todos os steps anteriores são válidos
  function areAllPreviousStepsValid(to) {
    for (let i = 0; i < to; i++) {
      if (!isStepValid(i)) return false;
    }
    return true;
  }

  // Função para animar mudança de step
  function animateStepChange(from, to, onDone) {
    if (from === to) return;
    let step = from;
    const stepForward = to > from ? 1 : -1;
    const animateNext = () => {
      step += stepForward;
      setAnimatedStep(step);
      if (step !== to) {
        setTimeout(animateNext, 220);
      } else {
        setTimeout(() => {
          setCurrentStep(to);
          if (onDone) onDone();
        }, 180);
      }
    };
    animateNext();
  }

  // Função para gerar os itens do pedido
  const generateOrderItems = () => {
    const itemsList = [
      ...selectedDrinks.map((d) => {
        const f = items.find((i) => i.item.Descricao === d);
        return f && { ID: f.item.ID, quantidade: 1 };
      }).filter(Boolean),
      ...selectedNonAlcoholicDrinks.map((d) => {
        const f = items.find((i) => i.item.Descricao === d);
        return f && { ID: f.item.ID, quantidade: 1 };
      }).filter(Boolean),
      ...Object.entries(beverageQuantities)
        .filter(([, q]) => q > 0)
        .map(([id, q]) => ({ ID: Number(id), quantidade: q })),
      ...Object.entries(shotQuantities)
        .filter(([, q]) => q > 0)
        .map(([id, q]) => ({ ID: Number(id), quantidade: q })),
      ...Object.entries(staffQuantities)
        .filter(([, q]) => q > 0)
        .map(([id, q]) => ({ ID: Number(id), quantidade: q })),
      ...(selectedStructure ? [{ ID: selectedStructure, quantidade: 1 }] : []),
    ];
    return itemsList;
  };

  // Função para avançar para o próximo step
  function handleNext() {
    if (!isStepValid(currentStep)) {
      if (toast) {
        toast.error("Preencha este passo antes de avançar!");
      }
      return;
    }
    if (currentStep === 7) {
      const itens = generateOrderItems();
      calculateBackendPrice(itens);
    }
    if (currentStep < STEPS.length) {
      setDirection(1);
      animateStepChange(currentStep, currentStep + 1);
    }
  }

  // Função para voltar ao step anterior
  function handleBack() {
    if (currentStep > 0) {
      setDirection(-1);
      animateStepChange(currentStep, currentStep - 1);
    }
  }

  // Função para lidar com seleção de evento
  const handleEventSelection = (type) => {
    setSelectedEventType(type);
    setDirection(1);
    animateStepChange(currentStep, currentStep + 1);
  };

  // Função para lidar com mudança de input
  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Funções para toggle de drinks
  const toggleDrink = (d) =>
    setSelectedDrinks((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  const toggleNonAlcoholicDrink = (d) =>
    setSelectedNonAlcoholicDrinks((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  // Funções para definir quantidades
  const setBeverageQty = (id, q) =>
    setBeverageQuantities((prev) => ({ ...prev, [id]: q }));
  const setShotQty = (id, q) =>
    setShotQuantities((prev) => ({ ...prev, [id]: q }));
  const setStaffQty = (id, q) =>
    setStaffQuantities((prev) => ({ ...prev, [id]: q }));

  return {
    currentStep, setCurrentStep,
    animatedStep, setAnimatedStep,
    direction, setDirection,
    animateStepChange,
    handleNext, handleBack,
    isStepValid, isFormValid, areAllPreviousStepsValid,
    selectedEventType, setSelectedEventType,
    formData, setFormData, handleInputChange,
    selectedDrinks, toggleDrink,
    selectedNonAlcoholicDrinks, toggleNonAlcoholicDrink,
    beverageQuantities, setBeverageQty,
    shotQuantities, setShotQty,
    selectedStructure, setSelectedStructure,
    staffQuantities, setStaffQty,
    items, categorizedItems, loading, handleEventSelection,
    backendPrice, calculatingPrice, generateOrderItems,
  };
}