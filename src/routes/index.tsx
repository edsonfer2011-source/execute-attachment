import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Header from "../components/Header";
import IdeaInput from "../components/IdeaInput";
import IdeaList from "../components/IdeaList";
import AnalyzeButton from "../components/AnalyzeButton";
import RankingCard from "../components/RankingCard";
import ActionReport from "../components/ActionReport";
import ErrorMessage from "../components/ErrorMessage";
import { analyzeIdeas } from "../api/anthropic";
import type { RankItem } from "../types";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Hub de Inovação — Priorização inteligente de ideias" },
      {
        name: "description",
        content:
          "Cadastre ideias de negócio e receba um ranking estratégico com plano de ação gerado por IA.",
      },
    ],
  }),
});

function Index() {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [ranking, setRanking] = useState<RankItem[]>([]);
  const [error, setError] = useState("");

  const addIdea = (text: string) => {
    if (!text.trim()) return;
    setIdeas((prev) => [...prev, text.trim()]);
  };

  const removeIdea = (index: number) => {
    setIdeas((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setIdeas([]);
    setRanking([]);
    setError("");
  };

  const handleAnalyze = async () => {
    if (ideas.length === 0) return;
    setLoading(true);
    setError("");
    setRanking([]);
    try {
      const result = await analyzeIdeas(ideas);
      setRanking(result.ranking);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0EDE8] px-4 py-10 font-body">
      <div className="max-w-2xl mx-auto">
        <Header />
        <IdeaInput onAdd={addIdea} />
        <IdeaList ideas={ideas} onRemove={removeIdea} onClear={clearAll} />
        <AnalyzeButton
          onClick={handleAnalyze}
          loading={loading}
          disabled={ideas.length === 0}
        />
        {error && <ErrorMessage message={error} />}

        {ranking.length > 0 && (
          <div className="mt-10 space-y-4 animate-fade-in">
            <h2 className="font-display text-xl font-medium text-[#F0EDE8]">
              Ranking de prioridade
            </h2>
            {ranking.map((item, i) => (
              <RankingCard key={i} item={item} position={i} />
            ))}
            <ActionReport item={ranking[0]} />
          </div>
        )}
      </div>
    </div>
  );
}
