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

// Cache global para itens com controle de uma única requisição
let globalItemsCache = {
  data: null,
  loading: false,
  error: null,
  timestamp: null,
  promise: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useEventCustomizationFlow(STEPS, toast) {
  const saved = initializeFromStorage();
  const mountedRef = useRef(true);
  const hasInitialized = useRef(false);

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

  // Effect para salvar no localStorage apenas quando necessário
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
    
    // Só salva se realmente mudou
    const currentSaved = initializeFromStorage();
    if (JSON.stringify(currentSaved) !== JSON.stringify(toSave)) {
      saveToStorage(toSave);
    }
  }, [
    currentStep, selectedEventType, formData, selectedDrinks,
    selectedNonAlcoholicDrinks, beverageQuantities, shotQuantities,
    selectedStructure, staffQuantities
  ]);

  // Função para buscar itens com cache global e promise única
  const fetchItemsWithCache = async () => {
    // Verifica cache válido
    if (globalItemsCache.data && globalItemsCache.timestamp && 
        (Date.now() - globalItemsCache.timestamp) < CACHE_DURATION) {
      return globalItemsCache.data;
    }

    // Se já está carregando, aguarda a promise existente
    if (globalItemsCache.loading && globalItemsCache.promise) {
      return await globalItemsCache.promise;
    }

    // Inicia nova requisição
    globalItemsCache.loading = true;
    globalItemsCache.error = null;

    try {
      const promise = fetchItems();
      globalItemsCache.promise = promise;
      
      const data = await promise;
      
      // Atualiza cache
      globalItemsCache.data = data;
      globalItemsCache.timestamp = Date.now();
      globalItemsCache.loading = false;
      globalItemsCache.error = null;
      
      return data;
    } catch (error) {
      globalItemsCache.loading = false;
      globalItemsCache.error = error.message;
      globalItemsCache.promise = null;
      throw error;
    }
  };

  // Effect para carregar itens - executa apenas uma vez
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Se já tem dados no cache, usa imediatamente
    if (globalItemsCache.data) {
      setItems(globalItemsCache.data);
      setCategorizedItems(groupItemsByCategory(globalItemsCache.data));
      setLoading(false);
      return;
    }

    // Busca dados da API
    fetchItemsWithCache()
      .then((data) => {
        if (mountedRef.current) {
          setItems(data);
          setCategorizedItems(groupItemsByCategory(data));
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar itens:", error);
        if (mountedRef.current && toast) {
          toast.error("Erro ao carregar itens do catálogo");
        }
      })
      .finally(() => {
        if (mountedRef.current) {
          setLoading(false);
        }
      });
  }, [toast]);

  // Cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Função para calcular o preço no backend com debounce
  const calculateBackendPrice = async (itens) => {
    if (!itens || itens.length === 0) {
      setBackendPrice(NaN);
      return NaN;
    }
    
    setCalculatingPrice(true);
    try {
      const price = await calculateOrderPrice(itens);
      const validPrice = typeof price === 'number' && !isNaN(price) ? price : NaN;
      if (mountedRef.current) {
        setBackendPrice(validPrice);
      }
      return validPrice;
    } catch (error) {
      console.error("Erro ao calcular preço:", error);
      if (mountedRef.current) {
        if (toast) {
          toast.error("Erro ao calcular preço do pedido");
        }
        setBackendPrice(NaN);
      }
      return NaN;
    } finally {
      if (mountedRef.current) {
        setCalculatingPrice(false);
      }
    }
  };

  // Função de validação do formulário
  function isFormValid() {
    const { name, date, startTime, guestCount, eventDuration } = formData;
    const dateOk = date && /^\d{4}-\d{2}-\d{2}$/.test(date);
    const timeOk = startTime && /^\d{2}:\d{2}$/.test(startTime);
    const durationOk = eventDuration && /^\d{2}:\d{2}$/.test(eventDuration) && eventDuration !== "00:00";

    return (
      name.trim() !== "" &&
      dateOk &&
      timeOk &&
      guestCount.trim() !== "" &&
      durationOk
    );
  }

  // Função para validar cada step - APENAS step 0 e 1 são obrigatórios
  function isStepValid(step) {
    switch (step) {
      case 0: return !!selectedEventType; // Step seleção de evento obrigatório
      case 1: return isFormValid(); // Step informações do evento obrigatório
      case 2: return true; // Bebidas alcoólicas - opcional
      case 3: return true; // Bebidas não alcoólicas - opcional
      case 4: return true; // Outras bebidas - opcional
      case 5: return true; // Shots - opcional
      case 6: return true; // Estrutura - opcional
      case 7: return true; // Staff - opcional
      default: return true;
    }
  }

  // Função para verificar se todos os steps anteriores são válidos
  // Só verifica steps obrigatórios (0 e 1)
  function areAllPreviousStepsValid(to) {
    // Se está tentando ir para step 1 ou posterior, verifica se step 0 está válido
    if (to >= 1 && !isStepValid(0)) return false;
    
    // Se está tentando ir para step 2 ou posterior, verifica se step 1 está válido
    if (to >= 2 && !isStepValid(1)) return false;
    
    // Todos os outros steps são opcionais, então sempre permite navegação
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
    // Só valida se é um step obrigatório (0 ou 1)
    if ((currentStep === 0 || currentStep === 1) && !isStepValid(currentStep)) {
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