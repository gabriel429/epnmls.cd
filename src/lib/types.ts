export interface Agent {
  id: number;
  matricule?: string;
  prenom: string;
  nom: string;
  sexe?: 'M' | 'F';
  date_naissance?: string;
  email?: string;
  telephone?: string;
  fonction_id?: number;
  grade_id?: number;
  institution_id?: number;
  province_id?: number;
  role_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  agent_id?: number;
  name: string;
  is_super_admin: boolean;
  frozen?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  module?: string;
  action?: string;
  is_active: boolean;
}

export interface Request {
  id: number;
  agent_id: number;
  type_demande: string;
  statut: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  description?: string;
  details?: Record<string, any>;
  approver_id?: number;
  approved_at?: string;
  rejection_reason?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  agent_id?: number;
  categorie_id?: number;
  name: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  date_document?: string;
  expiration_date?: string;
  description?: string;
  is_public: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pointage {
  id: number;
  agent_id: number;
  date_pointage: string;
  heure_arrivee?: string;
  heure_depart?: string;
  statut?: string;
  justification?: string;
  created_at: string;
  updated_at: string;
}

export interface Tache {
  id: number;
  title: string;
  description?: string;
  assigned_to?: number;
  created_by?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high';
  due_date?: string;
  completed_at?: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  agent_id: number;
  title: string;
  message?: string;
  type?: string;
  related_id?: number;
  related_type?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}
