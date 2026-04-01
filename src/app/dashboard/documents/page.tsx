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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container-main">
        <div className="py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                📄 Documents
              </h1>
              <p className="text-gray-600">Gestion électronique des documents (GED)</p>
            </div>
          </div>

          {/* Upload Zone - Enhanced */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-8 border-2 border-dashed border-blue-300 hover:border-blue-500 hover:shadow-xl transition-all">
            <label className="cursor-pointer text-center block">
              <div className="text-6xl mb-4 animate-bounce">📤</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Déposer des fichiers ici
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                ou cliquez pour sélectionner (PDF, Word, Excel, Images...)
              </p>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png"
              />
              {uploadProgress > 0 && (
                <div className="mt-6 w-full">
                  <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{uploadProgress}% complété</p>
                </div>
              )}
            </label>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 mb-8 flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          )}

          {!loading && documents.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <p className="text-gray-600 text-lg">📁 Aucun document trouvé</p>
              <p className="text-gray-500 text-sm mt-2">Commencez par en télécharger un</p>
            </div>
          )}

          {!loading && documents.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden hover:scale-105 duration-200"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 border-b">
                    <div className="text-5xl mb-3">
                      {doc.mime_type?.includes('pdf') && '📕'}
                      {doc.mime_type?.includes('image') && '🖼️'}
                      {doc.mime_type?.includes('word') && '📘'}
                      {doc.mime_type?.includes('sheet') && '📗'}
                      {!doc.mime_type && '📄'}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 truncate text-lg mb-3">
                      {doc.name}
                    </h3>
                    <div className="space-y-2 mb-4 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">📊 Taille:</span> {formatFileSize(doc.file_size || 0)}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">📅 Date:</span>{' '}
                        {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-all hover:shadow-lg text-sm">
                        ⬇️ Télécharger
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-xl transition-all hover:shadow-lg text-sm">
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 border border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Documents</p>
                  <div className="text-4xl font-bold text-blue-600">{documents.length}</div>
                </div>
                <span className="text-3xl">📄</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-8 border border-green-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">MB utilisés</p>
                  <div className="text-4xl font-bold text-green-600">
                    {(
                      documents.reduce((sum, d) => sum + (d.file_size || 0), 0) /
                      (1024 * 1024)
                    ).toFixed(2)}
                  </div>
                </div>
                <span className="text-3xl">💾</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-8 border border-purple-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Publics</p>
                  <div className="text-4xl font-bold text-purple-600">
                    {documents.filter((d) => d.is_public).length}
                  </div>
                </div>
                <span className="text-3xl">🔓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
