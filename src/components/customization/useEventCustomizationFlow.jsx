import { useState, useEffect } from "react";
import { fetchItems } from "@/services/api";

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

export function useEventCustomizationFlow(STEPS, toast) {
  const saved = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("C317_eventFlow") || "{}")
    : {};

  const [currentStep, setCurrentStep] = useState(saved.currentStep ?? 0);
  const [animatedStep, setAnimatedStep] = useState(saved.currentStep ?? 0);
  const [direction, setDirection] = useState(1);

  const [selectedEventType, setSelectedEventType] = useState(saved.selectedEventType ?? "");
  const [formData, setFormData] = useState(saved.formData ?? {
    name: "",
    date: "",
    startTime: "",
    guestCount: "",
    eventDuration: "",
    eventAddress: ""
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
    localStorage.setItem("C317_eventFlow", JSON.stringify(toSave));
  }, [
    currentStep, selectedEventType, formData, selectedDrinks,
    selectedNonAlcoholicDrinks, beverageQuantities, shotQuantities,
    selectedStructure, staffQuantities
  ]);

  useEffect(() => {
    fetchItems()
      .then((data) => {
        setItems(data);
        setCategorizedItems(groupItemsByCategory(data));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function isFormValid() {
    const { name, date, startTime, guestCount, eventDuration, eventAddress } = formData;
    const dateOk = date && /^\d{4}-\d{2}-\d{2}$/.test(date);
    const timeOk = startTime && /^\d{2}:\d{2}$/.test(startTime);
    return (
      name.trim() !== "" &&
      dateOk &&
      timeOk &&
      guestCount.trim() !== "" &&
      eventDuration.trim() !== "" &&
      eventDuration !== "00:00" &&
      eventAddress.trim() !== ""
    );
  }
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
  // Novo: retorna true se todos steps ANTES do "to" estão preenchidos (mas não o próprio "to")
  function areAllPreviousStepsValid(to) {
    for (let i = 0; i < to; i++) {
      if (!isStepValid(i)) return false;
    }
    return true;
  }

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

  function handleNext() {
    if (!isStepValid(currentStep)) {
      toast && toast.error("Preencha este passo antes de avançar!");
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      animateStepChange(currentStep, currentStep + 1);
    }
  }
  function handleBack() {
    if (currentStep > 0) {
      setDirection(-1);
      animateStepChange(currentStep, currentStep - 1);
    }
  }

  const handleEventSelection = (type) => {
    setSelectedEventType(type);
    handleNext();
  };
  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const toggleDrink = (d) =>
    setSelectedDrinks((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  const toggleNonAlcoholicDrink = (d) =>
    setSelectedNonAlcoholicDrinks((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
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
  };
}