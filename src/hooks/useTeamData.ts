import useSWR from 'swr';
import { getTeamStats, getTeamDetails, TeamSideStats, TeamDetails } from '../services/teamService';

const CACHE_TIME = 60 * 60 * 1000; // 1 hora em milissegundos

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro ao buscar dados');
  }
  return response.json();
};

interface TeamSideStats {
  side: 'blue' | 'red';
  winners: number;
  defeats: number;
  total: number;
  kills: number;
  tower_kills: number;
  dragon_kills: number;
  baron_kills: number;
  first_blood: number;
  first_tower: number;
  first_dragon: number;
  first_baron: number;
}

export function useTeamStats(teamSlug: string, games: number = 5) {
  const { data, error, isLoading } = useSWR<TeamSideStats[]>(
    teamSlug ? `/api/team-stats/${teamSlug}?games=${games}` : null,
    () => getTeamStats(teamSlug, games),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: CACHE_TIME,
    }
  );

  return {
    teamData: data,
    isLoading,
    isError: error,
  };
}

export function useTeamDetails(teamSlug: string) {
  const { data, error, isLoading } = useSWR<TeamDetails>(
    teamSlug ? `/api/team-details/${teamSlug}` : null,
    () => getTeamDetails(teamSlug),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: CACHE_TIME,
    }
  );

  return {
    teamDetails: data,
    isLoading,
    isError: error,
  };
}

// Hook para pré-carregar os detalhes de todos os times
export function useAllTeamsDetails(teams: { slug: string }[]) {
  const results = teams.map(team => {
    const { teamDetails, isLoading, isError } = useTeamDetails(team.slug);
    return {
      slug: team.slug,
      details: teamDetails,
      isLoading,
      error: isError
    };
  });

  return results;
} 