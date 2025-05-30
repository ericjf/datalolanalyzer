import { PowerRankingTeam } from '@/types/powerRankings';
import { chromium } from 'playwright';
import OpenAI from 'openai';
import { leagues } from '../data/leagues';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Função para limpar o nome do time
function cleanTeamName(name: string): string {
  // Remove sufixos comuns de regiões e ligas
  const suffixesToRemove = [
    'LCK', 'LPL', 'LCS', 'LEC', 'LFL', 'LJL', 'PCS', 'VCS', 'CBLOL', 'LLA',
    'TESL', 'LTA', 'LCO', 'LCL', 'TCL', 'LPL', 'LMS', 'LST', 'LVP', 'LFL'
  ];

  let cleanName = name;
  
  // Remove sufixos de região/liga
  suffixesToRemove.forEach(suffix => {
    const regex = new RegExp(suffix + '$', 'i');
    cleanName = cleanName.replace(regex, '');
  });

  // Remove duplicações de nomes (ex: T1T1 -> T1)
  cleanName = cleanName.replace(/(.+?)\1+/g, '$1');

  // Remove abreviações comuns
  const abbreviationsToRemove = [
    'FLY', 'DIG', 'T', 'TES', 'JDG', 'EDG', 'RNG', 'WE', 'OMG', 'LNG',
    'RA', 'TT', 'UP', 'AL', 'IG', 'FPX', 'RW', 'V5', 'SN', 'BLG'
  ];

  abbreviationsToRemove.forEach(abbr => {
    const regex = new RegExp(abbr + '$', 'i');
    cleanName = cleanName.replace(regex, '');
  });

  // Remove espaços extras
  cleanName = cleanName.trim();

  // Casos especiais
  const specialCases: { [key: string]: string } = {
    'TOPESPORTSTESLPL': 'TOP ESPORTS',
    'T1T1LCK': 'T1',
    'FlyQuestFLYLTA': 'FlyQuest',
    'TeamLiquidLCS': 'Team Liquid',
    'Cloud9LCS': 'Cloud9',
    'EvilGeniusesLCS': 'Evil Geniuses',
    'NRGESPORTSLCS': 'NRG ESPORTS',
    '100ThievesLCS': '100 Thieves',
    'DignitasLCS': 'Dignitas',
    'ImmortalsLCS': 'Immortals',
    'G2ESPORTSLEC': 'G2 ESPORTS',
    'FnaticLEC': 'Fnatic',
    'MADLIONSLEAGUEOFLEGENDS': 'MAD LIONS',
    'TeamVitalityLEC': 'Team Vitality',
    'TeamBDSLEC': 'Team BDS',
    'SKGamingLEC': 'SK Gaming',
    'TeamHereticsLEC': 'Team Heretics',
    'KarmineCorpLEC': 'Karmine Corp',
    'ExcelLEC': 'Excel',
    'RogueLEC': 'Rogue',
    'KOILEC': 'KOI',
    'GiantXLEC': 'GiantX',
    'THUNDERTALKGAMINGT': 'THUNDER TALK GAMING',
    'Beijing': 'Beijing JDG Intel Esports',
    'SHANGHAI': 'SHANGHAI EDWARD GAMING',
    'TOPESPORTSTES': 'TOP ESPORTS',
    'FlyQuestFLY': 'FlyQuest',
    'DignitasDIG': 'Dignitas'
  };

  // Se o nome limpo estiver nos casos especiais, retorna o valor mapeado
  if (specialCases[cleanName]) {
    return specialCases[cleanName];
  }

  // Se o nome começar com "Beijing" ou "SHANGHAI", retorna o nome completo
  if (cleanName.startsWith('Beijing')) {
    return 'Beijing JDG Intel Esports';
  }
  if (cleanName.startsWith('SHANGHAI')) {
    return 'SHANGHAI EDWARD GAMING';
  }

  return cleanName;
}

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

    // Limpa os nomes dos times
    const cleanedRankings = rankings.map(ranking => ({
      ...ranking,
      teamName: cleanTeamName(ranking.teamName)
    }));

    console.log('Rankings extraídos com sucesso:', cleanedRankings.length);
    console.log('Primeiros 3 rankings:', JSON.stringify(cleanedRankings.slice(0, 3), null, 2));
    return cleanedRankings;

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