'use client';

import { useState } from 'react';
import { getTeamStats, TeamSideStats } from '../services/teamService';

interface Team {
  name: string;
  slug: string;
}

interface League {
  name: string;
  teams: Team[];
}

const leagues: League[] = [
  {
    name: 'LCK',
    teams: [
      { name: 'Gen.G', slug: 'geng' },
      { name: 'DRX', slug: 'dragonx' },
      { name: 'T1', slug: 't1' },
      { name: 'Hanwha Life Esports', slug: 'hanwha-life-esports' },
      { name: 'Dplus KIA', slug: 'dplus-kia' },
      { name: 'Nongshim Red Force', slug: 'nongshim-red-force' },
      { name: 'BNK FEARX', slug: 'fearx' },
      { name: 'DN Freecs', slug: 'dn-freecs' },
      { name: 'OKSavingsBank BRION', slug: 'fredit-brion' },
      { name: 'KT Rolster', slug: 'kt-rolster' }
    ]
  },
  {
    name: 'LTA Sul',
    teams: [
      { name: 'Leviatan Esports', slug: 'leviatan-esports-league-of-legends' },
      { name: 'FURIA Esports', slug: 'furia-uppercut' },
      { name: 'LOUD', slug: 'loud' },
      { name: 'RED Canids', slug: 'red-canids' },
      { name: 'paiN Gaming', slug: 'pain-gaming' },
      { name: 'Fluxo W7M', slug: 'fluxo-w7m' },
      { name: 'Vivo Keyd Stars', slug: 'vivo-keyd-stars' },
      { name: 'Isurus Estral', slug: 'isurus-estral' }
    ]
  },
  {
    name: 'LTA Norte',
    teams: [
      { name: 'FlyQuest', slug: 'flyquest' },
      { name: 'Cloud9', slug: 'cloud9' },
      { name: '100 Thieves', slug: '100-thieves' },
      { name: 'Disguised', slug: 'disguised-league-of-legends' },
      { name: 'Dignitas', slug: 'dignitas' },
      { name: 'Team Liquid', slug: 'liquid' },
      { name: 'LYON', slug: 'lyon' },
      { name: 'Shopify Rebellion', slug: 'shopify-rebellion-league-of-legends' }
    ]
  },
  {
    name: 'LEC',
    teams: [
      { name: 'SK Gaming', slug: 'sk-gaming' },
      { name: 'Karmine Corp', slug: 'karmine-corp-academy' },
      { name: 'Fnatic', slug: 'fnatic' },
      { name: 'Team Vitality', slug: 'vitality' },
      { name: 'Team Heretics', slug: 'team-heretics' },
      { name: 'BDS', slug: 'bds' },
      { name: 'G2 Esports', slug: 'g2-esports' },
      { name: 'Movistar KOI', slug: 'mad-lions-league-of-legends' },
      { name: 'GIANTX', slug: 'giantx' },
      { name: 'Rogue', slug: 'rogue' }
    ]
  },
  {
    name: 'LPL',
    teams: [
      { name: 'Top Esports', slug: 'top-esports' },
      { name: 'Invictus Gaming', slug: 'invictus-gaming' },
      { name: 'Weibo Gaming', slug: 'weibo-gaming-league-of-legends' },
      { name: 'Bilibili Gaming', slug: 'bilibili-gaming' },
      { name: 'Anyone\'s Legend', slug: 'anyone-s-legend' },
      { name: 'Team WE', slug: 'we' },
      { name: 'Ultra Prime', slug: 'ultra-prime' },
      { name: 'FunPlus Phoenix', slug: 'funplus-phoenix' },
      { name: 'JD Gaming', slug: 'qg-reapers' },
      { name: 'Ninjas in Pyjamas', slug: 'ninjas-in-pyjamas' },
      { name: 'ThunderTalk Gaming', slug: 'tt' },
      { name: 'LGD Gaming', slug: 'lgd-gaming' },
      { name: 'Royal Never Give Up', slug: 'royal-never-give-up' },
      { name: 'EDward Gaming', slug: 'edward-gaming' },
      { name: 'Oh My God', slug: 'omg' },
      { name: 'LNG Esports', slug: 'lng-esports' }
    ]
  }
];

