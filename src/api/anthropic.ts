import type { ApiResponse } from "../types";
import { analyzeIdeasFn } from "../server/analyze";

export async function analyzeIdeas(ideas: string[]): Promise<ApiResponse> {
  return analyzeIdeasFn({ data: { ideas } });
}
