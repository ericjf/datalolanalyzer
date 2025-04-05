import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Permitir uso no browser
});

export interface TeamAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  sideAnalysis: {
    blueVsRed: SideMatchupAnalysis;
    redVsBlue: SideMatchupAnalysis;
  };
}

export interface SideMatchupAnalysis {
  expectedTowers: {
    team1: number;
    team2: number;
  };
  expectedDragons: {
    team1: number;
    team2: number;
  };
  expectedBarons: {
    team1: number;
    team2: number;
  };
  expectedWinner: string;
  confidence: number; // 0-100%
}

export async function analyzeTeamComparison(
  team1Name: string,
  team2Name: string,
  team1Stats: any,
  team2Stats: any
): Promise<TeamAnalysis> {
  try {
    console.log('Iniciando análise dos times:', team1Name, team2Name);
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        team1Name,
        team2Name,
        team1Stats,
        team2Stats,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro na resposta da API:', response.status, errorData);
      throw new Error(`Falha na análise dos times: ${response.status} ${response.statusText}`);
    }

    const analysis = await response.json();
    console.log('Análise recebida com sucesso:', analysis);
    return analysis;
  } catch (error) {
    console.error('Erro ao analisar times:', error);
    throw new Error(`Não foi possível realizar a análise dos times: ${error instanceof Error ? error.message : String(error)}`);
  }
} 