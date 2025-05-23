import EventTypeSelector from "@/components/customization/EventTypeSelector";
import EventInfoForm from "@/components/customization/formSteps/EventInfoForm";
import DrinkSelector from "@/components/customization/formSteps/DrinkSelector";
import NonAlcoholicDrinkSelector from "@/components/customization/formSteps/NonAlcoholicDrinkSelector";
import OtherBeveragesSelector from "@/components/customization/formSteps/OtherBeveragesSelector";
import ShotsSelector from "@/components/customization/formSteps/ShotsSelector";
import StructureSelector from "@/components/customization/formSteps/StructureSelector";
import StaffSelector from "@/components/customization/formSteps/StaffSelector";
import OrcamentoStep from "@/components/customization/formSteps/OrcamentoStep";

// Função utilitária de formatação de data para resumo
function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

export default function StepRenderer({
  step,
  direction,
  states,
  actions,
  categorizedItems,
  items,
  loading,
  getResumo,
}) {
  if (loading && step > 1) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="text-[#E0CEAA] text-lg">Carregando...</div>
      </div>
    );
  }

  switch (step) {
    case 0:
      return (
        <EventTypeSelector
          direction={direction}
          onSelect={actions.handleEventSelection}
          key="step0"
        />
      );
    case 1:
      return (
        <EventInfoForm
          formData={states.formData}
          onChange={actions.handleInputChange}
          onNext={actions.handleNext}
          onBack={actions.handleBack}
          isValid={actions.isStepValid(1)}
          direction={direction}
          key="step1"
        />
      );
    case 2:
      return (
        <DrinkSelector
          selectedDrinks={states.selectedDrinks}
          toggleDrink={actions.toggleDrink}
          onNext={actions.handleNext}
          onBack={actions.handleBack}
          isValid={actions.isStepValid(2)}
          direction={direction}
          items={categorizedItems.alcoolicos}
          key="step2"
        />
      );
    case 3:
      return (
        <NonAlcoholicDrinkSelector
          selectedDrinks={states.selectedNonAlcoholicDrinks}
          toggleDrink={actions.toggleNonAlcoholicDrink}
          onNext={actions.handleNext}
          onBack={actions.handleBack}
          isValid={actions.isStepValid(3)}
          direction={direction}
          items={categorizedItems.nao_alcoolicos}
          key="step3"
        />
      );
    case 4:
      return (
        <OtherBeveragesSelector
          beverageQuantities={states.beverageQuantities}
          setBeverageQuantity={actions.setBeverageQty}
          onNext={actions.handleNext}
          onBack={actions.handleBack}
          isValid={actions.isStepValid(4)}
          direction={direction}
          items={categorizedItems.outras_bebidas}
          key="step4"
        />
      );
    case 5:
      return (
        <ShotsSelector
          shotQuantities={states.shotQuantities}
          setShotQuantity={actions.setShotQty}
          onNext={actions.handleNext}
          onBack={actions.handleBack}
          isValid={actions.isStepValid(5)}
          direction={direction}
          items={categorizedItems.shots}
          key="step5"
        />
      );
    case 6:
      return (
        <StructureSelector
          selectedStructure={states.selectedStructure}
          setSelectedStructure={actions.setSelectedStructure}
          onNext={actions.handleNext}
          onBack={actions.handleBack}
          isValid={actions.isStepValid(6)}
          direction={direction}
          items={categorizedItems.estrutura}
          key="step6"
        />
      );
    case 7:
      return (
        <StaffSelector
          staffQuantities={states.staffQuantities}
          setStaffQuantity={actions.setStaffQty}
          onNext={actions.handleNext}
          onBack={actions.handleBack}
          isValid={actions.isStepValid(7)}
          direction={direction}
          items={categorizedItems.funcionarios}
          key="step7"
        />
      );
    case 8:
      return (
        <OrcamentoStep
          resumo={getResumo()}
          onBack={actions.handleBack}
          key="step8"
          direction={direction}
        />
      );
    default:
      return null;
  }
}