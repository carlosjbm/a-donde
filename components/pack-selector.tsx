'use client';

import { useState, useEffect } from 'react';
import { UserPack } from '@/types';

interface PackSelectorProps {
  productName: string;
  onPackSelected: (packId: number) => void;
  onCancel: () => void;
}

export function PackSelector({ productName, onPackSelected, onCancel }: PackSelectorProps) {
  const [packs, setPacks] = useState<UserPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await fetch('/api/packs/mine');
        if (!response.ok) {
          throw new Error('Error al obtener packs');
        }
        const data = await response.json();
        setPacks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar packs');
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <p>Cargando packs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Agregar a un Pack</h3>
        <p className="text-sm text-gray-600 mb-4">
          Selecciona un pack para agregar &ldquo;{productName}&rdquo;:
        </p>

        {error && (
          <div className="text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        {packs.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No tienes ningún pack creado. Crea uno primero.
          </div>
        ) : (
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {packs.map((pack) => (
              <button
                key={pack.id}
                onClick={() => onPackSelected(pack.id)}
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">{pack.nombre}</div>
                <div className="text-sm text-gray-500">
                  {pack.productos?.length || 0} productos, ${pack.precio_total?.toLocaleString('es-CL')}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
