'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/Modal';
import type { Pointage } from '@/lib/types';

interface EditPointageFormProps {
  isOpen: boolean;
  pointage: Pointage | null;
  onClose: () => void;
  onSuccess: () => void;
}

const statusOptions = [
  { value: 'present', label: '✅ Présent', color: 'from-green-400 to-green-500' },
  { value: 'absent', label: '❌ Absent', color: 'from-red-400 to-red-500' },
  { value: 'late', label: '⏱️ En retard', color: 'from-yellow-400 to-yellow-500' },
  { value: 'justified', label: '📝 Justifié', color: 'from-blue-400 to-blue-500' },
];

export function EditPointageForm({
  isOpen,
  pointage,
  onClose,
  onSuccess,
}: EditPointageFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    agent_id: '',
    date_pointage: '',
    heure_arrivee: '',
    heure_depart: '',
    statut: 'present',
    justification: '',
  });

  useEffect(() => {
    if (pointage) {
      setFormData({
        agent_id: pointage.agent_id.toString(),
        date_pointage: pointage.date_pointage,
        heure_arrivee: pointage.heure_arrivee || '',
        heure_depart: pointage.heure_depart || '',
        statut: pointage.statut || 'present',
        justification: pointage.justification || '',
      });
    }
  }, [pointage]);

  const handleSubmit = async () => {
    if (!pointage) return;

    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('pointages')
        .update({
          agent_id: parseInt(formData.agent_id),
          date_pointage: formData.date_pointage,
          heure_arrivee: formData.heure_arrivee || null,
          heure_depart: formData.heure_depart || null,
          statut: formData.statut,
          justification: formData.justification || null,
        })
        .eq('id', pointage.id);

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

  if (!pointage) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Éditer Pointage"
      icon="⏰"
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
        {/* Agent ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>👤</span> ID Agent
          </label>
          <input
            type="number"
            name="agent_id"
            value={formData.agent_id}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 bg-gray-50 cursor-not-allowed"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Non modifiable</p>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>📅</span> Date
          </label>
          <input
            type="date"
            name="date_pointage"
            value={formData.date_pointage}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Heures */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <span>🔔</span> Arrivée
            </label>
            <input
              type="time"
              name="heure_arrivee"
              value={formData.heure_arrivee}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <span>🔚</span> Départ
            </label>
            <input
              type="time"
              name="heure_depart"
              value={formData.heure_depart}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Statut avec cards colorées */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>🎯</span> Statut
          </label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, statut: status.value }))
                }
                className={`p-2 rounded-lg font-medium text-sm transition-all ${
                  formData.statut === status.value
                    ? `bg-gradient-to-r ${status.color} text-white shadow-lg scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Justification */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>📄</span> Justification
          </label>
          <textarea
            name="justification"
            value={formData.justification}
            onChange={handleChange}
            placeholder="Si besoin..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
          />
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700 flex gap-2">
          <span>ℹ️</span>
          <p>Les modifications seront mises à jour en temps réel dans le système.</p>
        </div>
      </div>
    </Modal>
  );
}
