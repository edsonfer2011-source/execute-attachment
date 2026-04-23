interface Props {
  label: string;
  value: number;
  color?: string;
}

export default function MetricBar({ label, value, color = "#D4A843" }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-[#8A8795] w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-[#2A2A35] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value * 10}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[11px] text-[#8A8795] w-6 text-right">{value}</span>
    </div>
  );
}
