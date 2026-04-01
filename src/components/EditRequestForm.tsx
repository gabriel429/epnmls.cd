'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/Modal';
import type { Request } from '@/lib/types';

interface EditRequestFormProps {
  isOpen: boolean;
  request: Request | null;
  onClose: () => void;
  onSuccess: () => void;
}

const requestTypes = [
  { value: 'congé', label: '🏖️ Congé' },
  { value: 'formation', label: '📚 Formation' },
  { value: 'promotion', label: '⭐ Promotion' },
  { value: 'mutation', label: '🔄 Mutation' },
  { value: 'certificat', label: '📜 Certificat' },
];

const statusOptions = [
  { value: 'pending', label: '⏳ En attente' },
  { value: 'approved', label: '✅ Approuvée' },
  { value: 'rejected', label: '❌ Rejetée' },
  { value: 'completed', label: '🎉 Complétée' },
];

export function EditRequestForm({
  isOpen,
  request,
  onClose,
  onSuccess,
}: EditRequestFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type_demande: '',
    description: '',
    statut: 'pending',
  });

  useEffect(() => {
    if (request) {
      setFormData({
        type_demande: request.type_demande,
        description: request.description || '',
        statut: request.statut,
      });
    }
  }, [request]);

  const handleSubmit = async () => {
    if (!request) return;

    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('requests')
        .update({
          type_demande: formData.type_demande,
          description: formData.description,
          statut: formData.statut,
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      onClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
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

  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Éditer Demande"
      icon="✏️"
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={loading}
      submitLabel="Mettre à jour"
    >
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-6 flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📌 Type
          </label>
          <select
            name="type_demande"
            value={formData.type_demande}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {requestTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💬 Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🎯 Statut
          </label>
          <select
            name="statut"
            value={formData.statut}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}
