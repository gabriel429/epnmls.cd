import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * GET /api/agents
 * Fetch all active agents
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select(
        `
        id,
        matricule,
        prenom,
        nom,
        email,
        telephone,
        fonction_id,
        grade_id,
        department_id,
        province_id,
        statut_emploi,
        date_embauche,
        is_active,
        created_at,
        updated_at
      `
      )
      .eq('is_active', true)
      .order('nom', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data, count: data?.length || 0 });
  } catch (error) {
    console.error('Agents fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents
 * Create a new agent
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('agents')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Agent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
