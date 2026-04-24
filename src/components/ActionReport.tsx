import type { RankItem, Fase } from "../types";

interface Props {
  item: RankItem;
}

export default function ActionReport({ item }: Props) {
  const phases = Object.values(item.plano_acao) as Fase[];

  const handlePrint = () => window.print();

  return (
    <div className="mt-8">
      <h2 className="font-display text-xl font-medium text-[#F0EDE8] mb-4">
        Plano de ação — {item?.titulo ?? "ideia"}
      </h2>

      <div className="bg-[#13131A] border border-[#2A2A35] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2A2A35] bg-[#0D0D14]">
          <h3 className="font-display text-base font-medium text-[#F0EDE8]">
            Roadmap de implementação
          </h3>
          <p className="text-xs text-[#8A8795] mt-0.5">
            Ideia prioritária · Score {item?.score_total ?? 0}/100
          </p>
        </div>

        <div className="p-6 space-y-6">
          {validPhases.length === 0 ? (
            <p className="text-sm text-[#8A8795]">Plano de ação indisponível.</p>
          ) : (
            validPhases.map((phase, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: phase.cor || "#2A2A35" }}
                  />
                  <span className="text-xs font-medium text-[#F0EDE8] tracking-wide">
                    {phase.nome ?? `Fase ${i + 1}`}
                  </span>
                </div>
                <ul className="space-y-1.5 pl-4">
                  {(phase.acoes ?? []).map((acao, j) => (
                    <li key={j} className="text-sm text-[#8A8795] flex gap-2">
                      <span className="text-[#3A3A45] shrink-0">–</span>
                      {acao}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="w-full mt-4 py-3 border border-[#2A2A35] rounded-lg text-sm text-[#8A8795] hover:border-[#D4A843] hover:text-[#D4A843] transition-all"
      >
        Exportar relatório como PDF
      </button>
    </div>
  );
}
