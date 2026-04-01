'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/Modal';

interface CreateRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateRequestForm({
  isOpen,
  onClose,
  onSuccess,
}: CreateRequestFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type_demande: '',
    description: '',
    motivation: '',
  });

  const handleSubmit = async () => {
    if (!formData.type_demande || !formData.description) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Non authentifié');

      // Récupérer l'agent_id de l'utilisateur
      const { data: userData } = await supabase
        .from('users')
        .select('agent_id')
        .eq('id', user.user.id)
        .single();

      const { error: insertError } = await supabase
        .from('requests')
        .insert([
          {
            agent_id: userData?.agent_id,
            type_demande: formData.type_demande,
            description: formData.description,
            motivation: formData.motivation,
            statut: 'pending',
          },
        ]);

      if (insertError) throw insertError;

      setFormData({ type_demande: '', description: '', motivation: '' });
      onClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Nouvelle Demande"
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={loading}
    >
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de demande *
          </label>
          <select
            name="type_demande"
            value={formData.type_demande}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionner...</option>
            <option value="congé">Congé</option>
            <option value="formation">Formation</option>
            <option value="promotion">Promotion</option>
            <option value="mutation">Mutation</option>
            <option value="certificat">Certificat de travail</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Détaillez votre demande..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivation
          </label>
          <textarea
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            placeholder="Justification ou contexte..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </Modal>
  );
}
