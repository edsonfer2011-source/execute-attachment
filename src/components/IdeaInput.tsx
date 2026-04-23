import { useState, type KeyboardEvent } from "react";

interface Props {
  onAdd: (text: string) => void;
}

export default function IdeaInput({ onAdd }: Props) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="bg-[#13131A] rounded-xl border border-[#2A2A35] p-5 mb-5">
      <label className="block text-[11px] uppercase tracking-widest text-[#8A8795] mb-3">
        Nova ideia
      </label>
      <div className="flex gap-3">
        <textarea
          className="flex-1 bg-[#0A0A0F] border border-[#2A2A35] rounded-lg px-4 py-3 text-sm text-[#F0EDE8] placeholder-[#3A3A45] resize-none focus:outline-none focus:border-[#D4A843] transition-colors"
          placeholder="Descreva sua ideia de negócio ou projeto..."
          rows={2}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          onClick={handleAdd}
          className="px-5 py-3 bg-[#13131A] border border-[#2A2A35] rounded-lg text-sm font-medium text-[#D4A843] hover:border-[#D4A843] hover:bg-[#1A1A22] transition-all whitespace-nowrap"
        >
          + Adicionar
        </button>
      </div>
    </div>
  );
}
