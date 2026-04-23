import MetricBar from "./MetricBar";
import type { RankItem } from "../types";

interface Props {
  item: RankItem;
  position: number;
}

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_COLORS = ["#D4A843", "#A0A0A0", "#C4834A"];
const METRIC_BARS = [
  { key: "potencial_mercado" as const, label: "Mercado" },
  { key: "viabilidade" as const, label: "Viabilidade" },
  { key: "inovacao" as const, label: "Inovação" },
  { key: "urgencia" as const, label: "Urgência" },
];

export default function RankingCard({ item, position }: Props) {
  const isTop = position < 3;
  const borderColor = isTop ? RANK_COLORS[position] : "#2A2A35";

  return (
    <div
      className="bg-[#13131A] rounded-xl p-5 transition-all"
      style={{ border: `1px solid ${borderColor}` }}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">{position < 3 ? MEDALS[position] : `#${position + 1}`}</span>
        <div className="flex-1">
          <h3 className="font-display text-base font-medium text-[#F0EDE8]">{item.titulo}</h3>
          {item.ideia_original && (
            <p className="text-xs text-[#8A8795] mt-0.5 line-clamp-1">{item.ideia_original}</p>
          )}
        </div>
        <span className="text-xs font-medium px-3 py-1 bg-[#0A0A0F] border border-[#2A2A35] rounded-full text-[#8A8795] whitespace-nowrap">
          Score {item.score_total}/100
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {METRIC_BARS.map(({ key, label }) => (
          <div key={key} className="bg-[#0A0A0F] rounded-lg p-2 text-center">
            <p className="text-[10px] text-[#8A8795] mb-1">{label}</p>
            <p className="text-sm font-medium text-[#F0EDE8]">{item.metricas[key]}/10</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        {METRIC_BARS.map(({ key, label }) => (
          <MetricBar key={key} label={label} value={item.metricas[key]} />
        ))}
      </div>

      <div className="pt-3 border-t border-[#2A2A35]">
        <p className="text-xs text-[#8A8795] leading-relaxed">{item.justificativa}</p>
      </div>
    </div>
  );
}
