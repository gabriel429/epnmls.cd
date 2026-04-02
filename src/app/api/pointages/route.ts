import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * GET /api/pointages
 * Fetch user pointages (attendance records)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent_id');

    let query = supabase
      .from('pointages')
      .select(
        `
        id,
        agent_id,
        date_pointage,
        heure_arrivee,
        heure_depart,
        statut,
        justification,
        created_at,
        updated_at
      `
      );

    if (agentId) {
      query = query.eq('agent_id', agentId);
    } else {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        query = query.eq('agent_id', userData.user.id);
      }
    }

    const { data, error } = await query.order('date_pointage', {
      ascending: false,
    });

    if (error) throw error;

    return NextResponse.json({ data, count: data?.length || 0 });
  } catch (error) {
    console.error('Pointages fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pointages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pointages
 * Create or update a pointage record
 */
export async function POST(request: Request) {
  try {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Check if pointage exists for this date
    const { data: existing } = await supabase
      .from('pointages')
      .select('id')
      .eq('agent_id', userData.user.id)
      .eq('date_pointage', body.date_pointage)
      .single();

    let result;
    let error;

    if (existing) {
      // Update existing
      ({ data: result, error } = await supabase
        .from('pointages')
        .update(body)
        .eq('id', existing.id)
        .select()
        .single());
    } else {
      // Create new
      ({ data: result, error } = await supabase
        .from('pointages')
        .insert([
          {
            ...body,
            agent_id: userData.user.id,
          },
        ])
        .select()
        .single());
    }

    if (error) throw error;

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Pointage operation error:', error);
    return NextResponse.json(
      { error: 'Failed to save pointage' },
      { status: 500 }
    );
  }
}
