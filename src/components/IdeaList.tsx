interface Props {
  ideas: string[];
  onRemove: (i: number) => void;
  onClear: () => void;
}

export default function IdeaList({ ideas, onRemove, onClear }: Props) {
  if (ideas.length === 0) {
    return (
      <div className="border border-dashed border-[#2A2A35] rounded-xl p-8 text-center text-sm text-[#3A3A45] mb-5">
        Adicione suas ideias acima para começar a análise
      </div>
    );
  }

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] uppercase tracking-widest text-[#8A8795]">
          {ideas.length} {ideas.length === 1 ? "ideia adicionada" : "ideias adicionadas"}
        </span>
        <button
          onClick={onClear}
          className="text-xs text-[#8A8795] hover:text-[#C45A5A] transition-colors"
        >
          limpar tudo
        </button>
      </div>
      <div className="space-y-2">
        {ideas.map((idea, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-[#13131A] border border-[#2A2A35] rounded-lg px-4 py-3"
          >
            <span className="text-xs text-[#3A3A45] min-w-[18px]">{i + 1}</span>
            <span className="flex-1 text-sm text-[#F0EDE8]">{idea}</span>
            <button
              onClick={() => onRemove(i)}
              className="text-[#3A3A45] hover:text-[#C45A5A] transition-colors text-lg leading-none px-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
