"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { Lugar } from "@/types";

export default function LugaresPage() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lugares")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setLugares(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4 pt-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Lugares
      </h1>

      {lugares.length === 0 ? (
        <p className="text-zinc-500">No hay lugares registrados.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lugares.map((lugar) => (
            <Link key={lugar.id} href={`/lugares/${lugar.id}`}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {lugar.nombre}
                </h3>
                {lugar.descripcion && (
                  <p className="mt-1 text-sm text-zinc-500">
                    {lugar.descripcion}
                  </p>
                )}
                <p className="mt-2 text-xs text-zinc-400">{lugar.direccion}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
