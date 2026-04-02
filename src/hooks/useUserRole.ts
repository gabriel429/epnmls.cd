import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface UserWithRole {
  id: string;
  email: string;
  name: string;
  role: {
    id: number;
    name: string;
    description: string;
  } | null;
  agent: {
    id: number;
    prenom: string;
    nom: string;
    matricule?: string;
    fonction_id?: number;
    grade_id?: number;
    department_id?: number;
  } | null;
  is_super_admin: boolean;
}

export function useUserRole() {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: authUser, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Fetch user with role and agent info
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(
            `
            id,
            email,
            name,
            is_super_admin,
            role_id,
            agent_id,
            roles (id, name, description),
            agents (
              id,
              prenom,
              nom,
              matricule,
              fonction_id,
              grade_id,
              department_id
            )
          `
          )
          .eq('id', authUser.user.id)
          .single();

        if (userError) throw userError;

        // Handle relationship data
        const userWithRole: UserWithRole = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          is_super_admin: userData.is_super_admin,
          role: Array.isArray(userData.roles) ? userData.roles[0] || null : userData.roles || null,
          agent: userData.agents?.[0] || null,
        };

        setUser(userWithRole);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch user role:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const hasRole = (roleName: string) => {
    return user?.role?.name === roleName || user?.is_super_admin;
  };

  const isSuperAdmin = () => user?.is_super_admin || false;

  const isDashboardRole = (roleName: string[]) => {
    return roleName.includes(user?.role?.name || '') || user?.is_super_admin;
  };

  return { user, loading, error, hasRole, isSuperAdmin, isDashboardRole };
}
