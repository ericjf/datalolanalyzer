import { API_CONFIG } from '../config/api';
import teamsData from '../data/teams.json';

export interface TeamSideStats {
  side: 'blue' | 'red';
  name: string;
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
  vision_score: number;
  gold: number;
  damage: number;
  cs: number;
  assists: number;
  deaths: number;
  kda: number;
  kill_participation: number;
  damage_per_gold: number;
  cs_per_minute: number;
  gold_per_minute: number;
  damage_per_minute: number;
}

export interface Team {
  name: string;
  slug: string;
  region: string;
  isActive: boolean;
}

export type TeamStats = TeamSideStats[];

export const getTeamStats = async (teamSlug: string, games: number = 5): Promise<TeamStats> => {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.teamStats.replace('{teamSlug}', teamSlug)}?games=${games}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar dados do time');
  }
  
  const data = await response.json();
  return data.map((stat: any) => ({
    ...stat,
    side: stat.name === 'red' ? 'red' : 'blue'
  }));
};

export const getAllTeams = (): Team[] => {
  return teamsData.teams;
};

export const getTeamBySlug = (slug: string): Team | undefined => {
  return teamsData.teams.find(team => team.slug === slug);
};

export const validateTeamSlug = async (slug: string): Promise<boolean> => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.teamStats.replace('{teamSlug}', slug)}?games=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Se retornar um array, significa que o time existe
    return Array.isArray(data);
  } catch (error) {
    return false;
  }
};

export const addTeam = async (name: string, slug: string, region: string): Promise<boolean> => {
  // Primeiro valida se o time existe na API
  const isValid = await validateTeamSlug(slug);
  if (!isValid) {
    return false;
  }

  // Verifica se o time já existe no nosso banco
  const existingTeam = getTeamBySlug(slug);
  if (existingTeam) {
    return false;
  }

  // Adiciona o novo time
  const newTeam: Team = {
    name,
    slug,
    region,
    isActive: true
  };

  teamsData.teams.push(newTeam);
  return true;
};

export interface TeamInfo {
  name: string;
  slug: string;
}

export async function getTeamInfo(teamSlug: string): Promise<TeamInfo> {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.teamStats.replace('{teamSlug}', teamSlug)}?games=1`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro ao buscar informações do time');
    }
    const data = await response.json();
    // O nome do time está no primeiro item do array
    return {
      name: data[0]?.team_name || teamSlug,
      slug: teamSlug
    };
  } catch (error) {
    console.error('Erro ao buscar informações do time:', error);
    // Em caso de erro, retorna o slug como nome
    return {
      name: teamSlug,
      slug: teamSlug
    };
  }
}

export const getTeamLogoUrl = (teamSlug: string): string => {
  return `${API_CONFIG.baseUrl}/team/${teamSlug}/logo`;
};

export interface TeamDetails {
  team: {
    name: string;
    slug: string;
    image_url: string;
  };
}

export const getTeamDetails = async (teamSlug: string): Promise<TeamDetails> => {
  const url = `${API_CONFIG.baseUrl}/stats/series/league-of-legends-lpl-china-split-2-2025/teams/${teamSlug}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar detalhes do time');
  }
  
  const data = await response.json();
  return data;
}; 