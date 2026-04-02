import { supabase } from '@/lib/supabase';
import type { User, Agent } from '@/lib/types';

export const authService = {
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return data;
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (!data.session?.user) return null;

    return data.session.user;
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      callback(session?.user as unknown as User | null);
    });
  },
};

export const agentService = {
  async getAgents() {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    return data as Agent[];
  },

  async getAgent(id: number) {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Agent;
  },

  async createAgent(agentData: Partial<Agent>) {
    const { data, error } = await supabase
      .from('agents')
      .insert([agentData])
      .select()
      .single();

    if (error) throw error;
    return data as Agent;
  },

  async updateAgent(id: number, agentData: Partial<Agent>) {
    const { data, error } = await supabase
      .from('agents')
      .update(agentData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Agent;
  },

  async deleteAgent(id: number) {
    const { error } = await supabase
      .from('agents')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  },
};

export const requestService = {
  async getRequests() {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) return [];

    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .or(
        `agent_id.eq.${user.user.id},approver_id.eq.${user.user.id}`
      );

    if (error) throw error;
    return data;
  },

  async createRequest(requestData: any) {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('requests')
      .insert([
        {
          ...requestData,
          agent_id: user.user.id,
          statut: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async approveRequest(id: number) {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('requests')
      .update({
        statut: 'approved',
        approver_id: user.user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async rejectRequest(id: number, reason: string) {
    const { data, error } = await supabase
      .from('requests')
      .update({
        statut: 'rejected',
        rejection_reason: reason,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export const documentService = {
  async getDocuments() {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) return [];

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .or(
        `agent_id.eq.${user.user.id},is_public.eq.true`
      );

    if (error) throw error;
    return data;
  },

  async uploadDocument(file: File, metadata: any) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: user } = await supabase.auth.getUser();

    const { data, error: insertError } = await supabase
      .from('documents')
      .insert([
        {
          ...metadata,
          agent_id: user.user?.id,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;
    return data;
  },

  async getDocumentUrl(filePath: string) {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};

export const pointageService = {
  async getPointages() {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) return [];

    const { data, error } = await supabase
      .from('pointages')
      .select('*')
      .eq('agent_id', user.user.id);

    if (error) throw error;
    return data;
  },

  async createPointage(data: any) {
    const { data: user } = await supabase.auth.getUser();

    const { data: result, error } = await supabase
      .from('pointages')
      .insert([
        {
          ...data,
          agent_id: user.user?.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return result;
  },
};

export const dashboardService = {
  async getStats() {
    const response = await fetch('/api/dashboard/stats');
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};

export const departmentService = {
  async getDepartments() {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    return data;
  },
};

export const functionService = {
  async getFunctions() {
    const { data, error } = await supabase
      .from('fonctions')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    return data;
  },
};

export const gradeService = {
  async getGrades() {
    const { data, error } = await supabase
      .from('grades')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    return data;
  },
};
