import { NextResponse } from 'next/server';
import { getTeamStats } from '../../../../services/teamService';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const games = parseInt(searchParams.get('games') || '5');
    
    const data = await getTeamStats(params.slug, games);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas do time' },
      { status: 500 }
    );
  }
} 