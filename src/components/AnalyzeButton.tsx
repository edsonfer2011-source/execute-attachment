interface Props {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function AnalyzeButton({ onClick, loading, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-3 border border-[#D4A843] rounded-lg text-sm font-medium text-[#D4A843] hover:bg-[#D4A843]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-[#D4A843]/30 border-t-[#D4A843] rounded-full animate-spin" />
          <span>Analisando com IA especialista...</span>
        </>
      ) : (
        <>
          <span>Analisar e priorizar ideias</span>
          <span>↗</span>
        </>
      )}
    </button>
  );
}
