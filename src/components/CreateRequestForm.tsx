'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/Modal';

interface CreateRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const requestTypes = [
  { value: 'congé', label: '🏖️ Congé', color: 'from-orange-400 to-orange-500' },
  { value: 'formation', label: '📚 Formation', color: 'from-green-400 to-green-500' },
  { value: 'promotion', label: '⭐ Promotion', color: 'from-purple-400 to-purple-500' },
  { value: 'mutation', label: '🔄 Mutation', color: 'from-blue-400 to-blue-500' },
  { value: 'certificat', label: '📜 Certificat', color: 'from-red-400 to-red-500' },
];

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
      icon="📋"
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={loading}
      submitLabel="Envoyer la demande"
    >
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-6 flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Type de demande avec cards colorées */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📌</span> Type de demande *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {requestTypes.map((type) => (
              <button
                key={type.value}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type_demande: type.value }))
                }
                className={`p-2 rounded-lg font-medium text-sm transition-all ${
                  formData.type_demande === type.value
                    ? `bg-gradient-to-r ${type.color} text-white shadow-lg scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>💬</span> Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Détaillez votre demande..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500
          </p>
        </div>

        {/* Motivation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>🎯</span> Motivation
          </label>
          <textarea
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            placeholder="Justification ou contexte..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
          />
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700 flex gap-2">
          <span>ℹ️</span>
          <p>Votre demande sera examinée dans les 3 jours ouvrables.</p>
        </div>
      </div>
    </Modal>
  );
}
