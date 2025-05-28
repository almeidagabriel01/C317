"use client";

import { formatCurrency } from "@/utils/formatUtils";

export default function OrcamentoResumo({ resumo, backendPrice = NaN }) {
  if (!resumo) return null;

  // Usar o preço do backend se disponível e válido, senão usar o calculado localmente
  const finalPrice = !isNaN(backendPrice) ? backendPrice : resumo.valorTotal;
  const isBackendPrice = !isNaN(backendPrice);

  return (
    <div className="space-y-6">
      {/* Informações básicas em grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1A222F] p-6 rounded-lg">
        <Info label="Evento" value={resumo.tipoEvento} />
        <Info label="Nome" value={resumo.nome} />
        <Info label="Data" value={resumo.data} />
        <Info label="Convidados" value={resumo.numConvidados} />
        <Info label="Horário" value={`${resumo.horarioInicio} – ${resumo.horarioFim}`} />
      </div>

      {/* Seções de pílulas */}
      {[
        { title: "Bebidas Alcoólicas", items: resumo.drinks },
        { title: "Bebidas Não Alcoólicas", items: resumo.softDrinks },
        { title: "Outras Bebidas", items: resumo.bebidasAdicionais },
        { title: "Shots", items: resumo.shots },
      ].map(({ title, items }) => (
        <TagSection key={title} title={title} items={items} />
      ))}

      {/* Equipe */}
      <TagSection
        title="Equipe"
        items={resumo.staff?.map(s => `${s.nome} x${s.qtd}`)}
      />

      {/* Estrutura */}
      <div className="bg-[#1A222F] p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-[#E0CEAA] mb-2">Estrutura</h3>
        <p className="text-white">{resumo.estrutura || "Nenhuma selecionada"}</p>
      </div>

      {/* Total */}
      <div className="text-right">
        <span className="text-xl font-semibold text-[#E0CEAA]">Total: </span>
        {resumo.calculatingPrice ? (
          <div className="inline-flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-300"></div>
            <span className="text-lg text-yellow-300">Calculando...</span>
          </div>
        ) : isNaN(finalPrice) ? (
          <span className="text-2xl font-bold text-red-400">
            Erro no cálculo
          </span>
        ) : (
          <span className="text-2xl font-bold text-yellow-300">
            {formatCurrency(finalPrice)}
          </span>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-[#E0CEAA] font-medium">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function TagSection({ title, items }) {
  return (
    <div className="bg-[#1A222F] p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-[#E0CEAA] mb-2">{title}</h3>
      {items && items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-[#9D4815] text-white text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">Nenhum selecionado</p>
      )}
    </div>
  );
}