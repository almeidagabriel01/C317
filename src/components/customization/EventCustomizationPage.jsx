"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence } from "framer-motion";

import EventTypeSelector from "@/components/customization/EventTypeSelector";
import EventInfoForm from "@/components/customization/EventInfoForm";
import DrinkSelector from "@/components/customization/DrinkSelector";
import NonAlcoholicDrinkSelector from "@/components/customization/NonAlcoholicDrinkSelector";
import OtherBeveragesSelector from "@/components/customization/OtherBeveragesSelector";
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

export default function EventCustomizationPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    guestCount: "",
    eventDuration: "", // Inicializado com string vazia
    eventAddress: ""
  });
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [selectedNonAlcoholicDrinks, setSelectedNonAlcoholicDrinks] = useState([]);
  const [beverageQuantities, setBeverageQuantities] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleEventSelection = (evt) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(1);
    setTimeout(() => {
      setCurrentStep(1);
      setIsTransitioning(false);
    }, 100); // Tempo reduzido
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
    }, 100); // Tempo reduzido
  };

  const handleBack = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(-1);
    setTimeout(() => {
      setCurrentStep(prev => Math.max(0, prev - 1));
      setIsTransitioning(false);
    }, 100); // Tempo reduzido
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

  // Verifica se todos os campos estão preenchidos, incluindo a duração
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
          key="step4"
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