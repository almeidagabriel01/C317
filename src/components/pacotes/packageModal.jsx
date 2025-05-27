"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createPedido } from "@/services/api";
import { formatDateToYYYYMMDD } from "@/utils/formatUtils";
import { toast } from "react-toastify";
import Image from "next/image";
import TimeSelector from "../input/TimeSelector";
import { useReadyPackages } from "@/hooks/useReadyPackages";

// Função para validar data no formato yyyy-mm-dd
function isValidDate(input) {
  if (!input) return false;
  const [year, month, day] = input.split('-').map(Number);
  if (!year || !month || !day) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
}

// Valida hora (hh:mm)
function isValidTime(input) {
  if (!input) return false;
  const [hh, mm] = input.split(':').map(Number);
  return (
    !isNaN(hh) && !isNaN(mm) &&
    hh >= 0 && hh <= 23 &&
    mm >= 0 && mm <= 59
  );
}

export default function PackageModal({ isOpen, onClose, packageInfo }) {
  const { user } = useAuth();
  const router = useRouter();
  
  // Hook para gerenciar dados do pacote
  const packageHook = useReadyPackages(packageInfo);
  
  // Estados do modal
  const [currentView, setCurrentView] = useState('details'); // 'details' ou 'form'
  const [loading, setLoading] = useState(false);
  const [savingBudget, setSavingBudget] = useState(false);
  
  // Estados de validação
  const [dateTouched, setDateTouched] = useState(false);
  const [timeTouched, setTimeTouched] = useState(false);

  // Reset quando o modal abre/fecha ou muda de pacote
  useEffect(() => {
    if (isOpen && packageInfo) {
      packageHook.resetForm();
      setCurrentView('details');
      setDateTouched(false);
      setTimeTouched(false);
    }
  }, [isOpen, packageInfo?.id]);

  if (!isOpen || !packageInfo) return null;

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300,
        duration: 0.2
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95, 
      transition: { duration: 0.15 } 
    },
  };

  // Funções do formulário
  const handleInputChange = (e) => {
    packageHook.handleInputChange(e);
    const { name } = e.target;
    if (name === "date") setDateTouched(true);
    if (name === "startTime") setTimeTouched(true);
  };

  const handleDurationChange = (value) => {
    packageHook.handleDurationChange(value);
  };

  // Validação do formulário
  const isFormValid = () => packageHook.isFormValid();

  const showDateError = dateTouched && packageHook.formData.date && !isValidDate(packageHook.formData.date);
  const showTimeError = timeTouched && packageHook.formData.startTime && !isValidTime(packageHook.formData.startTime);

  // Função para calcular horário de fim
  const calcularHorarioFim = () => packageHook.calcularHorarioFim();

  // Função para criar o payload
  const createPayload = (status) => {
    return {
      pedido: {
        ID_Comprador: user?.ID,
        Num_Convidado: packageInfo.guests,
        Nome_Evento: packageHook.formData.name,
        Horario_Inicio: packageHook.formData.startTime,
        Horario_Fim: calcularHorarioFim(),
        Data_Evento: formatDateToYYYYMMDD(packageHook.formData.date),
        Data_Compra: new Date().toISOString().split("T")[0],
        Status: status,
      },
      itens: packageInfo.items,
    };
  };

  // Handlers para salvar e enviar
  const handleSalvarOrcamento = async () => {
    if (!user?.ID) {
      toast.error("Não foi possível identificar o usuário.");
      return;
    }

    setSavingBudget(true);
    const payload = createPayload("Orcado");

    try {
      await createPedido(payload);
      toast.success("Orçamento salvo com sucesso!");
      packageHook.clearData(); // Limpa dados salvos
      onClose();
      router.push("/profile");
    } catch (e) {
      toast.error(e.message || "Erro ao salvar orçamento");
    } finally {
      setSavingBudget(false);
    }
  };

  const handleEnviarPedido = async () => {
    if (!user?.ID) {
      toast.error("Não foi possível identificar o usuário.");
      return;
    }

    setLoading(true);
    const payload = createPayload("Pendente");

    try {
      await createPedido(payload);
      toast.success("Pedido enviado com sucesso!");
      packageHook.clearData(); // Limpa dados salvos
      onClose();
      router.push("/");
    } catch (e) {
      toast.error(e.message || "Erro ao enviar pedido");
    } finally {
      setLoading(false);
    }
  };

  // Handler para avançar para o formulário
  const handleAdvance = () => {
    setCurrentView('form');
  };

  // Handler para voltar aos detalhes
  const handleBackToDetails = () => {
    setCurrentView('details');
    setDateTouched(false);
    setTimeTouched(false);
  };

  // Handler principal para fechar
  const handleClose = () => {
    setCurrentView('details');
    packageHook.resetForm();
    setDateTouched(false);
    setTimeTouched(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleClose}
      >
        <motion.div
          className="relative bg-[#1C2431] max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl flex flex-col"
          variants={contentVariants}
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: 'calc(90vh - 40px)' }}
        >
          {currentView === 'details' ? (
            // Vista de detalhes do pacote
            <>
              {/* Cabeçalho com imagem */}
              <div className="relative w-full h-48 sm:h-64">
                <Image
                  src={`/assets/${packageInfo.image}`}
                  alt={packageInfo.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101820] to-transparent opacity-80"></div>
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#E0CEAA] bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all duration-200 text-[#1C2431]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">{packageInfo.title}</h2>
                </div>
              </div>

              {/* Resumo do pacote */}
              <div className="p-6 border-b border-gray-700/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-[#E0CEAA]">
                      <span>👥 {packageInfo.guests} convidados</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#E0CEAA]">
                      <span>⏱ {packageInfo.hours} horas de open bar</span>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className="text-sm text-[#A8937E]">Valor total:</div>
                    <div className="text-2xl font-bold text-[#E0CEAA]">{packageInfo.price}</div>
                  </div>
                </div>
              </div>

              {/* Conteúdo com scroll */}
              <div className="overflow-y-auto p-6 custom-scrollbar" style={{ maxHeight: 'calc(90vh - 380px)' }}>
                <div className="space-y-6">
                  {Object.entries(packageInfo.details).map(([category, items]) => (
                    <div key={category} className="pb-4">
                      <h3 className="text-lg font-semibold text-[#E0CEAA] mb-3">{category}</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {items.map((item, index) => (
                          <li key={index} className="flex items-center text-white">
                            <span className="text-[#9D4815] mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rodapé com botão avançar */}
              <div className="p-6 bg-[#1C2431] border-t border-gray-700/30 flex justify-between">
                <button
                  onClick={handleClose}
                  className="py-3 px-6 border border-[#E0CEAA] text-[#E0CEAA] hover:bg-[#9D4815] hover:text-white rounded-full transition-all"
                >
                  Fechar
                </button>
                <button
                  onClick={handleAdvance}
                  className="py-3 px-6 bg-[#9D4815] hover:bg-[#924d2b] text-white font-bold rounded-full transition-all"
                >
                  Avançar
                </button>
              </div>
            </>
          ) : (
            // Vista do formulário
            <>
              {/* Cabeçalho do formulário */}
              <div className="p-6 bg-[#1A222F] border-b border-gray-700">
                <h2 className="text-2xl font-bold text-[#E0CEAA]">
                  Informações do Evento - {packageInfo.title}
                </h2>
                <p className="text-[#A8937E] mt-1">
                  Preencha os detalhes do seu evento
                </p>
              </div>

              {/* Formulário com scroll */}
              <div className="flex-grow overflow-y-auto custom-scrollbar p-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                <div className="space-y-6">
                  <div className="relative">
                    <label className="text-sm text-[#E0CEAA] mb-1 block">Nome do Evento</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Ex: Casamento Ana e João"
                      value={packageHook.formData.name}
                      onChange={handleInputChange}
                      className="bg-[#F7F6F3] h-12 text-black px-4 py-2 rounded-md w-full border-2 border-transparent focus:border-[#9D4815] transition-colors focus:outline-none"
                    />
                  </div>

                  <div className="relative flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm text-[#E0CEAA] mb-1 block">Data do Evento</label>
                      <input
                        type="date"
                        name="date"
                        value={packageHook.formData.date}
                        onChange={handleInputChange}
                        className={`bg-[#F7F6F3] text-black h-12 px-4 py-2 rounded-md w-full border-2 transition-colors focus:outline-none ${showDateError ? "border-red-500" : "border-transparent focus:border-[#9D4815]"}`}
                      />
                      {showDateError && (
                        <span className="block text-red-500 text-xs mt-1 ml-1">Data inválida.</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-[#E0CEAA] mb-1 block">Hora de Início</label>
                      <input
                        type="time"
                        name="startTime"
                        value={packageHook.formData.startTime || ""}
                        onChange={handleInputChange}
                        className={`bg-[#F7F6F3] text-black h-12 px-4 py-2 rounded-md w-full border-2 transition-colors focus:outline-none ${showTimeError ? "border-red-500" : "border-transparent focus:border-[#9D4815]"}`}
                      />
                      {showTimeError && (
                        <span className="block text-red-500 text-xs mt-1 ml-1">Hora inválida.</span>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <label className="text-sm text-[#E0CEAA] mb-1 block">Endereço do Evento</label>
                    <input
                      type="text"
                      name="eventAddress"
                      placeholder="Ex: Rua das Flores, 123"
                      value={packageHook.formData.eventAddress}
                      onChange={handleInputChange}
                      className="bg-[#F7F6F3] text-black h-12 px-4 py-2 rounded-md w-full border-2 border-transparent focus:border-[#9D4815] transition-colors focus:outline-none"
                    />
                  </div>

                  <div className="relative">
                    <label className="text-sm text-[#E0CEAA] mb-1 block">
                      Duração do Evento (Recomendado: {packageInfo.hours} horas)
                    </label>
                    <TimeSelector
                      value={packageHook.formData.eventDuration}
                      onChange={handleDurationChange}
                    />
                  </div>

                  {/* Resumo do pacote no formulário */}
                  <div className="bg-[#1A222F] p-4 rounded-lg border border-[#E0CEAA]/20">
                    <h3 className="text-[#E0CEAA] font-semibold mb-2">Resumo do Pacote</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white">{packageInfo.title}</p>
                        <p className="text-sm text-[#A8937E]">
                          {packageInfo.guests} convidados • {packageInfo.hours}h de open bar
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#E0CEAA]">{packageInfo.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rodapé com botões de ação */}
              <div className="p-6 bg-[#1C2431] border-t border-gray-700/30 flex justify-between">
                <button
                  onClick={handleBackToDetails}
                  className="py-3 px-6 border border-[#E0CEAA] text-[#E0CEAA] hover:bg-[#9D4815] hover:text-white rounded-full transition-all"
                >
                  Voltar
                </button>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSalvarOrcamento}
                    disabled={!isFormValid() || showDateError || showTimeError || savingBudget}
                    className={`py-3 px-6 rounded-full font-semibold transition-all ${
                      isFormValid() && !showDateError && !showTimeError && !savingBudget
                        ? "bg-yellow-600 text-white hover:bg-yellow-700"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {savingBudget ? "Salvando..." : "Salvar Orçamento"}
                  </button>
                  
                  <button
                    onClick={handleEnviarPedido}
                    disabled={!isFormValid() || showDateError || showTimeError || loading}
                    className={`py-3 px-6 rounded-full font-semibold transition-all ${
                      isFormValid() && !showDateError && !showTimeError && !loading
                        ? "bg-[#E0CEAA] text-black hover:bg-[#9D4815] hover:text-white"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {loading ? "Enviando..." : "Enviar Pedido"}
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}