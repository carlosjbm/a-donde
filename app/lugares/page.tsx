"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Store, MapPin, CreditCard } from "lucide-react";
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
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Lugares
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Explora los lugares disponibles para tus compras
        </p>
      </div>

      {lugares.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Store className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <p className="text-zinc-500">No hay lugares registrados.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lugares.map((lugar) => (
            <Link key={lugar.id} href={`/lugares/${lugar.id}`}>
              <Card className="group h-full cursor-pointer transition-shadow hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
                    <Store className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-emerald-700 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                        {lugar.nombre}
                      </h3>
                      {lugar.transferencia ? (
                        <span
                          title="Acepta pago electrónico"
                          aria-label="Acepta pago electrónico"
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                        </span>
                      ) : null}
                    </div>
                    {lugar.descripcion && (
                      <p className="mt-0.5 text-sm text-zinc-500 line-clamp-2">
                        {lugar.descripcion}
                      </p>
                    )}
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-zinc-400">
                      <MapPin className="h-3 w-3" />
                      {lugar.direccion}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
