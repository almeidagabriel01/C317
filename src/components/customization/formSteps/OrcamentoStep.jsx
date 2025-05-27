"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OrcamentoResumo from "../OrcamentoResumo";
import { createPedido } from "@/services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { containerVariants } from "@/components/customization/stepIndicator/FormStepLayout";

export default function OrcamentoStep({ resumo, onBack, direction }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const clienteId = user?.ID;

  function formatDateToYYYYMMDD(dateStr) {
    if (!dateStr) return "";
    // Aceita "dd/mm/yyyy"
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    // Aceita "yyyy-mm-dd"
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    // Aceita "yyyy/mm/dd"
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  }

  const handleContratar = async () => {
    if (!clienteId) {
      toast.error("Não foi possível identificar o usuário.");
      return;
    }

    setLoading(true);

    const payload = {
      pedido: {
        ID_Comprador: clienteId,
        Num_Convidado: Number(resumo.numConvidados),
        Nome_Evento: resumo.nome,
        Horario_Inicio: resumo.horarioInicio,
        Horario_Fim: resumo.horarioFim,
        Data_Evento: formatDateToYYYYMMDD(resumo.data),
        Data_Compra: new Date().toISOString().split("T")[0],
      },
      itens: resumo.itens,
    };

    console.log("Payload enviado:", payload);

    try {
      await createPedido(payload);
      toast.success("Pedido realizado com sucesso!");
      localStorage.removeItem("C317_eventFlow");
      router.push("/");
    } catch (e) {
      toast.error(e.message || "Erro ao enviar pedido");
    } finally {
      setLoading(false);
    }
  };

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
            Revisão do Orçamento
          </h2>
        </div>

        {/* Conteúdo com scroll interno */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
          <OrcamentoResumo resumo={resumo} />
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
            onClick={handleContratar}
            disabled={loading}
            className={`px-5 py-2 rounded-full font-semibold transition ${loading
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-[#E0CEAA] text-black hover:bg-[#9D4815] hover:text-white"
              }`}
          >
            {loading ? "Enviando..." : "Contratar"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}