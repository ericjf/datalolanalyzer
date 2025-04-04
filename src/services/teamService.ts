import { API_CONFIG } from '../config/api';

export interface TeamSideStats {
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

export type TeamStats = TeamSideStats[];

export async function getTeamStats(teamSlug: string, games: number = 5): Promise<TeamStats> {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.teamStats.replace('{teamSlug}', teamSlug)}?games=${games}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching team data:', error);
    throw error;
  }
} 