"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence } from "framer-motion";
import { fetchItems } from "@/services/api";

import EventTypeSelector from "@/components/customization/EventTypeSelector";
import EventInfoForm from "@/components/customization/steps/EventInfoForm";
import DrinkSelector from "@/components/customization/steps/DrinkSelector";
import NonAlcoholicDrinkSelector from "@/components/customization/steps/NonAlcoholicDrinkSelector";
import OtherBeveragesSelector from "@/components/customization/steps/OtherBeveragesSelector";
import ShotsSelector from "@/components/customization/steps/ShotsSelector";
import StructureSelector from "@/components/customization/steps/StructureSelector";
import StaffSelector from "@/components/customization/steps/StaffSelector";
import CustomStepper from "@/components/step/CustomStepper";

const STEPS = [
  { label: "Informações" },
  { label: "Bebidas Alcoólicas" },
  { label: "Bebidas não alcoólicas" },
  { label: "Outras bebidas" },
  { label: "Shots" },
  { label: "Estrutura" },
  { label: "Bartender" },
];

// Agrupar itens por categoria
const groupItemsByCategory = (items) => {
  const categorized = {
    alcoolicos: [],
    nao_alcoolicos: [],
    outras_bebidas: [],
    shots: [],
    estrutura: [],
    funcionarios: []
  };

  items.forEach(item => {
    const category = item.item.Categoria;
    if (categorized[category] !== undefined) {
      categorized[category].push(item);
    }
  });

  return categorized;
};

export default function EventCustomizationPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    guestCount: "",
    eventDuration: "",
    eventAddress: ""
  });
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [selectedNonAlcoholicDrinks, setSelectedNonAlcoholicDrinks] = useState([]);
  const [beverageQuantities, setBeverageQuantities] = useState({});
  const [shotQuantities, setShotQuantities] = useState({});
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [staffQuantities, setStaffQuantities] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorizedItems, setCategorizedItems] = useState({
    alcoolicos: [],
    nao_alcoolicos: [],
    outras_bebidas: [],
    shots: [],
    estrutura: [],
    funcionarios: []
  });

  // Buscar itens da API
  useEffect(() => {
    const getItems = async () => {
      try {
        setLoading(true);
        const itemsData = await fetchItems();
        setItems(itemsData);
        setCategorizedItems(groupItemsByCategory(itemsData));
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, []);

  const handleEventSelection = (evt) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(1);
    setTimeout(() => {
      setCurrentStep(1);
      setIsTransitioning(false);
    }, 100);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(1);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsTransitioning(false);
    }, 100);
  };

  const handleBack = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(-1);
    setTimeout(() => {
      setCurrentStep(prev => Math.max(0, prev - 1));
      setIsTransitioning(false);
    }, 100);
  };

  const toggleDrink = (d) => {
    setSelectedDrinks(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const toggleNonAlcoholicDrink = (d) => {
    setSelectedNonAlcoholicDrinks(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const setBeverageQuantity = (id, quantity) => {
    setBeverageQuantities(prev => ({ ...prev, [id]: quantity }));
  };

  const setShotQuantity = (id, quantity) => {
    setShotQuantities(prev => ({ ...prev, [id]: quantity }));
  };

  const setStaffQuantity = (id, quantity) => {
    setStaffQuantities(prev => ({ ...prev, [id]: quantity }));
  };

  // Verifica se todos os campos estão preenchidos
  const isFormValid = () => {
    const { name, date, guestCount, eventDuration, eventAddress } = formData;
    return (
      name.trim() !== "" &&
      date.trim() !== "" &&
      guestCount.trim() !== "" &&
      eventDuration.trim() !== "" &&
      eventDuration !== "00:00" &&
      eventAddress.trim() !== ""
    );
  };

  const renderStepContent = () => {
    if (loading && currentStep > 1) {
      return (
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="text-[#E0CEAA] text-lg">Carregando...</div>
        </div>
      );
    }

    switch (currentStep) {
      case 0: return (
        <EventTypeSelector
          direction={direction}
          onSelect={handleEventSelection}
          key="step0"
        />
      );
      case 1: return (
        <EventInfoForm
          formData={formData}
          onChange={handleInputChange}
          onNext={handleNext}
          onBack={handleBack}
          isValid={isFormValid()}
          direction={direction}
          key="step1"
        />
      );
      case 2: return (
        <DrinkSelector
          selectedDrinks={selectedDrinks}
          toggleDrink={toggleDrink}
          onNext={handleNext}
          onBack={handleBack}
          direction={direction}
          items={categorizedItems.alcoolicos}
          key="step2"
        />
      );
      case 3: return (
        <NonAlcoholicDrinkSelector
          selectedDrinks={selectedNonAlcoholicDrinks}
          toggleDrink={toggleNonAlcoholicDrink}
          onNext={handleNext}
          onBack={handleBack}
          direction={direction}
          items={categorizedItems.nao_alcoolicos}
          key="step3"
        />
      );
      case 4: return (
        <OtherBeveragesSelector
          beverageQuantities={beverageQuantities}
          setBeverageQuantity={setBeverageQuantity}
          onNext={handleNext}
          onBack={handleBack}
          direction={direction}
          items={categorizedItems.outras_bebidas}
          key="step4"
        />
      );
      case 5: return (
        <ShotsSelector
          shotQuantities={shotQuantities}
          setShotQuantity={setShotQuantity}
          onNext={handleNext}
          onBack={handleBack}
          direction={direction}
          items={categorizedItems.shots}
          key="step5"
        />
      );
      case 6: return (
        <StructureSelector
          selectedStructure={selectedStructure}
          setSelectedStructure={setSelectedStructure}
          onNext={handleNext}
          onBack={handleBack}
          direction={direction}
          items={categorizedItems.estrutura}
          key="step6"
        />
      );
      case 7: return (
        <StaffSelector
          staffQuantities={staffQuantities}
          setStaffQuantity={setStaffQuantity}
          onNext={handleNext}
          onBack={handleBack}
          direction={direction}
          items={categorizedItems.funcionarios}
          key="step7"
        />
      );
      default: return null;
    }
  };

  // Impedir scroll horizontal
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  return (
    <div className="bg-[#101820] text-white min-h-screen flex flex-col overflow-x-hidden">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      {currentStep > 0 && (
        <CustomStepper steps={STEPS} currentStep={currentStep - 1} direction={direction} />
      )}

      <div className="flex-grow flex flex-col overflow-x-hidden">
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => { }}
        >
          {renderStepContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}