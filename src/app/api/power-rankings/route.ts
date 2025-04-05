import { NextResponse } from 'next/server';
import { fetchPowerRankings } from '@/services/powerRankingService';

interface PowerRankingTeam {
  rank: number;
  teamName: string;
  powerScore: number;
  winLoss: string;
  winRate: string;
  internationalEvents: string[];
}

// Dados mockados para teste
const mockRankings: PowerRankingTeam[] = [
  {
    rank: 1,
    teamName: 'Hanwha Life Esports',
    powerScore: 1582,
    winLoss: '15-3',
    winRate: '83.3%',
    internationalEvents: ['LCK Spring 2025', 'MSI 2025']
  },
  {
    rank: 2,
    teamName: 'T1',
    powerScore: 1581,
    winLoss: '14-4',
    winRate: '77.8%',
    internationalEvents: ['LCK Spring 2025', 'MSI 2025']
  },
  {
    rank: 3,
    teamName: 'Gen.G Esports',
    powerScore: 1580,
    winLoss: '13-5',
    winRate: '72.2%',
    internationalEvents: ['LCK Spring 2025', 'MSI 2025']
  },
  {
    rank: 4,
    teamName: 'BILIBILI GAMING DREAMSMART',
    powerScore: 1579,
    winLoss: '16-2',
    winRate: '88.9%',
    internationalEvents: ['LPL Spring 2025', 'MSI 2025']
  },
  {
    rank: 5,
    teamName: 'TOP ESPORTS',
    powerScore: 1578,
    winLoss: '15-3',
    winRate: '83.3%',
    internationalEvents: ['LPL Spring 2025', 'MSI 2025']
  },
  {
    rank: 6,
    teamName: 'G2 Esports',
    powerScore: 1577,
    winLoss: '14-4',
    winRate: '77.8%',
    internationalEvents: ['LEC Spring 2025', 'MSI 2025']
  },
  {
    rank: 7,
    teamName: 'Dplus KIA',
    powerScore: 1576,
    winLoss: '13-5',
    winRate: '72.2%',
    internationalEvents: ['LCK Spring 2025']
  },
  {
    rank: 8,
    teamName: 'WeiboGaming Faw Audi',
    powerScore: 1575,
    winLoss: '12-6',
    winRate: '66.7%',
    internationalEvents: ['LPL Spring 2025']
  },
  {
    rank: 9,
    teamName: 'Beijing JDG Intel Esports',
    powerScore: 1574,
    winLoss: '11-7',
    winRate: '61.1%',
    internationalEvents: ['LPL Spring 2025']
  },
  {
    rank: 10,
    teamName: 'FlyQuest',
    powerScore: 1573,
    winLoss: '10-8',
    winRate: '55.6%',
    internationalEvents: ['LCS Spring 2025']
  },
  {
    rank: 11,
    teamName: 'Team Liquid Honda',
    powerScore: 1572,
    winLoss: '9-9',
    winRate: '50.0%',
    internationalEvents: ['LCS Spring 2025']
  },
  {
    rank: 12,
    teamName: 'Talon',
    powerScore: 1571,
    winLoss: '9-9',
    winRate: '50.0%',
    internationalEvents: ['PCS Spring 2025']
  },
  {
    rank: 13,
    teamName: "Anyone's Legend",
    powerScore: 1570,
    winLoss: '8-10',
    winRate: '44.4%',
    internationalEvents: ['LPL Spring 2025']
  },
  {
    rank: 14,
    teamName: 'Karmine Corp',
    powerScore: 1569,
    winLoss: '8-10',
    winRate: '44.4%',
    internationalEvents: ['LEC Spring 2025']
  },
  {
    rank: 15,
    teamName: 'Cloud9',
    powerScore: 1568,
    winLoss: '7-11',
    winRate: '38.9%',
    internationalEvents: ['LCS Spring 2025']
  },
  {
    rank: 16,
    teamName: 'MAD Lions',
    powerScore: 1567,
    winLoss: '7-11',
    winRate: '38.9%',
    internationalEvents: ['LEC Spring 2025']
  },
  {
    rank: 17,
    teamName: 'DRX',
    powerScore: 1566,
    winLoss: '6-12',
    winRate: '33.3%',
    internationalEvents: ['LCK Spring 2025']
  },
  {
    rank: 18,
    teamName: 'SK Gaming',
    powerScore: 1565,
    winLoss: '6-12',
    winRate: '33.3%',
    internationalEvents: ['LEC Spring 2025']
  },
  {
    rank: 19,
    teamName: 'Fukuoka SoftBank HAWKS gaming',
    powerScore: 1564,
    winLoss: '5-13',
    winRate: '27.8%',
    internationalEvents: ['LJL Spring 2025']
  },
  {
    rank: 20,
    teamName: 'TEAM WHALE',
    powerScore: 1563,
    winLoss: '5-13',
    winRate: '27.8%',
    internationalEvents: ['VCS Spring 2025']
  },
  {
    rank: 21,
    teamName: 'Team Heretics',
    powerScore: 1562,
    winLoss: '4-14',
    winRate: '22.2%',
    internationalEvents: ['LEC Spring 2025']
  },
  {
    rank: 22,
    teamName: 'Shopify Rebellion',
    powerScore: 1561,
    winLoss: '4-14',
    winRate: '22.2%',
    internationalEvents: ['LCS Spring 2025']
  },
  {
    rank: 23,
    teamName: 'GIANTX',
    powerScore: 1560,
    winLoss: '3-15',
    winRate: '16.7%',
    internationalEvents: ['LEC Spring 2025']
  },
  {
    rank: 24,
    teamName: 'Royal Never Give Up',
    powerScore: 1559,
    winLoss: '3-15',
    winRate: '16.7%',
    internationalEvents: ['LPL Spring 2025']
  },
  {
    rank: 25,
    teamName: 'Dignitas',
    powerScore: 1558,
    winLoss: '2-16',
    winRate: '11.1%',
    internationalEvents: ['LCS Spring 2025']
  },
  {
    rank: 26,
    teamName: 'paiN Gaming',
    powerScore: 1557,
    winLoss: '2-16',
    winRate: '11.1%',
    internationalEvents: ['CBLOL Spring 2025']
  },
  {
    rank: 27,
    teamName: 'Isurus Estral',
    powerScore: 1556,
    winLoss: '1-17',
    winRate: '5.6%',
    internationalEvents: ['LLA Spring 2025']
  },
  {
    rank: 28,
    teamName: 'Ultra Prime',
    powerScore: 1555,
    winLoss: '1-17',
    winRate: '5.6%',
    internationalEvents: ['LPL Spring 2025']
  },
  {
    rank: 29,
    teamName: 'DetonatioN FocusMe',
    powerScore: 1554,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LJL Spring 2025']
  },
  {
    rank: 30,
    teamName: 'LOUD',
    powerScore: 1553,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['CBLOL Spring 2025']
  },
  {
    rank: 31,
    teamName: 'The Chiefs Esports Club',
    powerScore: 1552,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LCO Spring 2025']
  },
  {
    rank: 32,
    teamName: 'OKSavingsBank BRION',
    powerScore: 1551,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LCK Spring 2025']
  },
  {
    rank: 33,
    teamName: 'Rogue',
    powerScore: 1550,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LEC Spring 2025']
  },
  {
    rank: 34,
    teamName: 'RED Kalunga',
    powerScore: 1549,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['CBLOL Spring 2025']
  },
  {
    rank: 35,
    teamName: 'Vivo Keyd Stars',
    powerScore: 1548,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['CBLOL Spring 2025']
  },
  {
    rank: 36,
    teamName: 'FURIA',
    powerScore: 1547,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['CBLOL Spring 2025']
  },
  {
    rank: 37,
    teamName: 'Fluxo W7M',
    powerScore: 1546,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['CBLOL Spring 2025']
  },
  {
    rank: 38,
    teamName: 'LEVIATÁN',
    powerScore: 1545,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LLA Spring 2025']
  },
  {
    rank: 39,
    teamName: 'CTBC Flying Oyster',
    powerScore: 1544,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['PCS Spring 2025']
  },
  {
    rank: 40,
    teamName: 'Team Whale',
    powerScore: 1543,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['VCS Spring 2025']
  },
  {
    rank: 41,
    teamName: 'Fukuoka SoftBank HAWKS',
    powerScore: 1542,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LJL Spring 2025']
  },
  {
    rank: 42,
    teamName: 'Team Heretics',
    powerScore: 1541,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LEC Spring 2025']
  },
  {
    rank: 43,
    teamName: 'Shopify Rebellion',
    powerScore: 1540,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LCS Spring 2025']
  },
  {
    rank: 44,
    teamName: 'GIANTX',
    powerScore: 1539,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LEC Spring 2025']
  },
  {
    rank: 45,
    teamName: 'Royal Never Give Up',
    powerScore: 1538,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LPL Spring 2025']
  },
  {
    rank: 46,
    teamName: 'Dignitas',
    powerScore: 1537,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LCS Spring 2025']
  },
  {
    rank: 47,
    teamName: 'paiN Gaming',
    powerScore: 1536,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['CBLOL Spring 2025']
  },
  {
    rank: 48,
    teamName: 'Isurus',
    powerScore: 1535,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LLA Spring 2025']
  },
  {
    rank: 49,
    teamName: 'Ultra Prime',
    powerScore: 1534,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LPL Spring 2025']
  },
  {
    rank: 50,
    teamName: 'DetonatioN FocusMe',
    powerScore: 1533,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LJL Spring 2025']
  },
  {
    rank: 51,
    teamName: 'LOUD',
    powerScore: 1532,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['CBLOL Spring 2025']
  },
  {
    rank: 52,
    teamName: 'The Chiefs',
    powerScore: 1531,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LCO Spring 2025']
  },
  {
    rank: 53,
    teamName: 'BRION',
    powerScore: 1530,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LCK Spring 2025']
  },
  {
    rank: 54,
    teamName: 'Rogue',
    powerScore: 1529,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LEC Spring 2025']
  },
  {
    rank: 55,
    teamName: 'RED Canids',
    powerScore: 1528,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['CBLOL Spring 2025']
  },
  {
    rank: 56,
    teamName: 'Keyd Stars',
    powerScore: 1527,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['CBLOL Spring 2025']
  },
  {
    rank: 57,
    teamName: 'FURIA',
    powerScore: 1526,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['CBLOL Spring 2025']
  },
  {
    rank: 58,
    teamName: 'Fluxo',
    powerScore: 1525,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['CBLOL Spring 2025']
  },
  {
    rank: 59,
    teamName: 'LEVIATÁN',
    powerScore: 1524,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['LLA Spring 2025']
  },
  {
    rank: 60,
    teamName: 'CTBC Flying Oyster',
    powerScore: 1523,
    winLoss: '0-18',
    winRate: '0.0%',
    internationalEvents: ['PCS Spring 2025']
  }
];

export async function GET() {
  try {
    console.log('Iniciando busca dos Power Rankings...');
    const rankings = await fetchPowerRankings();
    
    // Simular um pequeno delay para parecer mais realista
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(rankings);
  } catch (error) {
    console.error('Erro ao buscar Power Rankings:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar os rankings. Por favor, tente novamente mais tarde.' },
      { status: 500 }
    );
  }
} 