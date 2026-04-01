'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/Modal';

interface CreatePointageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePointageForm({
  isOpen,
  onClose,
  onSuccess,
}: CreatePointageFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    agent_id: '',
    date_pointage: new Date().toISOString().split('T')[0],
    heure_arrivee: '',
    heure_depart: '',
    statut: 'present',
    justification: '',
  });

  const handleSubmit = async () => {
    if (!formData.agent_id) {
      setError('Veuillez sélectionner un agent');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: insertError } = await supabase
        .from('pointages')
        .insert([
          {
            agent_id: parseInt(formData.agent_id),
            date_pointage: formData.date_pointage,
            heure_arrivee: formData.heure_arrivee || null,
            heure_depart: formData.heure_depart || null,
            statut: formData.statut,
            justification: formData.justification || null,
          },
        ]);

      if (insertError) throw insertError;

      setFormData({
        agent_id: '',
        date_pointage: new Date().toISOString().split('T')[0],
        heure_arrivee: '',
        heure_depart: '',
        statut: 'present',
        justification: '',
      });
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
      title="Saisir un Pointage"
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
            Agent *
          </label>
          <input
            type="number"
            name="agent_id"
            value={formData.agent_id}
            onChange={handleChange}
            placeholder="ID de l'agent"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            name="date_pointage"
            value={formData.date_pointage}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heure arrivée
            </label>
            <input
              type="time"
              name="heure_arrivee"
              value={formData.heure_arrivee}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heure départ
            </label>
            <input
              type="time"
              name="heure_depart"
              value={formData.heure_depart}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            name="statut"
            value={formData.statut}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="present">Présent</option>
            <option value="absent">Absent</option>
            <option value="late">En retard</option>
            <option value="justified">Justifié</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Justification
          </label>
          <textarea
            name="justification"
            value={formData.justification}
            onChange={handleChange}
            placeholder="Si besoin..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </Modal>
  );
}
