'use client';

import { useState } from 'react';
import { useTeamStats, useTeamDetails, useAllTeamsDetails } from '../../hooks/useTeamData';
import { TeamLogo } from '../../components/TeamLogo';
import { Navigation } from '../../components/Navigation';
import { leagues } from '../../data/leagues';

export default function ComparePage() {
  const [team1Slug, setTeam1Slug] = useState('');
  const [team2Slug, setTeam2Slug] = useState('');
  const [activeLeague, setActiveLeague] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { teamData: team1Data, isLoading: team1Loading } = useTeamStats(team1Slug, 10);
  const { teamData: team2Data, isLoading: team2Loading } = useTeamStats(team2Slug, 10);
  const { teamDetails: team1Details, isLoading: team1DetailsLoading } = useTeamDetails(team1Slug);
  const { teamDetails: team2Details, isLoading: team2DetailsLoading } = useTeamDetails(team2Slug);

  // Pré-carregar detalhes de todos os times
  const allTeams = leagues.flatMap(league => league.teams);
  const teamDetailsCache = useAllTeamsDetails(allTeams);

  const handleTeamSelect = (slug: string, isTeam1: boolean) => {
    if (isTeam1) {
      setTeam1Slug(slug);
    } else {
      setTeam2Slug(slug);
    }
    setError(null);
  };

  const loading = team1Loading || team2Loading || team1DetailsLoading || team2DetailsLoading;

  const renderComparison = () => {
    if (!team1Data || !team2Data) return null;

    const team1Totals = calculateTotalStats(team1Data);
    const team2Totals = calculateTotalStats(team2Data);
    const games = 10; // Número fixo de jogos para comparação

    return (
      <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time 1 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0">
                {team1Details?.team.image_url && (
                  <TeamLogo
                    src={team1Details.team.image_url}
                    alt={`Logo do ${team1Details.team.name}`}
                    className="w-12 h-12"
                  />
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {team1Details?.team.name || 'Time 1'}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatItem
                label="Vitórias/Derrotas"
                value={`${team1Totals.winners}/${team1Totals.defeats}`}
                comparison={team2Totals}
                compareField="winners"
                higherIsBetter={true}
              />
              <StatItem
                label="Kills (média)"
                value={(team1Totals.kills / games).toFixed(1)}
                comparison={team2Totals}
                compareField="kills"
                higherIsBetter={true}
              />
              <StatItem
                label="Torres (média)"
                value={(team1Totals.tower_kills / games).toFixed(1)}
                comparison={team2Totals}
                compareField="tower_kills"
                higherIsBetter={true}
              />
              <StatItem
                label="Dragões (média)"
                value={(team1Totals.dragon_kills / games).toFixed(1)}
                comparison={team2Totals}
                compareField="dragon_kills"
                higherIsBetter={true}
              />
              <StatItem
                label="Barões (média)"
                value={(team1Totals.baron_kills / games).toFixed(1)}
                comparison={team2Totals}
                compareField="baron_kills"
                higherIsBetter={true}
              />
              <StatItem
                label="First Blood %"
                value={((team1Totals.first_blood / games) * 100).toFixed(1)}
                comparison={team2Totals}
                compareField="first_blood"
                higherIsBetter={true}
                isPercentage={true}
              />
            </div>
          </div>

          {/* Time 2 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0">
                {team2Details?.team.image_url && (
                  <TeamLogo
                    src={team2Details.team.image_url}
                    alt={`Logo do ${team2Details.team.name}`}
                    className="w-12 h-12"
                  />
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {team2Details?.team.name || 'Time 2'}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatItem
                label="Vitórias/Derrotas"
                value={`${team2Totals.winners}/${team2Totals.defeats}`}
                comparison={team1Totals}
                compareField="winners"
                higherIsBetter={true}
              />
              <StatItem
                label="Kills (média)"
                value={(team2Totals.kills / games).toFixed(1)}
                comparison={team1Totals}
                compareField="kills"
                higherIsBetter={true}
              />
              <StatItem
                label="Torres (média)"
                value={(team2Totals.tower_kills / games).toFixed(1)}
                comparison={team1Totals}
                compareField="tower_kills"
                higherIsBetter={true}
              />
              <StatItem
                label="Dragões (média)"
                value={(team2Totals.dragon_kills / games).toFixed(1)}
                comparison={team1Totals}
                compareField="dragon_kills"
                higherIsBetter={true}
              />
              <StatItem
                label="Barões (média)"
                value={(team2Totals.baron_kills / games).toFixed(1)}
                comparison={team1Totals}
                compareField="baron_kills"
                higherIsBetter={true}
              />
              <StatItem
                label="First Blood %"
                value={((team2Totals.first_blood / games) * 100).toFixed(1)}
                comparison={team1Totals}
                compareField="first_blood"
                higherIsBetter={true}
                isPercentage={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      <Navigation />
      <h1 className="text-4xl font-bold mb-8 text-gray-900">
        Comparativo de Times
      </h1>
      
      <div className="w-full max-w-4xl space-y-8">
        {/* Seleção de Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Time 1 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Time 1</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {leagues.map((league, index) => (
                  <div key={league.name} className="space-y-2">
                    <button
                      onClick={() => setActiveLeague(index)}
                      className={`w-full text-left px-4 py-2 rounded font-medium ${
                        activeLeague === index ? 'bg-blue-50 text-blue-700' : 'text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {league.name}
                    </button>
                    {activeLeague === index && (
                      <div className="mt-2 space-y-2 pl-4">
                        {league.teams.map((team) => {
                          const teamDetail = teamDetailsCache.find(t => t.slug === team.slug);
                          return (
                            <button
                              key={team.slug}
                              onClick={() => handleTeamSelect(team.slug, true)}
                              className={`w-full text-left px-4 py-2 rounded flex items-center gap-3 ${
                                team1Slug === team.slug ? 'bg-blue-100 text-blue-800' : 'text-gray-900 hover:bg-gray-50'
                              }`}
                            >
                              {teamDetail?.details?.team.image_url && (
                                <div className="flex-shrink-0">
                                  <TeamLogo
                                    src={teamDetail.details.team.image_url}
                                    alt={`Logo do ${team.name}`}
                                    className="w-6 h-6"
                                  />
                                </div>
                              )}
                              <span className="truncate">{team.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Time 2 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Time 2</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {leagues.map((league, index) => (
                  <div key={league.name} className="space-y-2">
                    <button
                      onClick={() => setActiveLeague(index)}
                      className={`w-full text-left px-4 py-2 rounded font-medium ${
                        activeLeague === index ? 'bg-blue-50 text-blue-700' : 'text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {league.name}
                    </button>
                    {activeLeague === index && (
                      <div className="mt-2 space-y-2 pl-4">
                        {league.teams.map((team) => {
                          const teamDetail = teamDetailsCache.find(t => t.slug === team.slug);
                          return (
                            <button
                              key={team.slug}
                              onClick={() => handleTeamSelect(team.slug, false)}
                              className={`w-full text-left px-4 py-2 rounded flex items-center gap-3 ${
                                team2Slug === team.slug ? 'bg-blue-100 text-blue-800' : 'text-gray-900 hover:bg-gray-50'
                              }`}
                            >
                              {teamDetail?.details?.team.image_url && (
                                <div className="flex-shrink-0">
                                  <TeamLogo
                                    src={teamDetail.details.team.image_url}
                                    alt={`Logo do ${team.name}`}
                                    className="w-6 h-6"
                                  />
                                </div>
                              )}
                              <span className="truncate">{team.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-900">Carregando dados dos times...</p>
          </div>
        )}

        {team1Data && team2Data && renderComparison()}
      </div>
    </main>
  );
}

// Componente para exibir uma estatística com comparação
function StatItem({ 
  label, 
  value, 
  comparison, 
  compareField, 
  higherIsBetter = true,
  isPercentage = false 
}: { 
  label: string;
  value: string;
  comparison: any;
  compareField: string;
  higherIsBetter?: boolean;
  isPercentage?: boolean;
}) {
  const currentValue = parseFloat(value);
  const compareValue = isPercentage 
    ? (comparison[compareField] / 10) * 100 
    : comparison[compareField] / 10;
  
  const difference = currentValue - compareValue;
  const isBetter = higherIsBetter ? difference > 0 : difference < 0;
  
  return (
    <div className="p-2">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        <p className="font-semibold text-gray-900">{value}{isPercentage ? '%' : ''}</p>
        {difference !== 0 && (
          <span className={`text-sm font-medium ${isBetter ? 'text-green-600' : 'text-red-600'}`}>
            {difference > 0 ? '+' : ''}{difference.toFixed(1)}{isPercentage ? '%' : ''}
          </span>
        )}
      </div>
    </div>
  );
}

// Função auxiliar para calcular estatísticas totais
function calculateTotalStats(data: any[]) {
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
  }), {
    winners: 0, defeats: 0, total: 0, kills: 0, tower_kills: 0, dragon_kills: 0,
    baron_kills: 0, first_blood: 0, first_tower: 0, first_dragon: 0, first_baron: 0,
  });
}