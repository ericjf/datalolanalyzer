'use client';

import { useState } from 'react';
import { getTeamStats, TeamSideStats } from '../services/teamService';

export default function Home() {
  const [teamSlug, setTeamSlug] = useState('');
  const [gamesCount, setGamesCount] = useState(5);
  const [teamData, setTeamData] = useState<TeamSideStats[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const data = await getTeamStats(teamSlug, gamesCount);
      setTeamData(data);
    } catch (err) {
      setError('Erro ao buscar dados do time. Verifique o slug e tente novamente.');
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
      
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="teamSlug" className="block text-sm font-medium mb-2 text-gray-700">
                Nome do Time (Slug)
              </label>
              <input
                type="text"
                id="teamSlug"
                value={teamSlug}
                onChange={(e) => setTeamSlug(e.target.value)}
                placeholder="Ex: t1"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="gamesCount" className="block text-sm font-medium mb-2 text-gray-700">
                Número de Jogos
              </label>
              <select
                id="gamesCount"
                value={gamesCount}
                onChange={(e) => setGamesCount(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                disabled={loading}
              >
                <option value="5">5 jogos</option>
                <option value="10">10 jogos</option>
                <option value="15">15 jogos</option>
                <option value="20">20 jogos</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Buscar Dados'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {teamData && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Estatísticas do Time</h2>
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