export default function Home() {
  const [activeLeague, setActiveLeague] = useState(0);
  const [teamSlug, setTeamSlug] = useState('');
  const [gamesCount, setGamesCount] = useState(5);
  const [teamData, setTeamData] = useState<TeamSideStats[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTeamClick = async (slug: string, count?: number) => {
    setTeamSlug(slug);
    setLoading(true);
    setError(null);
    
    try {
      const data = await getTeamStats(slug, count || gamesCount);
      setTeamData(data);
    } catch (err) {
      setError('Erro ao buscar dados do time. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalStats = (data: TeamSideStats[]) => {
    return data.reduce((acc, side) => ({
      winners: acc.winners + side.winners,
      defeats: acc.defeats + side.defeats,
      total: acc.total + side.total,
      kills: acc.kills + side.kills,
      tower_kills: acc.tower_kills + side.tower_kills,
      dragon_kills: acc.dragon_kills + side.dragon_kills,
      baron_kills: acc.baron_kills + side.baron_kills,
      first_blood: acc.first_blood + side.first_blood,
      first_tower: acc.first_tower + side.first_tower,
      first_dragon: acc.first_dragon + side.first_dragon,
      first_baron: acc.first_baron + side.first_baron,
      vision_score: acc.vision_score + side.vision_score,
      gold: acc.gold + side.gold,
      damage: acc.damage + side.damage,
      cs: acc.cs + side.cs,
      assists: acc.assists + side.assists,
      deaths: acc.deaths + side.deaths,
      kda: acc.kda + side.kda,
      kill_participation: acc.kill_participation + side.kill_participation,
      damage_per_gold: acc.damage_per_gold + side.damage_per_gold,
      cs_per_minute: acc.cs_per_minute + side.cs_per_minute,
      gold_per_minute: acc.gold_per_minute + side.gold_per_minute,
      damage_per_minute: acc.damage_per_minute + side.damage_per_minute,
    }), {
      winners: 0, defeats: 0, total: 0, kills: 0, tower_kills: 0, dragon_kills: 0,
      baron_kills: 0, first_blood: 0, first_tower: 0, first_dragon: 0, first_baron: 0,
      vision_score: 0, gold: 0, damage: 0, cs: 0, assists: 0, deaths: 0, kda: 0,
      kill_participation: 0, damage_per_gold: 0, cs_per_minute: 0, gold_per_minute: 0,
      damage_per_minute: 0
    });
  };

  const renderTotalStats = (data: TeamSideStats[]) => {
    const totals = calculateTotalStats(data);
    const games = totals.total;

    return (
      <div className="p-4 bg-gray-100 rounded-md border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Estatísticas Gerais</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Vitórias/Derrotas</p>
            <p className="font-medium text-gray-800">{totals.winners}/{totals.defeats}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total de Jogos</p>
            <p className="font-medium text-gray-800">{games}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Kills (média)</p>
            <p className="font-medium text-gray-800">{(totals.kills / games).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Torres (média)</p>
            <p className="font-medium text-gray-800">{(totals.tower_kills / games).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Dragões (média)</p>
            <p className="font-medium text-gray-800">{(totals.dragon_kills / games).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Barões (média)</p>
            <p className="font-medium text-gray-800">{(totals.baron_kills / games).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">First Blood %</p>
            <p className="font-medium text-gray-800">{((totals.first_blood / games) * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">First Tower %</p>
            <p className="font-medium text-gray-800">{((totals.first_tower / games) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    );
  };

  const renderSideStats = (side: TeamSideStats) => {
    const isRedSide = side.name === 'red';
    const sideColor = isRedSide ? 'text-red-600' : 'text-blue-600';
    const bgColor = isRedSide ? 'bg-red-50' : 'bg-blue-50';
    const borderColor = isRedSide ? 'border-red-200' : 'border-blue-200';

    return (
      <div key={side.name} className={`p-4 ${bgColor} rounded-md border ${borderColor}`}>
        <h3 className={`text-lg font-semibold mb-3 ${sideColor}`}>
          {isRedSide ? 'Red Side' : 'Blue Side'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Vitórias/Derrotas</p>
            <p className="font-medium text-gray-800">{side.winners}/{side.defeats}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total de Jogos</p>
            <p className="font-medium text-gray-800">{side.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Kills (média)</p>
            <p className="font-medium text-gray-800">{(side.kills / side.total).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Torres (média)</p>
            <p className="font-medium text-gray-800">{(side.tower_kills / side.total).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Dragões (média)</p>
            <p className="font-medium text-gray-800">{(side.dragon_kills / side.total).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Barões (média)</p>
            <p className="font-medium text-gray-800">{(side.baron_kills / side.total).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">First Blood %</p>
            <p className="font-medium text-gray-800">{((side.first_blood / side.total) * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">First Tower %</p>
            <p className="font-medium text-gray-800">{((side.first_tower / side.total) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Datalol Analyzer
      </h1>
      
      <div className="w-full max-w-4xl space-y-8">
        {/* Abas das Ligas */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex border-b">
            {leagues.map((league, index) => (
              <button
                key={league.name}
                onClick={() => setActiveLeague(index)}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                  activeLeague === index
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>
          
          {/* Lista de Times */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leagues[activeLeague].teams.map((team) => (
                <button
                  key={team.slug}
                  onClick={() => handleTeamClick(team.slug)}
                  className="p-4 text-left bg-gray-50 rounded-md border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-800">{team.name}</h3>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Seletor de Número de Jogos */}
        {teamData && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <label htmlFor="gamesCount" className="block text-sm font-medium mb-2 text-gray-700">
              Número de Jogos
            </label>
            <select
              id="gamesCount"
              value={gamesCount}
              onChange={(e) => {
                const newGamesCount = Number(e.target.value);
                setGamesCount(newGamesCount);
                if (teamSlug) {
                  handleTeamClick(teamSlug, newGamesCount);
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              disabled={loading}
            >
              <option value="5">5 jogos</option>
              <option value="10">10 jogos</option>
              <option value="15">15 jogos</option>
              <option value="20">20 jogos</option>
            </select>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-600">Carregando dados do time...</p>
          </div>
        )}

        {teamData && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Estatísticas {leagues[activeLeague].teams.find(t => t.slug === teamSlug)?.name}
            </h2>
            {renderTotalStats(teamData)}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamData.map(renderSideStats)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
