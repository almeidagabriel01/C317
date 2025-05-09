"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence } from "framer-motion";

import EventTypeSelector from "@/components/customization/EventTypeSelector";
import EventInfoForm from "@/components/customization/EventInfoForm";
import DrinkSelector from "@/components/customization/DrinkSelector";
import CustomStepper from "@/components/customization/CustomStepper";

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
  const [formData, setFormData] = useState({ name: "", date: "", guestCount: "", eventDuration: "" });
  const [selectedDrinks, setSelectedDrinks] = useState([]);

  const handleEventSelection = (evt) => { setDirection(1); setCurrentStep(1); };
  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNext = () => { setDirection(1); setCurrentStep(prev => prev + 1); };
  const handleBack = () => { setDirection(-1); setCurrentStep(prev => Math.max(0, prev - 1)); };
  const toggleDrink = (d) => setSelectedDrinks(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const isFormValid = () => Object.values(formData).every(v => v.trim() !== "");

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <EventTypeSelector direction={direction} onSelect={handleEventSelection} key="step0" />;
      case 1: return <EventInfoForm formData={formData} onChange={handleInputChange} onNext={handleNext} onBack={handleBack} isValid={isFormValid()} direction={direction} key="step1" />;
      case 2: return <DrinkSelector selectedDrinks={selectedDrinks} toggleDrink={toggleDrink} onNext={handleNext} onBack={handleBack} direction={direction} key="step2" />;
      default: return null;
    }
  };

  return (
    <div className="bg-[#101820] text-white min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      {currentStep > 0 && (
        <CustomStepper steps={STEPS} currentStep={currentStep - 1} direction={direction} />
      )}

      <AnimatePresence initial={false} exitBeforeEnter>
        {renderStepContent()}
      </AnimatePresence>
    </div>
  );
}