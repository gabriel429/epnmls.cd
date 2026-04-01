'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Document } from '@/lib/types';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setDocuments(data || []);
    } catch (err) {
      setError('Erreur lors du chargement des documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(50);

      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: dbError } = await supabase
        .from('documents')
        .insert([
          {
            name: file.name,
            file_path: fileName,
            file_size: file.size,
            mime_type: file.type,
            is_public: false,
            is_active: true,
          },
        ]);

      if (dbError) throw dbError;

      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
      fetchDocuments();
    } catch (err) {
      setError('Erreur lors de l\'upload');
      console.error(err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container-main">
        <div className="py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📄 Documents</h1>
              <p className="text-gray-600">Gestion électronique des documents (GED)</p>
            </div>
          </div>

          {/* Upload Zone */}
          <div className="bg-white rounded-lg shadow p-8 mb-8 border-2 border-dashed border-blue-300">
            <label className="cursor-pointer text-center">
              <div className="text-4xl mb-3">📤</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Déposer des fichiers ici
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                ou cliquez pour sélectionner
              </p>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png"
              />
              {uploadProgress > 0 && (
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </label>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-8">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          )}

          {!loading && documents.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">Aucun document trouvé</p>
            </div>
          )}

          {!loading && documents.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="text-3xl mb-3">
                      {doc.mime_type?.includes('pdf') && '📕'}
                      {doc.mime_type?.includes('image') && '🖼️'}
                      {doc.mime_type?.includes('word') && '📘'}
                      {doc.mime_type?.includes('sheet') && '📗'}
                      {!doc.mime_type && '📄'}
                    </div>
                    <h3 className="font-medium text-gray-900 truncate">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(doc.file_size || 0)}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 btn btn-secondary text-sm">
                        Télécharger
                      </button>
                      <button className="flex-1 btn btn-secondary text-sm">
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-blue-600">
                {documents.length}
              </div>
              <p className="text-gray-600 text-sm">Documents</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-green-600">
                {(
                  documents.reduce((sum, d) => sum + (d.file_size || 0), 0) /
                  (1024 * 1024)
                ).toFixed(2)}
              </div>
              <p className="text-gray-600 text-sm">MB utilisés</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-purple-600">
                {documents.filter((d) => d.is_public).length}
              </div>
              <p className="text-gray-600 text-sm">Publics</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
