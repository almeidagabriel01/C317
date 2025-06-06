"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OrcamentoResumo from "../OrcamentoResumo";
import { createPedido } from "@/services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { containerVariants } from "@/components/customization/stepIndicator/FormStepLayout";
import { formatDateToYYYYMMDD } from "@/utils/formatUtils";

export default function OrcamentoStep({ resumo, onBack, direction, backendPrice = null }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [savingBudget, setSavingBudget] = useState(false);

  const clienteId = user?.ID;

  // Função para verificar se há itens selecionados
  const hasSelectedItems = () => {
    if (!resumo || !resumo.itens) return false;
    return resumo.itens.length > 0;
  };

  const createPayload = (status) => {
    return {
      pedido: {
        ID_Comprador: clienteId,
        Num_Convidado: Number(resumo.numConvidados),
        Nome_Evento: resumo.nome,
        Horario_Inicio: resumo.horarioInicio,
        Horario_Fim: resumo.horarioFim,
        Data_Evento: formatDateToYYYYMMDD(resumo.data),
        Data_Compra: new Date().toISOString().split("T")[0],
        Status: status,
      },
      itens: resumo.itens,
    };
  };

  const handleSalvarOrcamento = async () => {
    if (!clienteId) {
      toast.error("Não foi possível identificar o usuário.");
      return;
    }

    if (!hasSelectedItems()) {
      toast.error("Selecione pelo menos um item antes de salvar o orçamento.");
      return;
    }

    setSavingBudget(true);
    const payload = createPayload("Orcado");

    try {
      await createPedido(payload);
      toast.success("Orçamento salvo com sucesso!");
      localStorage.removeItem("C317_eventFlow");
      router.push("/profile");
    } catch (e) {
      toast.error(e.message || "Erro ao salvar orçamento");
    } finally {
      setSavingBudget(false);
    }
  };

  const handleEnviarPedido = async () => {
    if (!clienteId) {
      toast.error("Não foi possível identificar o usuário.");
      return;
    }

    if (!hasSelectedItems()) {
      toast.error("Selecione pelo menos um item antes de enviar o pedido.");
      return;
    }

    setLoading(true);
    const payload = createPayload("Pendente");

    try {
      await createPedido(payload);
      toast.success("Pedido enviado com sucesso!");
      localStorage.removeItem("C317_eventFlow");
      router.push("/profile");
    } catch (e) {
      toast.error(e.message || "Erro ao enviar pedido");
    } finally {
      setLoading(false);
    }
  };

  // Verifica se os botões devem estar habilitados
  const buttonsEnabled = hasSelectedItems();

  return (
    <motion.div
      className="bg-[#101820] flex justify-center py-8 px-4"
      custom={direction}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="w-full max-w-3xl bg-[#1C2431] rounded-lg shadow-lg flex flex-col max-h-[75vh] overflow-hidden">
        {/* Cabeçalho */}
        <div className="px-6 py-4 bg-[#1A222F] border-b border-gray-700">
          <h2 className="text-2xl font-bold text-[#E0CEAA]">
            Resumo do Pedido
          </h2>
        </div>

        {/* Conteúdo com scroll interno */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
          <OrcamentoResumo resumo={resumo} backendPrice={backendPrice} />
          
          {/* Aviso se não há itens selecionados */}
          {!hasSelectedItems() && (
            <div className="mt-6 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-yellow-200 text-sm font-medium">
                  Você precisa selecionar pelo menos um item para continuar.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com ações */}
        <div className="px-6 py-4 bg-[#1A222F] border-t border-gray-700 flex justify-end gap-3">
          <button
            onClick={onBack}
            className="px-5 py-2 border border-[#E0CEAA] text-[#E0CEAA] rounded-full hover:bg-[#9D4815] hover:text-white transition"
          >
            Voltar
          </button>
          
          <button
            onClick={handleSalvarOrcamento}
            disabled={savingBudget || !buttonsEnabled}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              savingBudget || !buttonsEnabled
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-yellow-600 text-white hover:bg-yellow-700"
            }`}
            title={!buttonsEnabled ? "Selecione pelo menos um item para salvar o orçamento" : ""}
          >
            {savingBudget ? "Salvando..." : "Salvar Orçamento"}
          </button>
          
          <button
            onClick={handleEnviarPedido}
            disabled={loading || !buttonsEnabled}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              loading || !buttonsEnabled
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-[#E0CEAA] text-black hover:bg-[#9D4815] hover:text-white"
            }`}
            title={!buttonsEnabled ? "Selecione pelo menos um item para enviar o pedido" : ""}
          >
            {loading ? "Enviando..." : "Enviar Pedido"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}