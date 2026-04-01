'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  icon?: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function Modal({
  isOpen,
  title,
  icon,
  children,
  onClose,
  onSubmit,
  isLoading,
  submitLabel = 'Créer',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40" onClick={onClose}></div>

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 opacity-100">
          {/* Header gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 pt-6 pb-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && <span className="text-3xl">{icon}</span>}
              <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-700 hover:bg-opacity-50 rounded-full p-1 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-8 bg-gradient-to-b from-white to-gray-50">
            {children}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            {onSubmit && (
              <button
                onClick={onSubmit}
                disabled={isLoading}
                className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    Traitement...
                  </span>
                ) : (
                  submitLabel
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

