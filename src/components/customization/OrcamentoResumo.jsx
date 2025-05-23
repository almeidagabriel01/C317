"use client";

export default function OrcamentoResumo({ resumo }) {
  if (!resumo) return null;

  return (
    <div className="space-y-6">
      {/* Informações básicas em grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1A222F] p-6 rounded-lg">
        <Info label="Evento" value={resumo.tipoEvento} />
        <Info label="Nome" value={resumo.nome} />
        <Info label="Data" value={resumo.data} />
        <Info label="Endereço" value={resumo.eventAddress} />
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
        <span className="text-2xl font-bold text-yellow-300">
          {Number(resumo.valorTotal).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
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