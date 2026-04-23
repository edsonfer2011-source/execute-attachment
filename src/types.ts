export interface Metricas {
  potencial_mercado: number;
  viabilidade: number;
  inovacao: number;
  urgencia: number;
}

export interface Fase {
  nome: string;
  cor: string;
  acoes: string[];
}

export interface PlanoAcao {
  fase1: Fase;
  fase2: Fase;
  fase3: Fase;
  fase4: Fase;
}

export interface RankItem {
  rank: number;
  titulo: string;
  ideia_original: string;
  score_total: number;
  metricas: Metricas;
  justificativa: string;
  plano_acao: PlanoAcao;
}

export interface ApiResponse {
  ranking: RankItem[];
}
