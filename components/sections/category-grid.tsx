"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Categoria } from "@/types";

const defaultCategories = [
  { id: 0, nombre: "Supermercados", descripcion: "", icono: "🛒" },
  { id: 0, nombre: "Carnicerías", descripcion: "", icono: "🥩" },
  { id: 0, nombre: "Panaderías", descripcion: "", icono: "🥖" },
  { id: 0, nombre: "Frutas y Verduras", descripcion: "", icono: "🥦" },
  { id: 0, nombre: "Lácteos", descripcion: "", icono: "🥛" },
  { id: 0, nombre: "Limpieza", descripcion: "", icono: "🧹" },
];

export function CategoryGrid() {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categorias")
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then((json) => {
        if (json.success) setCategories(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const display = loading
    ? []
    : categories.length > 0
      ? categories
      : defaultCategories;

  return (
    <section className="border-t border-zinc-200 bg-zinc-50/50 py-16 dark:border-zinc-800 dark:bg-black/50 sm:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
            Categorías
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Explora lugares por categoría
          </p>
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {display.map((cat) => (
              <Link
                key={cat.nombre}
                href={categories.length > 0 ? `/lugares?categoria=${cat.id}` : "#"}
                className="group flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-5 transition-all hover:border-emerald-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
              >
                <span className="text-3xl transition-transform group-hover:scale-110">
                  {cat.icono || "📍"}
                </span>
                <span className="text-center text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100">
                  {cat.nombre}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
