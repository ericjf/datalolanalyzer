'use client';

import { useState } from 'react';
import { useTeamStats, useTeamDetails, useAllTeamsDetails } from '../../hooks/useTeamData';
import { TeamLogo } from '../../components/TeamLogo';
import { Navigation } from '../../components/Navigation';
import { leagues } from '../../data/leagues';
import { TeamSideStats } from '../../services/teamService';

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

    // Separar estatísticas por lado
    const team1BlueSide = team1Data.find(side => side.side === 'blue') || {} as any;
    const team1RedSide = team1Data.find(side => side.side === 'red') || {} as any;
    const team2BlueSide = team2Data.find(side => side.side === 'blue') || {} as any;
    const team2RedSide = team2Data.find(side => side.side === 'red') || {} as any;

    // Função para renderizar estatísticas de um lado
    const renderSideStats = (side: any, title: string) => {
      const games = side.total || 5;
      
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Vitórias/Derrotas</p>
              <p className="font-medium text-gray-900">{side.winners || 0}/{side.defeats || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Jogos</p>
              <p className="font-medium text-gray-900">{games}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Kills (média)</p>
              <p className="font-medium text-gray-900">{((side.kills || 0) / games).toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Torres (média)</p>
              <p className="font-medium text-gray-900">{((side.tower_kills || 0) / games).toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dragões (média)</p>
              <p className="font-medium text-gray-900">{((side.dragon_kills || 0) / games).toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Barões (média)</p>
              <p className="font-medium text-gray-900">{((side.baron_kills || 0) / games).toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">First Blood %</p>
              <p className="font-medium text-gray-900">{((side.first_blood || 0) / games * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">First Tower %</p>
              <p className="font-medium text-gray-900">{((side.first_tower || 0) / games * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">First Dragon %</p>
              <p className="font-medium text-gray-900">{((side.first_dragon || 0) / games * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">First Baron %</p>
              <p className="font-medium text-gray-900">{((side.first_baron || 0) / games * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="mt-8 space-y-6">
        {/* Time 1 */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0">
              {team1Details?.team.image_url && (
                <TeamLogo
                  src={team1Details.team.image_url}
                  alt={`Logo do ${team1Details.team.name}`}
                  className="w-12 h-12"
                />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {team1Details?.team.name || 'Time 1'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderSideStats(team1BlueSide, 'Blue Side')}
            {renderSideStats(team1RedSide, 'Red Side')}
          </div>
        </div>

        {/* Time 2 */}
        <div className="space-y-6 mt-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0">
              {team2Details?.team.image_url && (
                <TeamLogo
                  src={team2Details.team.image_url}
                  alt={`Logo do ${team2Details.team.name}`}
                  className="w-12 h-12"
                />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {team2Details?.team.name || 'Time 2'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderSideStats(team2RedSide, 'Red Side')}
            {renderSideStats(team2BlueSide, 'Blue Side')}
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