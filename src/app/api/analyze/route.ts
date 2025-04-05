import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { TeamAnalysis, SideMatchupAnalysis } from '../../../services/openaiService';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

async function analyzeSideMatchup(
  team1Name: string,
  team2Name: string,
  team1Stats: any,
  team2Stats: any,
  team1Side: 'blue' | 'red',
  team2Side: 'blue' | 'red'
): Promise<SideMatchupAnalysis> {
  try {
    console.log(`API: Analisando confronto ${team1Name} (${team1Side}) vs ${team2Name} (${team2Side})`);
    
    const prompt = `
      Analise o confronto entre ${team1Name} (${team1Side}) vs ${team2Name} (${team2Side}) com base nas seguintes estatísticas:

      ${team1Name} (${team1Side}):
      ${JSON.stringify(team1Stats, null, 2)}

      ${team2Name} (${team2Side}):
      ${JSON.stringify(team2Stats, null, 2)}

      Por favor, forneça uma análise detalhada com:
      1. Número esperado de torres que cada time destruirá (baseado nas médias históricas)
      2. Número esperado de dragões que cada time conseguirá (baseado nas médias históricas)
      3. Número esperado de barões que cada time conseguirá (baseado nas médias históricas)
      4. Qual time é mais provável vencer esta partida
      5. Nível de confiança na sua previsão (0-100%)

      Responda em formato JSON com a seguinte estrutura:
      {
        "expectedTowers": { "team1": número, "team2": número },
        "expectedDragons": { "team1": número, "team2": número },
        "expectedBarons": { "team1": número, "team2": número },
        "expectedWinner": "nome do time",
        "confidence": número
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um analista especializado em League of Legends, com profundo conhecimento em estatísticas e estratégias do jogo. Responda sempre em formato JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    console.log(`API: Resposta recebida para ${team1Name} vs ${team2Name}`);
    
    if (!response) {
      throw new Error('Resposta vazia da OpenAI');
    }
    
    try {
      return JSON.parse(response);
    } catch (parseError) {
      console.error('API: Erro ao analisar JSON da resposta:', parseError);
      console.error('API: Resposta recebida:', response);
      throw new Error(`Erro ao analisar JSON da resposta: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
  } catch (error) {
    console.error(`API: Erro ao analisar confronto ${team1Name} vs ${team2Name}:`, error);
    // Retornar um objeto padrão em caso de erro
    return {
      expectedTowers: { team1: 0, team2: 0 },
      expectedDragons: { team1: 0, team2: 0 },
      expectedBarons: { team1: 0, team2: 0 },
      expectedWinner: "Não foi possível determinar",
      confidence: 0
    };
  }
}

export async function POST(request: Request) {
  try {
    console.log('API: Recebendo solicitação de análise');
    
    // Verificar se a chave da API está disponível
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      console.error('API: Chave da API OpenAI não encontrada');
      return NextResponse.json(
        { error: 'Chave da API OpenAI não configurada' },
        { status: 500 }
      );
    }
    
    const { team1Name, team2Name, team1Stats, team2Stats } = await request.json();
    console.log('API: Dados recebidos:', { team1Name, team2Name });

    // Análise geral
    const generalPrompt = `
      Analise a comparação entre os times ${team1Name} e ${team2Name} com base nas seguintes estatísticas:

      ${team1Name}:
      ${JSON.stringify(team1Stats, null, 2)}

      ${team2Name}:
      ${JSON.stringify(team2Stats, null, 2)}

      Por favor, forneça:
      1. Um resumo geral da comparação
      2. Pontos fortes de cada time
      3. Pontos fracos de cada time
      4. Recomendações estratégicas para cada time
    `;

    console.log('API: Enviando solicitação para OpenAI');
    
    const generalCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um analista especializado em League of Legends, com profundo conhecimento em estatísticas e estratégias do jogo."
        },
        {
          role: "user",
          content: generalPrompt
        }
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
    });

    console.log('API: Resposta recebida da OpenAI');
    
    const generalResponse = generalCompletion.choices[0].message.content;
    
    // Parse a resposta geral
    const analysis: TeamAnalysis = {
      summary: "",
      strengths: [],
      weaknesses: [],
      recommendations: [],
      sideAnalysis: {
        blueVsRed: await analyzeSideMatchup(team1Name, team2Name, team1Stats, team2Stats, 'blue', 'red'),
        redVsBlue: await analyzeSideMatchup(team1Name, team2Name, team1Stats, team2Stats, 'red', 'blue')
      }
    };

    if (generalResponse) {
      const sections = generalResponse.split('\n\n');
      
      sections.forEach(section => {
        if (section.toLowerCase().includes('resumo')) {
          analysis.summary = section.split(':')[1]?.trim() || '';
        } else if (section.toLowerCase().includes('fortes')) {
          analysis.strengths = section
            .split(':')[1]
            ?.split('\n')
            .map(item => item.trim())
            .filter(item => item) || [];
        } else if (section.toLowerCase().includes('fracos')) {
          analysis.weaknesses = section
            .split(':')[1]
            ?.split('\n')
            .map(item => item.trim())
            .filter(item => item) || [];
        } else if (section.toLowerCase().includes('recomendações')) {
          analysis.recommendations = section
            .split(':')[1]
            ?.split('\n')
            .map(item => item.trim())
            .filter(item => item) || [];
        }
      });
    }

    console.log('API: Análise concluída com sucesso');
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('API: Erro ao analisar times:', error);
    return NextResponse.json(
      { error: `Não foi possível realizar a análise dos times: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 