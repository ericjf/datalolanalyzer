'use client';

import { useEffect, useState } from 'react';
import { PowerRankingTeam } from '@/types/powerRankings';
import { Navigation } from '@/components/Navigation';

export default function PowerRankingsPage() {
  const [rankings, setRankings] = useState<PowerRankingTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRankings = async () => {
      try {
        const response = await fetch('/api/power-rankings');
        if (!response.ok) {
          throw new Error('Erro ao carregar os rankings');
        }
        const data = await response.json();
        setRankings(data);
      } catch (err) {
        setError('Erro ao carregar os rankings. Por favor, tente novamente mais tarde.');
        console.error('Erro ao carregar rankings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Power Rankings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Ranking oficial dos times de League of Legends
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="px-4 py-5 sm:px-6">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pontuação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recorde
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eventos Internacionais
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rankings.map((team) => (
                    <tr key={team.rank} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {team.rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-gray-900">{team.teamName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {team.powerScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {team.winLoss} ({team.winRate})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {team.internationalEvents.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 