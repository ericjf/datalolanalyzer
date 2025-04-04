import { NextResponse } from 'next/server';
import { getTeamDetails } from '../../../../services/teamService';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await getTeamDetails(params.slug);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar detalhes do time' },
      { status: 500 }
    );
  }
} 