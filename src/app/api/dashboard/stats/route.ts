import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * GET /api/dashboard/stats
 * Fetch dashboard statistics (agent count, requests, etc.)
 */
export async function GET() {
  try {
    // Count active agents
    const { count: agentCount, error: agentError } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (agentError) throw agentError;

    // Count pending requests
    const { count: requestCount, error: requestError } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .eq('statut', 'pending');

    if (requestError) throw requestError;

    // Count assigned tasks
    const { count: taskCount, error: taskError } = await supabase
      .from('taches')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'in_progress']);

    if (taskError) throw taskError;

    // Count unread notifications
    const { data: userData } = await supabase.auth.getUser();
    const { count: notificationCount, error: notificationError } = await supabase
      .from('notifications_portail')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', userData.user?.id || '')
      .eq('is_read', false);

    if (notificationError) throw notificationError;

    return NextResponse.json({
      agents: agentCount || 0,
      requests: requestCount || 0,
      tasks: taskCount || 0,
      notifications: notificationCount || 0,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
