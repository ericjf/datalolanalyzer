import { PowerRankingTeam } from '@/types/powerRankings';
import { chromium } from 'playwright';
import OpenAI from 'openai';
import { leagues } from '../data/leagues';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function fetchPowerRankings(): Promise<PowerRankingTeam[]> {
  console.log('Iniciando busca dos Power Rankings...');
  
  try {
    // Inicializa o Playwright com configurações específicas
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox'],
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    });
    console.log('Navegador iniciado com sucesso');

    const context = await browser.newContext();
    const page = await context.newPage();

    // Configura headers para simular um navegador real
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    });

    // Acessa a página
    console.log('Acessando página...');
    await page.goto('https://lolesports.com/pt-BR/gpr/2025', {
      waitUntil: 'networkidle',
      timeout: 60000 // Aumentado para 60 segundos
    });
    console.log('Página carregada');

    // Espera a tabela de rankings carregar
    console.log('Aguardando tabela...');
    await page.waitForSelector('table', { timeout: 60000 });
    console.log('Tabela encontrada');

    // Extrai os dados diretamente da tabela
    const rankings = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));
      console.log(`Encontradas ${rows.length} linhas na tabela`);
      
      return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        console.log(`Processando linha com ${cells.length} células`);
        
        // Extrai o rank (remove o hífen se existir)
        const rankText = cells[0]?.textContent?.trim() || '0';
        const rank = parseInt(rankText.replace('-', ''));
        
        // Extrai o nome do time (remove a região se existir)
        const teamName = cells[1]?.textContent?.trim().split(' ')[0] || '';
        
        // Extrai a pontuação (remove "pts" e converte para número)
        const scoreText = cells[2]?.textContent?.trim() || '0';
        const powerScore = parseInt(scoreText.replace('pts', '').trim());
        
        // Extrai o recorde (formato: "15-3(,833)")
        const recordText = cells[3]?.textContent?.trim() || '0-0(,000)';
        const [winLoss, winRate] = recordText.split('(');
        
        // Extrai os eventos internacionais
        const eventsText = cells[4]?.textContent?.trim() || '';
        const internationalEvents = eventsText
          .split(',')
          .map(e => e.trim())
          .filter(e => e && e !== '-');

        console.log(`Time processado: ${teamName} (${rank}) - ${powerScore} pts`);
        
        return {
          rank,
          teamName,
          powerScore,
          winLoss: winLoss.trim(),
          winRate: winRate ? winRate.replace(')', '').trim() : '0%',
          internationalEvents
        };
      });
    });

    // Fecha o navegador
    await browser.close();
    console.log('Navegador fechado');

    if (rankings.length === 0) {
      throw new Error('Nenhum ranking encontrado');
    }

    console.log('Rankings extraídos com sucesso:', rankings.length);
    console.log('Primeiros 3 rankings:', rankings.slice(0, 3));
    return rankings;

  } catch (error) {
    console.error('Erro ao buscar Power Rankings:', error);
    throw error;
  }
}

function identifyRegion(teamName: string): string {
  // Mapeamento de regiões baseado nos times conhecidos
  const regionMap: { [key: string]: string } = {
    'T1': 'LCK',
    'Gen.G': 'LCK',
    'HLE': 'LCK',
    'BILIBILI GAMING': 'LPL',
    'TOP ESPORTS': 'LPL',
    'G2': 'LEC',
    'Dplus KIA': 'LCK',
    'WeiboGaming': 'LPL',
    'JDG': 'LPL',
    'FlyQuest': 'LCS',
    'Team Liquid': 'LCS',
    'Talon': 'PCS',
    'Karmine Corp': 'LEC',
  };

  // Procurar por correspondências parciais
  for (const [key, region] of Object.entries(regionMap)) {
    if (teamName.includes(key)) {
      return region;
    }
  }

  return 'Unknown';
}

function findTeamSlug(teamName: string): string | undefined {
  // Buscar em todas as ligas
  for (const league of leagues) {
    for (const team of league.teams) {
      // Verificar correspondência exata ou parcial
      if (teamName.toLowerCase().includes(team.name.toLowerCase()) || 
          team.name.toLowerCase().includes(teamName.toLowerCase())) {
        return team.slug;
      }
    }
  }
  return undefined;
} 