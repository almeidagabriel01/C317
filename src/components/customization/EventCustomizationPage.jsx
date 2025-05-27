"use client";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import CustomStepper from "@/components/customization/stepIndicator/CustomStepper";
import StepRenderer from "./stepIndicator/StepRenderer";
import { useEventCustomizationFlow } from "../../hooks/useEventCustomizationFlow";
import { toast } from "react-toastify";
import { formatDateToDDMMYYYY } from "@/utils/formatUtils";

const STEPS = [
  { label: "Informações" },
  { label: "Bebidas Alcoólicas" },
  { label: "Bebidas não alcoólicas" },
  { label: "Outras bebidas" },
  { label: "Shots" },
  { label: "Estrutura" },
  { label: "Bartender" },
  { label: "Orçamento" },
];

export default function EventCustomizationPage() {
  const { user, isAuthenticated, logout } = useAuth();

  // Passa o toast para o hook
  const flow = useEventCustomizationFlow(STEPS, toast);

  function handleStepClick(i) {
    if (i === flow.currentStep) return;
    // Só permite pular para o step se TODOS os anteriores estão válidos
    if (!flow.areAllPreviousStepsValid(i)) {
      toast.error("Preencha os passos anteriores antes de avançar!");
      return;
    }
    flow.setDirection(i > flow.currentStep ? 1 : -1);
    flow.animateStepChange(flow.currentStep, i);
  }

  function getResumo() {
    const { selectedEventType, formData, selectedDrinks, selectedNonAlcoholicDrinks, beverageQuantities, shotQuantities, selectedStructure, staffQuantities, categorizedItems, items } = flow;

    const calcularHorarioFim = () => {
      const [h, m] = formData.eventDuration.split(":").map(Number);
      let total = Number(h) * 60 + Number(m);
      let nh = 18 + Math.floor(total / 60);
      let nm = total % 60;
      nh = nh >= 24 ? nh - 24 : nh;
      return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
    };

    const calcularValorTotal = () => {
      let total = 0;
      total += categorizedItems.alcoolicos
        .filter((i) => selectedDrinks.includes(i.item.Descricao))
        .reduce((sum, i) => sum + i.item.Preco, 0);
      total += categorizedItems.nao_alcoolicos
        .filter((i) => selectedNonAlcoholicDrinks.includes(i.item.Descricao))
        .reduce((sum, i) => sum + i.item.Preco, 0);
      total += categorizedItems.outras_bebidas
        .reduce((sum, i) => sum + (beverageQuantities[i.item.ID] || 0) * i.item.Preco, 0);
      total += categorizedItems.shots
        .reduce((sum, i) => sum + (shotQuantities[i.item.ID] || 0) * i.item.Preco, 0);
      total += categorizedItems.funcionarios
        .reduce((sum, i) => sum + (staffQuantities[i.item.ID] || 0) * i.item.Preco, 0);
      if (selectedStructure) {
        const est = categorizedItems.estrutura.find((i) => i.item.ID === selectedStructure);
        if (est) total += est.item.Preco;
      }
      return total;
    };

    return {
      tipoEvento: selectedEventType,
      nome: formData.name,
      data: formatDateToDDMMYYYY(formData.date),
      // Removido eventAddress
      numConvidados: formData.guestCount,
      horarioInicio: formData.startTime,
      horarioFim: calcularHorarioFim(),
      drinks: selectedDrinks,
      softDrinks: selectedNonAlcoholicDrinks,
      bebidasAdicionais: categorizedItems.outras_bebidas
        .filter((i) => beverageQuantities[i.item.ID] > 0)
        .map((i) => i.item.Descricao),
      shots: categorizedItems.shots
        .filter((i) => shotQuantities[i.item.ID] > 0)
        .map((i) => i.item.Descricao),
      staff: categorizedItems.funcionarios
        .filter((i) => staffQuantities[i.item.ID] > 0)
        .map((i) => ({ nome: i.item.Descricao, qtd: staffQuantities[i.item.ID] })),
      estrutura:
        categorizedItems.estrutura.find((i) => i.item.ID === selectedStructure)?.item.Descricao || "",
      valorTotal: calcularValorTotal(),
      itens: flow.generateOrderItems(),
    };
  }

  return (
    <div className="bg-[#101820] text-white min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
      {flow.currentStep > 0 && (
        <CustomStepper
          steps={STEPS}
          currentStep={flow.animatedStep}
          direction={flow.direction}
          onStepClick={handleStepClick}
        />
      )}
      <div className="flex-grow overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false} custom={flow.direction}>
          <StepRenderer
            key={flow.animatedStep}
            step={flow.currentStep}
            direction={flow.direction}
            states={flow}
            actions={flow}
            categorizedItems={flow.categorizedItems}
            items={flow.items}
            loading={flow.loading}
            getResumo={getResumo}
            backendPrice={flow.backendPrice}
            calculatingPrice={flow.calculatingPrice}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}