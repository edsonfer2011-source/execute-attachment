import type { ApiResponse } from "../types";

const SYSTEM_PROMPT = `Você é uma especialista sênior em estratégia de negócios e inovação com 20 anos de experiência em startups, corporate venture e aceleração de projetos. Analise e priorize as ideias fornecidas com critérios objetivos e estratégicos.

Responda SOMENTE com JSON válido, sem markdown, sem texto antes ou depois. Estrutura obrigatória:
{
  "ranking": [
    {
      "rank": 1,
      "titulo": "nome curto da ideia",
      "ideia_original": "texto original da ideia",
      "score_total": 87,
      "metricas": {
        "potencial_mercado": 9,
        "viabilidade": 8,
        "inovacao": 9,
        "urgencia": 7
      },
      "justificativa": "2-3 frases explicando por que esta ideia é prioritária, com análise estratégica concreta",
      "plano_acao": {
        "fase1": { "nome": "Validação (0-30 dias)", "cor": "#C4834A", "acoes": ["ação 1","ação 2","ação 3","ação 4"] },
        "fase2": { "nome": "Construção (1-3 meses)", "cor": "#4A7A8A", "acoes": ["ação 1","ação 2","ação 3","ação 4"] },
        "fase3": { "nome": "Lançamento (3-6 meses)", "cor": "#5A8A4A", "acoes": ["ação 1","ação 2","ação 3","ação 4"] },
        "fase4": { "nome": "Escala (6-12 meses)", "cor": "#7A4A8A", "acoes": ["ação 1","ação 2","ação 3","ação 4"] }
      }
    }
  ]
}

Critérios (1-10): potencial_mercado, viabilidade, inovacao, urgencia.
Score total = média ponderada: mercado 30%, viabilidade 25%, inovação 25%, urgência 20%.
Retorne TODAS as ideias rankeadas do maior para o menor score.`;

export async function analyzeIdeas(ideas: string[]): Promise<ApiResponse> {
  const apiKey = (import.meta as unknown as { env: Record<string, string | undefined> }).env
    .VITE_ANTHROPIC_API_KEY;
  if (!apiKey)
    throw new Error("Chave da API não configurada. Adicione VITE_ANTHROPIC_API_KEY no .env");

  const ideasList = ideas.map((idea, i) => `${i + 1}. ${idea}`).join("\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analise e priorize estas ideias de negócio/projeto:\n\n${ideasList}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Erro ao chamar a API da Anthropic");
  }

  const data = await response.json();
  const rawText = (data.content as Array<{ type: string; text?: string }>)
    .map((b) => b.text || "")
    .join("");
  const clean = rawText.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as ApiResponse;
}
