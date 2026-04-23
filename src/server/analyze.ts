import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "../types";

const SYSTEM_PROMPT = `Você é uma especialista sênior em estratégia de negócios e inovação com 20 anos de experiência em startups, corporate venture e aceleração de projetos. Analise e priorize as ideias fornecidas com critérios objetivos e estratégicos.

Critérios (1-10):
- potencial_mercado: tamanho e crescimento do mercado endereçável
- viabilidade: facilidade técnica e financeira de implementação
- inovacao: diferenciação e novidade da solução
- urgencia: pressão de mercado e timing

Score total = média ponderada arredondada (0-100): mercado 30%, viabilidade 25%, inovação 25%, urgência 20%.
Para cada ideia, gere um plano de ação em 4 fases com 4 ações concretas cada:
- fase1 "Validação (0-30 dias)" cor "#C4834A"
- fase2 "Construção (1-3 meses)" cor "#4A7A8A"
- fase3 "Lançamento (3-6 meses)" cor "#5A8A4A"
- fase4 "Escala (6-12 meses)" cor "#7A4A8A"

Retorne TODAS as ideias rankeadas do maior para o menor score. Justificativa: 2-3 frases estratégicas concretas.`;

const TOOL = {
  type: "function" as const,
  function: {
    name: "rank_ideas",
    description: "Retorna o ranking de ideias com métricas e plano de ação.",
    parameters: {
      type: "object",
      properties: {
        ranking: {
          type: "array",
          items: {
            type: "object",
            properties: {
              rank: { type: "number" },
              titulo: { type: "string" },
              ideia_original: { type: "string" },
              score_total: { type: "number" },
              metricas: {
                type: "object",
                properties: {
                  potencial_mercado: { type: "number" },
                  viabilidade: { type: "number" },
                  inovacao: { type: "number" },
                  urgencia: { type: "number" },
                },
                required: ["potencial_mercado", "viabilidade", "inovacao", "urgencia"],
                additionalProperties: false,
              },
              justificativa: { type: "string" },
              plano_acao: {
                type: "object",
                properties: {
                  fase1: { $ref: "#/$defs/fase" },
                  fase2: { $ref: "#/$defs/fase" },
                  fase3: { $ref: "#/$defs/fase" },
                  fase4: { $ref: "#/$defs/fase" },
                },
                required: ["fase1", "fase2", "fase3", "fase4"],
                additionalProperties: false,
              },
            },
            required: [
              "rank",
              "titulo",
              "ideia_original",
              "score_total",
              "metricas",
              "justificativa",
              "plano_acao",
            ],
            additionalProperties: false,
          },
        },
      },
      required: ["ranking"],
      $defs: {
        fase: {
          type: "object",
          properties: {
            nome: { type: "string" },
            cor: { type: "string" },
            acoes: { type: "array", items: { type: "string" } },
          },
          required: ["nome", "cor", "acoes"],
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
  },
};

export const analyzeIdeasFn = createServerFn({ method: "POST" })
  .inputValidator((input: { ideas: string[] }) => {
    if (!input || !Array.isArray(input.ideas)) throw new Error("Lista de ideias inválida");
    const ideas = input.ideas
      .map((s) => String(s || "").trim())
      .filter(Boolean)
      .slice(0, 20);
    if (ideas.length === 0) throw new Error("Adicione ao menos uma ideia");
    return { ideas };
  })
  .handler(async ({ data }): Promise<ApiResponse> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY não configurada");

    const ideasList = data.ideas.map((idea, i) => `${i + 1}. ${idea}`).join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Analise e priorize estas ideias de negócio/projeto:\n\n${ideasList}`,
          },
        ],
        tools: [TOOL],
        tool_choice: { type: "function", function: { name: "rank_ideas" } },
      }),
    });

    if (!res.ok) {
      if (res.status === 429)
        throw new Error("Limite de requisições atingido. Tente novamente em instantes.");
      if (res.status === 402)
        throw new Error(
          "Créditos esgotados. Adicione fundos em Settings → Workspace → Usage.",
        );
      const t = await res.text().catch(() => "");
      console.error("AI gateway error:", res.status, t);
      throw new Error("Falha ao consultar a IA. Tente novamente.");
    }

    const json = await res.json();
    const call = json?.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr = call?.function?.arguments;
    if (!argsStr) throw new Error("Resposta da IA sem dados estruturados");

    const parsed = JSON.parse(argsStr) as ApiResponse;
    parsed.ranking.sort((a, b) => b.score_total - a.score_total);
    parsed.ranking.forEach((it, i) => (it.rank = i + 1));
    return parsed;
  });
