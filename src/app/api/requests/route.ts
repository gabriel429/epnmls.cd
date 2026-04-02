import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * GET /api/requests
 * Fetch user requests and requests awaiting user approval
 */
export async function GET() {
  try {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return NextResponse.json({ data: [] });
    }

    const { data, error } = await supabase
      .from('requests')
      .select(
        `
        id,
        agent_id,
        type_demande,
        statut,
        description,
        details,
        approver_id,
        approved_at,
        rejection_reason,
        due_date,
        priority,
        created_at,
        updated_at
      `
      )
      .or(
        `agent_id.eq.${userData.user.id},approver_id.eq.${userData.user.id}`
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data, count: data?.length || 0 });
  } catch (error) {
    console.error('Requests fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/requests
 * Create a new request
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

    const { data, error } = await supabase
      .from('requests')
      .insert([
        {
          ...body,
          agent_id: userData.user.id,
          statut: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Request creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}
